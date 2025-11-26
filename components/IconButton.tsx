import React from 'react';
import { Pressable } from 'react-native';

interface IconButtonProps {
  children: React.ReactNode;
  onPress?: (e?: any) => void;
  className?: string;
  accessibilityLabel?: string;
  hitSlop?: any;
}

export default function IconButton({ children, onPress, className = '', accessibilityLabel, hitSlop }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`p-2 rounded-full active:opacity-80 ${className}`}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
    >
      {children}
    </Pressable>
  );
}
