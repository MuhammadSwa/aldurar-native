import { Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const label = colorScheme === 'dark' ? 'داكن' : 'فاتح';
  return (
    <Pressable
      onPress={toggleColorScheme}
      className="bg-primary px-4 py-2 rounded-md"
      accessibilityLabel="تبديل المظهر"
    >
      <Text className="text-primary-foreground">
        الوضع الحالي: {label}
      </Text>
    </Pressable>
  );
}
