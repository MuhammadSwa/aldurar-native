import React from 'react';
import { View } from 'react-native';
import { Muted } from './Typography';

export default function EmptyState({ message = 'لا توجد عناصر' }: { message?: string }) {
  return (
    <View className="flex-1 items-center justify-center">
      <Muted className="text-lg">{message}</Muted>
    </View>
  );
}
