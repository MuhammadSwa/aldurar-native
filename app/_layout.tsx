// app/_layout.tsx
import '@/global.css';
import { setupRTL } from "@/lib/rtl-setup";
import { Stack } from 'expo-router';

export {
  ErrorBoundary,
} from 'expo-router';

setupRTL();

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
