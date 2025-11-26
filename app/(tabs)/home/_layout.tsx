import { ThemeToggle } from "@/components/ThemeToggle";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return <Stack >
    <Stack.Screen name="index"
      options={{
        title: "الدرر النقية",
        headerRight: () => <ThemeToggle />
      }} />
  </Stack>
}
