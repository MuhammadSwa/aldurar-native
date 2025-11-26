import React from 'react';
import { View, ViewProps } from 'react-native';

type CardProps = ViewProps & {
  children?: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = '', style, ...props }: CardProps) {
  return (
    <View
      className={`bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-3 shadow ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
}
