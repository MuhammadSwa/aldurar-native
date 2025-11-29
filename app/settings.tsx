import { View, Text, ScrollView } from 'react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import Card from '@/components/Card';
import { Muted } from '@/components/Typography';



export default function SettingsScreen() {
  return (
    <ScrollView className="bg-background dark:bg-background-dark" contentContainerClassName="p-4">
      <View className="py-2">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark ">الإعدادات</Text>
      </View>

      <Card className="mt-4 px-0 py-0">
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark  mb-2 ">المظهر</Text>
        <Muted className="mb-3 ">اختر نمط المظهر للتطبيق (فاتح/داكن)</Muted>
        <View className="flex-row justify-end items-center">
          <ThemeToggle />
        </View>
      </Card>

      {/* Additional settings sections can be added here */}
      <View className="mt-3 px-3">
        <Text className="text-muted-foreground dark:text-muted-dark-foreground ">قسم آخر في الاعدادات (مثلاً اللغة أو الإشعارات)</Text>
      </View>
    </ScrollView>
  );
}
