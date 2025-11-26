import React from 'react';
import { View, Text, ViewProps } from 'react-native';

export default function SectionHeader({ title, right, className = '', center = false, ...props }: { title: string; right?: React.ReactNode; className?: string; center?: boolean } & ViewProps) {
  return (
    <View className={`mb-4 border-b border-border dark:border-border-dark pb-3 ${className}`} {...props}>
      <View className={`flex-row ${center ? 'justify-center' : 'justify-between'} items-center`}>
        <Text className={`text-2xl font-bold text-primary dark:text-primary-dark ${center ? 'text-center' : ''}`}>{title}</Text>
        {right && <View>{right}</View>}
      </View>
    </View>
  );
}
