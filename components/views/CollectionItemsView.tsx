import { ZikrTile } from '@/components/ZikrTile';
import { Stack, router } from 'expo-router';
import * as React from 'react';
import { View, FlatList } from 'react-native';
import EmptyState from '@/components/EmptyState';
import { getCollection } from '@/lib/collections';
import { useBookmarkStore, generateBookmarkId } from '@/lib/stores/bookmarkStore';

import { useToastStore } from '@/lib/stores/toastStore';

interface CollectionItemsViewProps {
    collectionName: string;
    basePath: '/(tabs)/awrad' | '/(tabs)/home';
}

export function CollectionItemsView({ collectionName, basePath }: CollectionItemsViewProps) {
    // Get the selected collection (memoized for performance)
    const selectedCollection = React.useMemo(
        () => getCollection(collectionName || ''),
        [collectionName]
    );

    // Bookmark store
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
    const { showToast } = useToastStore();

    const handleItemPress = React.useCallback((zikrTitle: string) => {
        const encodedTitle = encodeURIComponent(zikrTitle);
        router.push(`${basePath}/${collectionName}/${encodedTitle}`);
    }, [collectionName, basePath]);

    const handleBookmarkPress = React.useCallback((zikrTitle: string) => {
        const bookmarkId = generateBookmarkId('zikr', `${collectionName}:${zikrTitle}`);

        if (isBookmarked(bookmarkId)) {
            removeBookmark(bookmarkId);
            showToast('تمت الإزالة من المفضلة');
        } else {
            addBookmark({
                type: 'zikr',
                title: zikrTitle,
                zikrTitle,
                parentCollectionKey: collectionName || '',
            });
            showToast('تمت الإضافة إلى المفضلة');
        }
    }, [collectionName, isBookmarked, addBookmark, removeBookmark, showToast]);

    if (!selectedCollection) {
        return (
            <View className="flex-1 bg-background dark:bg-background-dark">
                <Stack.Screen options={{ headerTitle: 'Collection Not Found' }} />
                <EmptyState message="Collection not found" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background dark:bg-background-dark">
            <Stack.Screen
                options={{
                    headerTitle: selectedCollection.title || 'Collection',
                    headerBackTitle: 'Back'
                }}
            />

            <FlatList
                data={selectedCollection.collection || []}
                keyExtractor={(item, index) => `${collectionName}-${index}`}
                contentContainerClassName="p-4 pb-6"
                renderItem={({ item }) => {
                    const bookmarkId = generateBookmarkId('zikr', `${collectionName}:${item.title}`);
                    return (
                        <ZikrTile
                            title={item.title || 'Untitled'}
                            onPress={() => handleItemPress(item.title || '')}
                            onBookmarkPress={() => handleBookmarkPress(item.title || '')}
                            isBookmarked={isBookmarked(bookmarkId)}
                        />
                    );
                }}
                ListEmptyComponent={
                    <EmptyState message="No items in this collection" />
                }
            />
        </View>
    );
}
