import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import PrimaryButton from '@/components/PrimaryButton';
import { Muted } from '@/components/Typography';
import SectionHeader from '@/components/SectionHeader';
import EmptyState from '@/components/EmptyState';
import { IconIon } from '@/components/Icons';
import { getZikrFromCollection } from '@/lib/collections';
import { renderFormattedContent } from '@/lib/contentParser';

interface ZikrDetailViewProps {
    title: string;
    collectionName: string;
}

export function ZikrDetailView({ title, collectionName }: ZikrDetailViewProps) {
    // Find the specific Zikr item using the utility function
    const item = React.useMemo(
        () => getZikrFromCollection(collectionName || '', decodeURIComponent(title || '')),
        [collectionName, title]
    );

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
                <SectionHeader title={item.title || 'Untitled'} right={item.url ? (
                    <PrimaryButton
                        onPress={() => Linking.openURL(item.url || '')}
                        className="flex-row items-center justify-center rounded-xl px-4 py-3"
                    >
                        <IconIon name="play-circle" size={24} className="text-white" />
                        <Text className="ml-2 text-primary-foreground font-semibold">Listen to Audio</Text>
                    </PrimaryButton>
                ) : null} />

                {/* Content Body */}
                <View className="mb-8">
                    {renderFormattedContent(item.content || '')}
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
