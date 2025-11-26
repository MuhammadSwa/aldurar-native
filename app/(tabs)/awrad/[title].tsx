import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed

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
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-lg text-slate-500">Azkar not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      {/* Set the Header Title Dynamically */}
      <Stack.Screen options={{ headerTitle: item.title, headerBackTitle: "Back" }} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 pb-20"
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View className="mb-6 border-b border-slate-200 pb-4">
          <Text className="text-2xl font-bold text-emerald-800 text-center leading-9">
            {item.title}
          </Text>

          {/* Optional Audio Button if URL exists */}
          {item.url && (
            <TouchableOpacity
              onPress={() => Linking.openURL(item.url)}
              className="mt-4 flex-row items-center justify-center bg-emerald-100 p-3 rounded-xl self-center"
            >
              <Ionicons name="play-circle" size={24} color="#065f46" />
              <Text className="ml-2 text-emerald-800 font-semibold">Listen to Audio</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content Body */}
        <View className="mb-8">
          {renderFormattedContent(item.content)}
        </View>

        {/* Footer / References */}
        {item.footer && (
          <View className="pt-1 border-t border-slate-300">
            <Text className="text-xs text-slate-400 mt-2 leading-5">
              {item.footer}
            </Text>
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
        <Text key={index} className="text-xl font-bold text-emerald-700 mt-6 mb-3">
          {trimmed.replace(/^##\s*/, '')}
        </Text>
      );
    }

    // Check for Bullet points or Numbered lists (simple detection)
    const isList = /^\d+\./.test(trimmed) || trimmed.startsWith('•');

    return (
      <Text
        key={index}
        className={`text-lg text-slate-800 leading-[3rem] ${isList ? 'font-bold my-2 text-emerald-900' : 'font-normal'}`}
        style={{ fontFamily: 'System' }} // Use a custom Arabic font here if you have one
      >
        {trimmed}
      </Text>
    );
  });
}
