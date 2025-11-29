import { Stack } from "expo-router";
import { DrawerToggle } from '@/components/DrawerMenu';
import { View, I18nManager } from 'react-native';
import { Title as HeaderTitle } from '@/components/Typography';
import { useHeaderTheme } from '@/lib/hooks/useHeaderTheme';

export default function AzkarLayout() {
  const { headerBg, headerTint } = useHeaderTheme();

  return (
    <Stack>
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
        }}
      />
      <Stack.Screen name="[collectionName]"
        options={{
          headerStyle: { backgroundColor: headerBg },
          headerTintColor: headerTint,
          headerBackTitle: 'Back',
        }} />
    </Stack>
  );
}
