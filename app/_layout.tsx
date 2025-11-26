// app/_layout.tsx
import '@/global.css';
import { setupRTL } from "@/lib/rtl-setup";
import { Stack } from 'expo-router';
import DrawerMenuProvider from '@/components/DrawerMenu';
import { useColorScheme } from 'nativewind';
import themes from '@/constants/design';

export {
  ErrorBoundary,
} from 'expo-router';

setupRTL();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const headerBg = themes.themes[scheme].colors.surface;
  const headerTint = themes.themes[scheme].colors.onSurface;

  return (
    <DrawerMenuProvider items={[{ key: 'about', label: 'حول', route: '/about' }, { key: 'settings', label: 'الإعدادات', route: '/settings' }]}>
      <Stack>
        {/* Main Tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Stack screens on top of tabs (push onto root stack) */}
        <Stack.Screen
          name="settings"
          options={{ headerShown: true, title: 'الإعدادات', headerStyle: { backgroundColor: headerBg }, headerTintColor: headerTint }}
        />
        <Stack.Screen
          name="about"
          options={{ headerShown: true, title: 'حول', headerStyle: { backgroundColor: headerBg }, headerTintColor: headerTint }}
        />
      </Stack>
    </DrawerMenuProvider>
  );
}
