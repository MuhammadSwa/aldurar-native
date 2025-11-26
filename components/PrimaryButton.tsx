import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Text } from 'react-native';

type PrimaryButtonProps = TouchableOpacityProps & {
  children?: React.ReactNode;
  className?: string;
};

export default function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity className={`bg-primary px-4 py-2 rounded-md ${className}`} {...props} accessibilityRole="button">
      <Text className="text-primary-foreground text-base">{children}</Text>
    </TouchableOpacity>
  );
}
