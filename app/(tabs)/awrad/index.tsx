import { ZikrTile } from '@/components/ZikrTile';
import { router } from 'expo-router';
import * as React from 'react';
import { View, FlatList } from 'react-native';
import { getAllCollectionsMeta } from '@/lib/collections';
import { useBookmarkStore, generateBookmarkId } from '@/lib/stores/bookmarkStore';

import { useToastStore } from '@/lib/stores/toastStore';

export default function Screen() {
  // Get all collections metadata (memoized for performance)
  const collections = React.useMemo(() => getAllCollectionsMeta(), []);

  // Bookmark store
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
  const { showToast } = useToastStore();

  const handleCollectionPress = React.useCallback((collectionKey: string) => {
    router.push(`/(tabs)/awrad/${collectionKey}/`);
  }, []);

  const handleBookmarkPress = React.useCallback((collectionKey: string, title: string) => {
    const bookmarkId = generateBookmarkId('collection', collectionKey);

    if (isBookmarked(bookmarkId)) {
      removeBookmark(bookmarkId);
      showToast('تمت الإزالة من المفضلة');
    } else {
      addBookmark({
        type: 'collection',
        title,
        collectionKey,
      });
      showToast('تمت الإضافة إلى المفضلة');
    }
  }, [isBookmarked, addBookmark, removeBookmark, showToast]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <FlatList
        data={collections}
        keyExtractor={(item) => item.key}
        contentContainerClassName="p-4 pb-6"
        renderItem={({ item }) => {
          const bookmarkId = generateBookmarkId('collection', item.key);
          return (
            <ZikrTile
              title={item.title}
              onPress={() => handleCollectionPress(item.key)}
              onBookmarkPress={() => handleBookmarkPress(item.key, item.title)}
              isBookmarked={isBookmarked(bookmarkId)}
            />
          );
        }}
      />
    </View>
  );
}
