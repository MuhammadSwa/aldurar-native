import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

type BaseTextProps = RNTextProps & {
  className?: string;
  children: React.ReactNode;
};

export function Title({ className = '', children, ...props }: BaseTextProps) {
  return (
    <RNText className={`text-2xl font-bold text-foreground dark:text-foreground-dark ${className}`} {...props}>
      {children}
    </RNText>
  );
}

export function Heading({ className = '', children, ...props }: BaseTextProps) {
  return (
    <RNText className={`text-xl font-semibold text-foreground dark:text-foreground-dark ${className}`} {...props}>
      {children}
    </RNText>
  );
}

export function Body({ className = '', children, ...props }: BaseTextProps) {
  return (
    <RNText className={`text-base text-foreground dark:text-foreground-dark ${className}`} {...props}>
      {children}
    </RNText>
  );
}

export function Muted({ className = '', children, ...props }: BaseTextProps) {
  return (
    <RNText className={`text-sm text-muted-foreground dark:text-muted-dark ${className}`} {...props}>
      {children}
    </RNText>
  );
}

export function Small({ className = '', children, ...props }: BaseTextProps) {
  return (
    <RNText className={`text-xs text-muted-foreground dark:text-muted-dark ${className}`} {...props}>
      {children}
    </RNText>
  );
}

export default Body;
