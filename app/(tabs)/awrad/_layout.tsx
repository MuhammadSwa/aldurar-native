import { Stack } from "expo-router";

export default function AzkarLayout() {
  return <Stack
  >
    <Stack.Screen name="index"
      options={{
        title: "أوراد الطريقة",
      }}
    />
  </Stack>
}
