import { Tabs } from 'expo-router';
import { useThemeColors } from '@/src/theme/useThemeColors';
import { FloatingTabBar } from './FloatingTabBar';
import { useAuth } from '@/src/app/providers/AppProviders';
import { tabLabelsByRole, type MobileRole } from './roleNavigation';

export function RoleBasedNavigator() {
  const colors = useThemeColors();
  const role = (useAuth().session?.role || 'USER') as MobileRole;
  const labels = tabLabelsByRole[role];
  return <Tabs tabBar={props => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0, height: 82, position: 'absolute' }, sceneStyle: { backgroundColor: colors.background } }}>
    <Tabs.Screen name="index" options={{ title: labels.index, tabBarAccessibilityLabel: labels.index }} />
    <Tabs.Screen name="questions" options={{ title: labels.questions, tabBarAccessibilityLabel: labels.questions }} />
    <Tabs.Screen name="ai" options={{ title: labels.ai, tabBarAccessibilityLabel: labels.ai }} />
    <Tabs.Screen name="documents" options={{ title: 'Tài liệu', tabBarAccessibilityLabel: 'Tài liệu' }} />
    <Tabs.Screen name="messages" options={{ title: labels.messages, tabBarAccessibilityLabel: labels.messages }} />
    <Tabs.Screen name="notifications" options={{ title: labels.notifications, tabBarAccessibilityLabel: labels.notifications }} />
    <Tabs.Screen name="more" options={{ title: labels.more, tabBarAccessibilityLabel: labels.more }} />
  </Tabs>;
}
