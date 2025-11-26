import { Button } from '@/components/ui/button';
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';

export default function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
  };


  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
