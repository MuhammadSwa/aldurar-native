import { View, Text, ScrollView } from 'react-native';
import { ThemeToggle } from '@/components/ThemeToggle';
import Card from '@/components/Card';
import { Muted } from '@/components/Typography';

export default function SettingsScreen() {
  return (
    <ScrollView className="bg-background" contentContainerClassName="p-4">
      <View className="py-2">
        <Text className="text-2xl font-bold text-foreground text-right">الإعدادات</Text>
      </View>

      <Card className="mt-4 px-0 py-0">
        <Text className="text-base font-semibold text-foreground mb-2 text-right">المظهر</Text>
        <Muted className="mb-3 text-right">اختر نمط المظهر للتطبيق (فاتح/داكن)</Muted>
        <View className="flex-row justify-end items-center">
          <ThemeToggle />
        </View>
      </Card>

      {/* Additional settings sections can be added here */}
      <View className="mt-3 px-3">
        <Text className="text-muted-foreground text-right">قسم آخر في الاعدادات (مثلاً اللغة أو الإشعارات)</Text>
      </View>
    </ScrollView>
  );
}