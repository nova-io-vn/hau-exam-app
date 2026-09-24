import { Tabs } from 'expo-router';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { FloatingTabBar } from './FloatingTabBar';

export function RoleBasedNavigator() {
  const colors = useThemeColors();
  return <Tabs tabBar={props => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0, height: 82, position: 'absolute' }, sceneStyle: { backgroundColor: colors.background } }}>
    <Tabs.Screen name="index" options={{ title: 'Trang chủ', tabBarAccessibilityLabel: 'Trang chủ' }} />
    <Tabs.Screen name="questions" options={{ title: 'Câu hỏi', tabBarAccessibilityLabel: 'Câu hỏi' }} />
    <Tabs.Screen name="ai" options={{ title: 'AI', tabBarAccessibilityLabel: 'HAU QM AI' }} />
    <Tabs.Screen name="documents" options={{ title: 'Tài liệu', tabBarAccessibilityLabel: 'Tài liệu' }} />
    <Tabs.Screen name="messages" options={{ title: 'Tin nhắn', tabBarAccessibilityLabel: 'Tin nhắn' }} />
    <Tabs.Screen name="notifications" options={{ title: 'Thông báo', tabBarAccessibilityLabel: 'Thông báo' }} />
    <Tabs.Screen name="more" options={{ href: null }} />
  </Tabs>;
}
