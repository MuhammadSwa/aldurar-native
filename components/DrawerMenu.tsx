import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
// `react-native-drawer-layout` sometimes exports differently depending on the bundler / types.
// To avoid type issues during compilation, require it at runtime and treat as `any`.
// Support both named and default export shapes.
// @ts-ignore
const DrawerModule: any = require('react-native-drawer-layout');
const Drawer: any = DrawerModule.Drawer ?? DrawerModule.default ?? DrawerModule;
const DrawerPositions = Drawer?.positions ?? { Right: 'right', Left: 'left' };
import { View, TouchableOpacity, Text, ScrollView, Image, Linking } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import SectionHeader from './SectionHeader';
import { ThemeToggle } from './ThemeToggle';
import IconButton from './IconButton';
import Card from './Card';
import { Body } from './Typography';
import { IconFeather } from './Icons';
import { useRouter } from 'expo-router';
// Using Animated.View directly; static classes are applied via wrapper Views (nativewind)

export type MenuItem = {
  key: string;
  label: string;
  route?: string;
  onPress?: () => void;
};

type DrawerContextValue = { open: () => void; close: () => void } | undefined;
const DrawerContext = createContext<DrawerContextValue>(undefined);

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error('useDrawer must be used within DrawerMenuProvider');
  }
  return ctx;
}

