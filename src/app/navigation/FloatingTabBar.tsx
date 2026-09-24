import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { radius, spacing } from '@/src/theme/tokens';
import { notificationApi } from '@/src/features/notifications/api/notificationApi';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = { index: 'home-outline', questions: 'document-text-outline', ai: 'sparkles-outline', documents: 'folder-open-outline', messages: 'chatbubbles-outline', notifications: 'notifications-outline' };
const labels: Record<string, string> = { index: 'Trang chủ', questions: 'Câu hỏi', ai: 'AI', documents: 'Tài liệu', messages: 'Tin nhắn', notifications: 'Thông báo' };

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets(); const colors = useThemeColors();
  const [notificationUnread, setNotificationUnread] = useState(0);
  useEffect(() => { let active = true; const refresh = () => { void notificationApi.unreadCount().then(result => { if (active) setNotificationUnread(result.count); }).catch(() => undefined); }; refresh(); const timer = setInterval(refresh, 30000); return () => { active = false; clearInterval(timer); }; }, []);
  return <View pointerEvents="box-none" style={[styles.host, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}><View style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.border }]}>{state.routes.map((route, index) => {
    const options = descriptors[route.key].options; const focused = state.index === index; const badge = route.name === 'notifications' ? notificationUnread || undefined : options.tabBarBadge;
    const onPress = () => { const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true }); if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params); };
    return <Pressable key={route.key} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={options.tabBarAccessibilityLabel || labels[route.name]} onPress={onPress} style={styles.item}><View style={[styles.iconWrap, focused && { backgroundColor: colors.accentSoft }]}><Ionicons name={icons[route.name] || 'ellipse-outline'} size={22} color={focused ? colors.accent : colors.textSecondary} />{badge !== undefined && badge !== null && <View style={[styles.badge, { backgroundColor: colors.danger }]}><Text style={styles.badgeText}>{typeof badge === 'number' && badge > 99 ? '99+' : String(badge)}</Text></View>}</View></Pressable>;
  })}</View></View>;
}
const styles = StyleSheet.create({ host: { bottom: 0, left: 0, paddingHorizontal: spacing.md, position: 'absolute', right: 0 }, pill: { alignItems: 'center', borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth, elevation: 8, flexDirection: 'row', justifyContent: 'space-around', minHeight: 68, paddingHorizontal: spacing.xs, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 6 } }, item: { alignItems: 'center', flex: 1, justifyContent: 'center', minHeight: 60, minWidth: 44 }, iconWrap: { alignItems: 'center', borderRadius: radius.pill, height: 44, justifyContent: 'center', position: 'relative', width: 48 }, badge: { alignItems: 'center', borderRadius: 9, minWidth: 18, paddingHorizontal: 4, position: 'absolute', right: -1, top: -3 }, badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' } });
