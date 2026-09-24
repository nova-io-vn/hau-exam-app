import { StyleSheet, Text, View } from 'react-native';
import { AppScreen, Card } from '@/src/components/ui';
import { AppHeader } from '@/src/components/shared';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { spacing, typography } from '@/src/theme/tokens';

export function HumanChatScreen() { const colors = useThemeColors(); return <AppScreen><AppHeader title="Tin nhắn" subtitle="Trao đổi trực tiếp với HAU QM" /><Card style={styles.card}><View style={[styles.icon, { backgroundColor: colors.accentSoft }]}><Text style={[styles.iconText, { color: colors.accent }]}>?</Text></View><Text style={[styles.title, { color: colors.text }]}>Human Chat chưa được kết nối</Text><Text style={[styles.body, { color: colors.textSecondary }]}>Workspace hiện chưa có API contract cho danh bạ, cuộc trò chuyện, ảnh đính kèm và realtime Human Chat. Màn hình này không gọi endpoint giả.</Text></Card></AppScreen>; }
const styles = StyleSheet.create({ card: { alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, padding: spacing.xl }, icon: { alignItems: 'center', borderRadius: 28, height: 56, justifyContent: 'center', marginBottom: spacing.md, width: 56 }, iconText: { fontSize: 28, fontWeight: '800' }, title: { fontSize: typography.heading, fontWeight: '800', textAlign: 'center' }, body: { fontSize: typography.body, lineHeight: 24, marginTop: spacing.md, textAlign: 'center' } });
