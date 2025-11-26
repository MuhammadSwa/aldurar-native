import ThemeToggle from "@/components/ThemeToggle";
import { Stack } from "expo-router";

export default function AzkarLayout() {
  return <Stack
    screenOptions={{
      animation: "slide_from_right"
    }}
  >
    <Stack.Screen name="index"
      options={{
        headerShown: true,
        headerTransparent: true,
        headerRight: () => <ThemeToggle />,
      }} />
  </Stack>
}
