import { useColorScheme } from 'nativewind';
import themes from '@/constants/design';

/**
 * Custom hook to get header theme colors based on current color scheme
 * Returns backgroundColor and tintColor for Stack.Screen header styling
 */
export function useHeaderTheme() {
    const { colorScheme } = useColorScheme();
    const scheme = colorScheme === 'dark' ? 'dark' : 'light';

    return {
        headerBg: themes.themes[scheme].colors.surface,
        headerTint: themes.themes[scheme].colors.onSurface,
    };
}
