import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import themes from '@/constants/design';

export default function TabLayout() {
  const { colorScheme } = useNativewindColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const primary = themes.themes[scheme].colors.primary;
  const muted = themes.themes[scheme].colors.muted;
  const background = themes.themes[scheme].colors.background;
  const border = themes.themes[scheme].colors.border;

  return <Tabs
    screenOptions={{
      // Hide the Tabs header and rely on per-tab Stack headers.
      headerShown: false,
      tabBarActiveTintColor: primary,
      tabBarInactiveTintColor: muted,
      tabBarStyle: { backgroundColor: background, borderTopColor: border },
    }}
  >
    <Tabs.Screen name="home" options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />
    }} />

    <Tabs.Screen name="awrad" options={{
      title: 'Awrad',
      tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />
    }} />
  </Tabs>
}
