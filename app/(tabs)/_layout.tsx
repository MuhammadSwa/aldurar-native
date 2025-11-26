import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';

export default function TabLayout() {
  return <Tabs
    screenOptions={{
      headerShown: false
    }}
  >
    <Tabs.Screen name="home" options={{
      title: 'Home',
      tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />
    }} />

    <Tabs.Screen name="azkar" options={{
      title: 'Azkar',
      tabBarIcon: ({ color }) => <Feather name="list" size={24} color={color} />
    }} />
  </Tabs>
}
