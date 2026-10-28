/* eslint-disable react-hooks/set-state-in-effect -- REST synchronization updates dashboard state. */
import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen, Button, Card, StatusBadge } from '@/src/components/ui';
import { AppHeader, DashboardMetricSkeleton, EmptyState, ErrorState, ListSkeleton } from '@/src/components/shared';
import { useAuth } from '@/src/app/providers/AppProviders';
import { questionApi, type Question, type QuestionStatistics } from '@/src/features/questions/api/questionApi';
import { adminApi, type AdminUser } from '@/src/features/admin/api/adminApi';
import { spacing, typography } from '@/src/theme/tokens';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { formatAcademicName } from '@/src/features/profile/utils/academicName';
import { normalizeError } from '@/src/services/api/errors';

export function HomeScreen() {
  const role = useAuth().session?.role || 'USER';
  return role === 'SYSTEM_ADMIN' ? <SystemAdminHome /> : <AcademicHome role={role} />;
}

function SystemAdminHome() {
  const router = useRouter();
  const colors = useThemeColors();
  const { session } = useAuth();
  const [summary, setSummary] = useState({ lecturers: 0, subjectAdmins: 0, pending: 0 });
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [lecturers, subjectAdmins, pending] = await Promise.all([
        adminApi.listUsers(0, 1, { role: 'USER', status: 'ACTIVE' }),
        adminApi.listUsers(0, 1, { role: 'SUBJECT_ADMIN', status: 'ACTIVE' }),
        adminApi.listUsers(0, 3, { status: 'PENDING_APPROVAL' }),
      ]);
      setSummary({ lecturers: lecturers.totalElements, subjectAdmins: subjectAdmins.totalElements, pending: pending.totalElements });
      setPendingUsers(pending.content);
    } catch (cause) { setError(normalizeError(cause).message); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <AppScreen><AppHeader title="Tổng quan" /><DashboardMetricSkeleton count={3} /><ListSkeleton count={3} /></AppScreen>;
  if (error) return <AppScreen><AppHeader title="Tổng quan" /><ErrorState title={error} onRetry={() => void load()} /></AppScreen>;
  const cards = [['Giảng viên', summary.lecturers, 'people-outline'], ['Quản trị chuyên môn', summary.subjectAdmins, 'shield-checkmark-outline'], ['Chờ phê duyệt', summary.pending, 'time-outline']] as const;
  return <AppScreen><ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.accent} />} contentContainerStyle={styles.content}>
    <AppHeader title={`Xin chào, ${formatAcademicName(session || {})}`} subtitle="Quản trị hệ thống HAU Exam" />
    <View style={styles.actions}><Button title="Giảng viên" icon={<Ionicons name="people-outline" size={18} color={colors.white} />} onPress={() => router.push('/admin/users')} /><Button title="Chờ duyệt" variant="secondary" icon={<Ionicons name="checkmark-done-outline" size={18} color={colors.accent} />} onPress={() => router.push('/admin/approvals')} /><Button title="Tin nhắn" variant="secondary" icon={<Ionicons name="chatbubbles-outline" size={18} color={colors.accent} />} onPress={() => router.push('/(tabs)/messages')} /></View>
    <MetricGrid cards={cards} />
    <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.text }]}>Tài khoản chờ duyệt</Text><Pressable onPress={() => router.push('/admin/approvals')}><Text style={[styles.link, { color: colors.accent }]}>Xem tất cả</Text></Pressable></View>
    {pendingUsers.length ? pendingUsers.map(item => <Pressable key={item.id} onPress={() => router.push({ pathname: '/admin/registration/[id]', params: { id: item.id } })}><Card><Text style={[styles.question, { color: colors.text }]}>{item.fullName || 'Không xác định'}</Text><Text style={[styles.muted, { color: colors.textSecondary }]}>{item.lecturerCode} · {item.email}</Text><View style={styles.meta}><Text style={[styles.muted, { color: colors.textSecondary }]}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text><StatusBadge label={item.status} tone="warning" /></View></Card></Pressable>) : <EmptyState title="Không có tài khoản chờ duyệt" description="Danh sách sẽ tự cập nhật khi có đăng ký mới." />}
  </ScrollView></AppScreen>;
}

