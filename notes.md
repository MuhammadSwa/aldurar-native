 pnpx expo run:android --variant arm64_v8aRelease
adb logcat | grep -i "aldulrar"
-- ZikrDetailsView
import { Stack } from 'expo-router';
import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity, FlatList, useWindowDimensions } from 'react-native';
import { Title } from '@/components/Typography';
import EmptyState from '@/components/EmptyState';
import { IconIon } from '@/components/Icons';
import { getCollection } from '@/lib/collections';
import { RichTextParser } from '@/components/parser';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Zikr } from '@/lib/types';

interface ZikrDetailViewProps {
  title: string;
  collectionName: string;
}

export function ZikrDetailView({ title, collectionName }: ZikrDetailViewProps) {
  const { width } = useWindowDimensions();
  const [currentTitle, setCurrentTitle] = useState(decodeURIComponent(title || ''));

  // Fetch the entire collection
  const collectionData = React.useMemo(
    () => getCollection(collectionName),
    [collectionName]
  );

  const items = collectionData?.collection || [];

  // Find initial index
  const initialIndex = React.useMemo(() => {
    const idx = items.findIndex(item => item.title === decodeURIComponent(title || ''));
    return idx >= 0 ? idx : 0;
  }, [items, title]);

  // Update title when page changes
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const item = viewableItems[0].item as Zikr;
      if (item.title) {
        setCurrentTitle(item.title);
      }
    }
  }).current;

  if (!items.length) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <EmptyState message="ذكر غير موجود" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Zikr }) => (
    <View style={{ width }} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* Elegant Header with Decorative Elements */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          className="px-6 pt-8 pb-6"
        >
          {/* Decorative top ornament */}
          <View className="items-center mb-6">
            <View className="flex-row items-center opacity-80">
              <Text className="text-2xl text-emerald-600 dark:text-emerald-400 opacity-60">۝</Text>
              <View className="h-[1px] w-20 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-3" />
              <Text className="text-4xl text-emerald-600 dark:text-emerald-400">❈</Text>
              <View className="h-[1px] w-20 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-3" />
              <Text className="text-2xl text-emerald-600 dark:text-emerald-400 opacity-60">۝</Text>
            </View>
          </View>

          {/* Title */}
          <Title className="text-center text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-tight tracking-wide">
            {item.title || 'بدون عنوان'}
          </Title>

          {/* Audio Button - More Prominent */}
          {item.url && (
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <TouchableOpacity
                onPress={() => Linking.openURL(item.url || '')}
                activeOpacity={0.8}
                className="mx-auto"
              >
                <View className="bg-emerald-600 dark:bg-emerald-700 rounded-full shadow-lg px-8 py-3 flex-row items-center justify-center border border-emerald-400/30"
                  style={{
                    shadowColor: '#10b981',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 8,
                  }}>
                  <IconIon name="play" size={24} className="text-white mr-1" />
                  <Text className="ml-2 text-white font-bold text-lg">استمع للصوت</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>

        {/* Content Card */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(700)}
          className="mx-3 mb-6"
        >
          <View className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
              elevation: 2,
            }}>

            {/* Subtle gradient accent at top */}
            <View className="h-1.5 w-full bg-emerald-500/80" />

            {/* Content Body with Better Padding */}
            <View className="px-5 py-8">
              {/* Notes Section */}
              {item.notes ? (
                <View className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <Text className="text-base text-amber-700 dark:text-amber-400 leading-7 text-center font-medium bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl">
                    {item.notes}
                  </Text>
                </View>
              ) : null}

              <RichTextParser content={item.content || ''} />
            </View>
          </View>
        </Animated.View>

        {/* Footer / References - More Elegant */}
        {item.footer && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(700)}
            className="mx-6 mb-8"
          >
            {/* Ornamental divider */}
            <View className="flex-row items-center justify-center mb-6 opacity-50">
              <View className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
              <Text className="mx-4 text-xl text-emerald-600 dark:text-emerald-400">✦</Text>
              <View className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
            </View>

            <View className="bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl px-5 py-4 border-r-4 border-amber-400 dark:border-amber-600">
              <View className="flex-row items-start">
                <IconIon name="information-circle" size={20} className="text-amber-600 dark:text-amber-500 mt-0.5 ml-3" />
                <View className="flex-1">
                  <RichTextParser content={item.footer} />
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Bottom decorative element */}
        <Animated.View
          entering={FadeIn.delay(600).duration(1000)}
          className="items-center mt-2 mb-8"
        >
          <Text className="text-3xl text-emerald-600 dark:text-emerald-400 opacity-20">۝</Text>
        </Animated.View>
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      {/* Set the Header Title Dynamically */}
      <Stack.Screen options={{ headerTitle: currentTitle, headerBackTitle: "رجوع" }} />

      <FlatList
        data={items}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => (
          { length: width, offset: width * index, index }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        // RTL support for horizontal lists is automatic in RN if I18nManager is set,
        // but we might need to invert the index if layout is RTL but list isn't behaving.
        // Assuming standard behavior for now.
        style={{ flex: 1 }}
      />
    </View>
  );
}
