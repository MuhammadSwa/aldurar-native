import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, Linking, TouchableOpacity, FlatList } from 'react-native';
import { Title } from '@/components/Typography';
import EmptyState from '@/components/EmptyState';
import { IconIon } from '@/components/Icons';
import { getZikrFromCollection } from '@/lib/collections';
import { RichTextParser, parseZikrContent, ZikrItemRenderer, ParsedItem } from '@/components/parser';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

interface ZikrDetailViewProps {
  title: string;
  collectionName: string;
}

export function ZikrDetailView({ title, collectionName }: ZikrDetailViewProps) {
  // Fetch the specific zikr item
  const item = React.useMemo(
    () => getZikrFromCollection(collectionName, title),
    [collectionName, title]
  );

  // Parse content for FlatList virtualization
  const parsedContent = React.useMemo(() => {
    if (!item?.content) return [];
    return parseZikrContent(item.content);
  }, [item?.content]);

  const renderItem = React.useCallback(({ item }: { item: ParsedItem }) => (
    <View className="mx-3 bg-white dark:bg-slate-900 px-5 border-x border-slate-100 dark:border-slate-800">
      <ZikrItemRenderer item={item} />
    </View>
  ), []);

  const ListHeader = React.useCallback(() => {
    if (!item) return null;
    return (
      <View>
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

        {/* Content Card Top */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(700)}
          className="mx-3"
        >
          <View className="bg-white dark:bg-slate-900 rounded-t-[32px] shadow-sm border-x border-t border-slate-100 dark:border-slate-800 overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
              elevation: 2,
            }}>

            {/* Subtle gradient accent at top */}
            <View className="h-1.5 w-full bg-emerald-500/80" />

            {/* Notes Section */}
            <View className="px-5 pt-8">
              {item.notes ? (
                <View className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <Text className="text-base text-amber-700 dark:text-amber-400 leading-7 text-center font-medium bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl">
                    {item.notes}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }, [item]);

  const ListFooter = React.useCallback(() => {
    if (!item) return null;
    return (
      <View className="mb-6">
        {/* Content Card Bottom */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(700)}
          className="mx-3 mb-6"
        >
          <View className="bg-white dark:bg-slate-900 rounded-b-[32px] shadow-sm border-x border-b border-slate-100 dark:border-slate-800 overflow-hidden pb-8"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 15,
              elevation: 2,
            }}
          />
        </Animated.View>

        {/* Footer / References */}
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
      </View>
    );
  }, [item]);

  if (!item) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <Stack.Screen options={{ headerTitle: 'ذكر غير موجود' }} />
        <EmptyState message="ذكر غير موجود" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-950">
      <Stack.Screen options={{ headerTitle: item.title || 'بدون عنوان', headerBackTitle: "رجوع" }} />

      <FlatList
        data={parsedContent}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
}
