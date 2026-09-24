/* eslint-disable react-hooks/set-state-in-effect -- initial screen load is an intentional async resource subscription. */
import { useCallback, useEffect, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { AppScreen, Button, Card, StatusBadge } from '@/src/components/ui';
import { AppHeader, EmptyState, ErrorState, LoadingIndicator } from '@/src/components/shared';
import { aiApi, type DocumentItem } from '@/src/features/ai/api/aiApi';
import { normalizeError } from '@/src/services/api/errors';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { spacing, typography } from '@/src/theme/tokens';

const FILE_TYPES = ['text/plain', 'text/markdown', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
const extensionIcon = (name: string) => name.toLowerCase().endsWith('.pdf') ? 'PDF' : name.toLowerCase().endsWith('.docx') ? 'DOCX' : name.toLowerCase().endsWith('.xlsx') ? 'XLSX' : name.toLowerCase().endsWith('.pptx') ? 'PPTX' : name.toLowerCase().endsWith('.md') ? 'MD' : 'TXT';

export function DocumentsScreen() {
  const colors = useThemeColors();
  const [items, setItems] = useState<DocumentItem[]>([]); const [loading, setLoading] = useState(true); const [refreshing, setRefreshing] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState<string | null>(null);
  const load = useCallback(async (refresh = false) => { if (refresh) setRefreshing(true); else setLoading(true); setError(null); try { setItems((await aiApi.documents()).items); } catch (cause) { setError(normalizeError(cause).message); } finally { setLoading(false); setRefreshing(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  async function upload() { const result = await DocumentPicker.getDocumentAsync({ type: FILE_TYPES, copyToCacheDirectory: true, multiple: false }); if (result.canceled) return; const file = result.assets[0]; setUploading(true); setError(null); try { await aiApi.uploadDocument({ uri: file.uri, name: file.name, mimeType: file.mimeType || 'application/octet-stream' }); await load(true); } catch (cause) { setError(normalizeError(cause).message); } finally { setUploading(false); } }
  if (loading) return <AppScreen><AppHeader title="Tài liệu" subtitle="Tài liệu cho HAU QM AI" /><LoadingIndicator label="Đang tải tài liệu" /></AppScreen>;
  return <AppScreen><AppHeader title="Tài liệu" subtitle="TXT · MD · PDF · DOCX · XLSX · PPTX" /><Button title="Tải tài liệu lên" loading={uploading} disabled={uploading} onPress={() => void upload()} />{error && <ErrorState title={error} onRetry={() => void load()} />}<FlatList data={items} keyExtractor={item => item.id} contentContainerStyle={items.length ? styles.list : styles.empty} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={colors.accent} />} renderItem={({ item }) => <Card><View style={styles.row}><View style={[styles.fileIcon, { backgroundColor: colors.accentSoft }]}><Text style={[styles.fileIconText, { color: colors.accent }]}>{extensionIcon(item.originalName)}</Text></View><View style={styles.copy}><Text numberOfLines={2} style={[styles.name, { color: colors.text }]}>{item.originalName}</Text><Text style={[styles.meta, { color: colors.textSecondary }]}>{item.contentType} · {(item.size / 1024).toFixed(1)} KB</Text></View><StatusBadge label="Sẵn sàng" tone="success" /></View></Card>} ListEmptyComponent={<EmptyState title="Chưa có tài liệu" description="Tải tài liệu lên để dùng làm ngữ cảnh cho AI." />} /></AppScreen>;
}
const styles = StyleSheet.create({ list: { gap: spacing.md, paddingTop: spacing.lg, paddingBottom: 110 }, empty: { flexGrow: 1, paddingTop: spacing.xl }, row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md }, fileIcon: { alignItems: 'center', borderRadius: 10, height: 48, justifyContent: 'center', width: 54 }, fileIconText: { fontSize: 11, fontWeight: '800' }, copy: { flex: 1 }, name: { fontSize: typography.body, fontWeight: '700' }, meta: { fontSize: typography.caption, marginTop: spacing.xs } });
