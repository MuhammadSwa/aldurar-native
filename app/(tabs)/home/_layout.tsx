// ThemeToggle moved to Settings screen
import { DrawerToggle } from '@/components/DrawerMenu';
import { Stack } from "expo-router";
import { View, I18nManager } from 'react-native';
import { Title as HeaderTitle } from '@/components/Typography';
import { useColorScheme } from 'nativewind';
import themes from '@/constants/design';

export default function HomeLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const headerBg = themes.themes[scheme].colors.surface;
  const headerTint = themes.themes[scheme].colors.onSurface;

  return (
    <Stack >
        <Stack.Screen name="index"
          options={{
            headerStyle: { backgroundColor: headerBg },
            headerTintColor: headerTint,
            headerTitle: () => {
              return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <DrawerToggle className="mr-3" />
                  <HeaderTitle style={{ color: headerTint }}>
                    {"الدرر النقية"}
                  </HeaderTitle>
                </View>
              );
            }
          }} />
      </Stack>
  );
}
