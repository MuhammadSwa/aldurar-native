import { Text, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
      className="bg-primary px-4 py-2 rounded-md"
    >
      <Text className="text-primary-foreground">
        Current: {colorScheme}
      </Text>
    </Pressable>
  );
}
