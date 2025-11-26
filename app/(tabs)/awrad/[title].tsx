import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import Card from '@/components/Card';
import { Title, Heading, Body, Muted } from '@/components/Typography';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { IconIon } from '@/components/Icons';

// Import your JSON data here
import salawatYousria from "azkar/collections/salawatYousriaCollection.json";

export default function ZikrDetailScreen() {
  // 1. Get the param (use 'id' or 'zikr' depending on what you passed in router.push)
  // Based on your previous snippet, you passed title as the ID.
  const { title } = useLocalSearchParams();

  // 2. Find the specific Zikr object
  // decodeURIComponent helps if the title has special characters like spaces
  const item = salawatYousria.find((z) => z.title === title || z.title === decodeURIComponent(title as string));

  if (!item) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <EmptyState message="Azkar not found" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Set the Header Title Dynamically */}
      <Stack.Screen options={{ headerTitle: item.title, headerBackTitle: "Back" }} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title={item.title} right={item.url ? (
          <PrimaryButton
            onPress={() => Linking.openURL(item.url)}
            className="flex-row items-center justify-center rounded-xl px-4 py-3"
          >
              <IconIon name="play-circle" size={24} className="text-white" />
            <Text className="ml-2 text-primary-foreground font-semibold">Listen to Audio</Text>
          </PrimaryButton>
        ) : null} />

        {/* Content Body */}
        <View className="mb-8">
          {renderFormattedContent(item.content)}
        </View>

        {/* Footer / References */}
        {item.footer && (
          <View className="pt-1 border-t border-border dark:border-border-dark">
            <Muted className="mt-2 leading-5 text-xs">
              {item.footer}
            </Muted>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/**
 * Helper function to parse the text content.
 * It detects lines starting with "##" to render them as subheaders.
 */
function renderFormattedContent(content: string) {
  if (!content) return null;

  // Split content by new lines
  const lines = content.split('\n');

  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return <View key={index} className="h-4" />; // Spacer for empty lines

    // Check for Markdown Header 2 (##)
    if (trimmed.startsWith('##')) {
      return (
        <Heading key={index} className="mt-6 mb-3 text-primary dark:text-primary-dark">
          {trimmed.replace(/^##\s*/, '')}
        </Heading>
      );
    }

    // Check for Bullet points or Numbered lists (simple detection)
    const isList = /^\d+\./.test(trimmed) || trimmed.startsWith('•');

    return (
      <Body
        key={index}
        className={`leading-[3rem] text-lg ${isList ? 'font-bold my-2 text-primary dark:text-primary-dark' : 'font-normal'}`}
        style={{ fontFamily: 'System' }} // Use a custom Arabic font here if you have one
      >
        {trimmed}
      </Body>
    );
  });
}