export default function DrawerMenuProvider({ items, children, drawerWidth = 280 }: { items: MenuItem[]; children: React.ReactNode; drawerWidth?: number; }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  // Try to read version from app.json, fallback to 1.0.0
  let appVersion = '1.0.0';
  try {
    // @ts-ignore
    appVersion = require('../app.json').expo.version ?? appVersion;
  } catch (err) {
    // ignore
  }

  const open = () => {
    setIsOpen(true);
    headerProgress.value = withTiming(1, { duration: 240 });
  };
  const close = () => {
    setIsOpen(false);
    headerProgress.value = withTiming(0, { duration: 180 });
  };

  // Animation setup
  const headerProgress = useSharedValue(0);

  React.useEffect(() => {
    if (isOpen) {
      headerProgress.value = withTiming(1, { duration: 240 });
    } else {
      headerProgress.value = withTiming(0, { duration: 180 });
    }
  }, [isOpen, headerProgress]);

  // Close the drawer when the route changes (ensures drawer doesn't persist when switching tabs)
  // const pathname = usePathname();
  // React.useEffect(() => {
  //   if (isOpen) {
  //     close();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname]);

  const onItemPress = (item: MenuItem) => {
    close();
    if (item.onPress) return item.onPress();
    if (item.route) return router.push(item.route as any);
  };

  // A small animated wrapper to apply per-item animated styles using shared progress
  function AnimatedMenuItem({ index, progress, children }: { index: number; progress: SharedValue<number>; children: React.ReactNode }) {
    const style = useAnimatedStyle(() => {
      const offset = index * 0.06;
      let t = (progress.value - offset) / (1 - offset);
      t = Math.max(0, Math.min(1, t));
      const translate = interpolate(t, [0, 1], [18, 0]);
      return { opacity: t, transform: [{ translateX: translate }] } as any;
    });
    return <Animated.View style={style}>{children}</Animated.View>;
  }
  // Drawer content is a dedicated nested component so hooks can run at top level of it
  function DrawerContent() {
    const headerStyle = useAnimatedStyle(() => ({ opacity: headerProgress.value, transform: [{ translateY: interpolate(headerProgress.value, [0, 1], [6, 0]) }] }));

    return (
      <View className="flex-1 px-3 bg-background dark:bg-background-dark" style={{ paddingTop: 8 }}>
        <ScrollView contentContainerStyle={{ padding: 12 }}>
          <View className="mb-2">
            <Animated.View style={headerStyle}>
              <View className="w-9 h-1 rounded-full bg-gray-200 dark:bg-gray-700 self-center mb-2" />
              <Card className="p-4 mb-3 flex-row items-center">
                <Image source={require('../assets/images/icon.png')} className="w-12 h-12 rounded-lg" />
                <View className="mr-3">
                  <Text className="text-base font-semibold text-foreground">الدرر النقية</Text>
                  <Text className="text-xs text-muted-foreground">موسوعة درر هادفة</Text>
                  <Text className="text-xs text-muted-foreground">v{appVersion}</Text>
                </View>
                <View className="ml-auto">
                  <IconButton onPress={close} className="p-2">
                    <IconFeather name="x" size={20} className="text-foreground dark:text-foreground-dark" />
                  </IconButton>
                </View>
              </Card>
            </Animated.View>
          </View>

          <Card className="p-3 mb-3">
            <SectionHeader title="القائمة" />
            {items.map((item, idx) => (
              <AnimatedMenuItem key={item.key} index={idx} progress={headerProgress}>
                <TouchableOpacity onPress={() => onItemPress(item)} className="flex-row items-center py-3 px-2" accessibilityRole="button" accessibilityLabel={item.label}>
                  <IconFeather name={item.key === 'settings' ? 'settings' : item.key === 'about' ? 'info' : 'file-text'} size={18} className="text-foreground dark:text-foreground-dark" />
                  <Body className="mx-3 ">{item.label}</Body>
                </TouchableOpacity>
              </AnimatedMenuItem>
            ))}
          </Card>

          <Card className="p-3 mb-3">
            <SectionHeader title="المجموعات" />
            {/* Static collection examples - import a couple of collection titles to display */}
            <AnimatedMenuItem index={items.length + 0} progress={headerProgress}>
              <TouchableOpacity onPress={() => { onItemPress({ key: 'collection_morning', label: 'أذكار الصباح والمساء', route: '/collections/morning-evening' }); }} className="flex-row items-center py-3 px-2" accessibilityRole="button" accessibilityLabel="أذكار الصباح والمساء">
                <IconFeather name="book" size={18} className="text-foreground dark:text-foreground-dark" />
                <Body className="mx-3 ">أذكار الصباح والمساء</Body>
              </TouchableOpacity>
            </AnimatedMenuItem>
            <AnimatedMenuItem index={items.length + 1} progress={headerProgress}>
              <TouchableOpacity onPress={() => { onItemPress({ key: 'collection_salawat', label: 'مجموعة الصلوات', route: '/collections/salawat' }); }} className="flex-row items-center py-3 px-2" accessibilityRole="button" accessibilityLabel="مجموعة الصلوات">
                <IconFeather name="book" size={18} className="text-foreground dark:text-foreground-dark" />
                <Body className="mx-3 ">مجموعة الصلوات</Body>
              </TouchableOpacity>
            </AnimatedMenuItem>
          </Card>

          <Card className="p-3 mb-1">
            <SectionHeader title="خيارات" />
            {!items.find(i => i.key === 'settings') && (
              <AnimatedMenuItem index={items.length + 2} progress={headerProgress}>
                <TouchableOpacity onPress={() => onItemPress({ key: 'settings', label: 'الإعدادات', route: '/settings' })} className="flex-row items-center py-3 px-2" accessibilityRole="button" accessibilityLabel="الإعدادات">
                  <IconFeather name="settings" size={18} className="text-foreground dark:text-foreground-dark" />
                  <Body className="mx-3 ">الإعدادات</Body>
                </TouchableOpacity>
              </AnimatedMenuItem>
            )}
            <AnimatedMenuItem index={items.length + 3} progress={headerProgress}>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/MuhammadSwa/aldurar-native')} className="flex-row items-center py-3 px-2" accessibilityRole="button" accessibilityLabel="المشروع على GitHub">
                <IconFeather name="github" size={18} className="text-foreground dark:text-foreground-dark" />
                <Body className="mx-3 ">المشروع على GitHub</Body>
              </TouchableOpacity>
            </AnimatedMenuItem>
          </Card>

          <View className="px-3 pt-2">
            <ThemeToggle />
          </View>
        </ScrollView>
      </View>
    );
  }

  const value = useMemo(() => ({ open, close }), []);

  // Drawer expects a single child (the main content)
  return (
    <DrawerContext.Provider value={value}>
      <Drawer
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        onDrawerSlide={(progress: number) => {
          // Update shared header progress from drawer slide (UI-driven)
          headerProgress.value = progress;
        }}
        edgeWidth={36}
        drawerWidth={drawerWidth}
        drawerPosition={DrawerPositions.Right}
        // scrimColor provides a background overlay
        scrimColor={'rgba(0,0,0,0.45)'}
        renderDrawerContent={() => <DrawerContent />}
      >
        {children}
      </Drawer>
    </DrawerContext.Provider>
  );
}

export function DrawerToggle({ className }: { className?: string }) {
  const { open } = useDrawer();
  return (
    <IconButton onPress={open} className={className ?? 'p-0'} accessibilityLabel="Open menu">
      <IconFeather name="menu" size={20} className="text-foreground dark:text-foreground-dark" />
    </IconButton>
  );
}

// Styles are handled using NativeWind `className`.
