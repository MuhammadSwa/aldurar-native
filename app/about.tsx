import { View, Text, ScrollView } from 'react-native';
import Card from '@/components/Card';
import { Heading, Body, Muted } from '@/components/Typography';

export default function AboutScreen() {
  return (
    <ScrollView className="bg-background dark:bg-background-dark" contentContainerClassName="p-4">
      <View className="py-2">
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark ">حول التطبيق</Text>
      </View>
      <Card className="mt-4">
        <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">نبذة</Text>
        <Muted className="mt-2 ">
          هذا التطبيق يحتوي على مورد درر نقية، وأوراد، وأذكار صباح ومساء، بالإضافة إلى مجموعات مختارة لتسهيل الوصول والتلاوة.
        </Muted>
      </Card>
    </ScrollView>
  );
}