function AcademicHome({ role }: { role: 'SUBJECT_ADMIN' | 'USER' }) {
  const router = useRouter();
  const { session } = useAuth();
  const colors = useThemeColors();
  const [stats, setStats] = useState<QuestionStatistics | null>(null);
  const [recent, setRecent] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const [summary, list] = await Promise.all([questionApi.statistics(), questionApi.search({ page: 0, size: 3, ...(role === 'SUBJECT_ADMIN' ? { status: 'PENDING_REVIEW' as const } : {}) })]);
      setStats(summary); setRecent(list.items);
    } catch (cause) { setError(normalizeError(cause).message); }
    finally { setLoading(false); setRefreshing(false); }
  }, [role]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <AppScreen><AppHeader title="Tổng quan" /><DashboardMetricSkeleton count={4} /><ListSkeleton count={3} /></AppScreen>;
  if (error) return <AppScreen><AppHeader title="Tổng quan" /><ErrorState title={error} onRetry={() => void load()} /></AppScreen>;
  const cards = [['Tổng câu hỏi', stats?.total ?? 0, 'document-text-outline'], ['Đã phê duyệt', stats?.approved ?? 0, 'checkmark-circle-outline'], ['Chờ duyệt', stats?.pendingReview ?? 0, 'time-outline'], ['Cần chỉnh sửa', stats?.needRevision ?? 0, 'create-outline']] as const;
  const faculty = session?.facultyName || (session?.facultyId ? `Khoa ${session.facultyId}` : 'Chưa cập nhật Khoa');
  return <AppScreen><ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.accent} />} contentContainerStyle={styles.content}>
    <AppHeader title={`Xin chào, ${formatAcademicName(session || {})}`} subtitle={faculty} />
    <View style={styles.actions}>{role === 'USER' ? <><Button title="Công việc" icon={<Ionicons name="clipboard-outline" size={18} color={colors.white} />} onPress={() => router.push('/assignments')} /><Button title="Tạo câu hỏi" variant="secondary" icon={<Ionicons name="add-circle-outline" size={18} color={colors.accent} />} onPress={() => router.push('/question/create')} /><Button title="Tạo bằng AI" variant="secondary" icon={<Ionicons name="sparkles-outline" size={18} color={colors.accent} />} onPress={() => router.push('/ai')} /></> : <><Button title="Câu hỏi chờ duyệt" icon={<Ionicons name="checkmark-done-outline" size={18} color={colors.white} />} onPress={() => router.push('/review')} /><Button title="Đề thi" variant="secondary" icon={<Ionicons name="albums-outline" size={18} color={colors.accent} />} onPress={() => router.push('/exams')} /></>}</View>
    <MetricGrid cards={cards} />
    <View style={styles.sectionHead}><Text style={[styles.sectionTitle, { color: colors.text }]}>{role === 'SUBJECT_ADMIN' ? 'Câu hỏi chờ duyệt gần đây' : 'Câu hỏi gần đây'}</Text><Pressable onPress={() => router.push('/(tabs)/questions')}><Text style={[styles.link, { color: colors.accent }]}>Xem tất cả</Text></Pressable></View>
    {recent.length ? recent.map(item => <Pressable key={item.id} onPress={() => router.push(role === 'SUBJECT_ADMIN' ? { pathname: '/review/[id]', params: { id: item.id } } : { pathname: '/question/[id]', params: { id: item.id } })}><Card><Text numberOfLines={2} style={[styles.question, { color: colors.text }]}>{item.content}</Text><View style={styles.meta}><Text style={[styles.muted, { color: colors.textSecondary }]}>{new Date(item.updatedAt).toLocaleDateString('vi-VN')}</Text><StatusBadge label={item.status} tone={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'danger' : 'warning'} /></View></Card></Pressable>) : <EmptyState title={role === 'SUBJECT_ADMIN' ? 'Không có câu hỏi chờ duyệt' : 'Chưa có câu hỏi'} description={role === 'SUBJECT_ADMIN' ? 'Hàng đợi đã được xử lý.' : 'Tạo câu hỏi thủ công hoặc sử dụng AI hỗ trợ.'} />}
  </ScrollView></AppScreen>;
}

function MetricGrid({ cards }: { cards: readonly (readonly [string, number, keyof typeof Ionicons.glyphMap])[] }) {
  const colors = useThemeColors();
  return <View style={styles.grid}>{cards.map(([label, value, icon]) => <Card key={label} style={styles.stat}><Ionicons name={icon} size={20} color={colors.accent} /><Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text><Text style={[styles.value, { color: colors.text }]}>{value.toLocaleString('vi-VN')}</Text></Card>)}</View>;
}

const styles = StyleSheet.create({ content: { gap: spacing.md, paddingBottom: 112 }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, stat: { flexBasis: '47%', flexGrow: 1, gap: spacing.xs }, label: { fontSize: typography.caption }, value: { fontSize: 24, fontWeight: '800', marginTop: spacing.xs }, sectionHead: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }, sectionTitle: { flex: 1, fontSize: typography.body, fontWeight: '800' }, link: { fontSize: typography.caption, fontWeight: '700' }, question: { fontSize: typography.label, fontWeight: '600' }, meta: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md }, muted: { fontSize: typography.caption, marginTop: spacing.xs } });
