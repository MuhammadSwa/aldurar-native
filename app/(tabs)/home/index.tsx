import { View, FlatList, SectionList } from 'react-native';
import { Title, Heading, Body } from '@/components/Typography';
import { ZikrTile } from '@/components/ZikrTile';
import { router } from 'expo-router';
import * as React from 'react';
import { useBookmarkStore, generateBookmarkId, Bookmark } from '@/lib/stores/bookmarkStore';
import EmptyState from '@/components/EmptyState';
import { IconFeather } from '@/components/Icons';

import { useToastStore } from '@/lib/stores/toastStore';

export default function HomeScreen() {
  const {
    bookmarks,
    isBookmarked,
    removeBookmark,
    getCollectionBookmarks,
    getZikrBookmarks
  } = useBookmarkStore();
  const { showToast } = useToastStore();

  // Group bookmarks by type
  const sections = React.useMemo(() => {
    const collectionBookmarks = getCollectionBookmarks();
    const zikrBookmarks = getZikrBookmarks();

    const result = [];

    if (collectionBookmarks.length > 0) {
      result.push({
        title: 'Bookmarked Collections',
        data: collectionBookmarks,
      });
    }

    if (zikrBookmarks.length > 0) {
      result.push({
        title: 'Bookmarked Azkar',
        data: zikrBookmarks,
      });
    }

    return result;
  }, [bookmarks]);

  const handleCollectionPress = React.useCallback((collectionKey: string) => {
    router.push(`/(tabs)/home/${collectionKey}/`);
  }, []);

  const handleZikrPress = React.useCallback((parentCollectionKey: string, zikrTitle: string) => {
    const encodedTitle = encodeURIComponent(zikrTitle);
    router.push(`/(tabs)/home/${parentCollectionKey}/${encodedTitle}`);
  }, []);

  const handleBookmarkToggle = React.useCallback((bookmark: Bookmark) => {
    // Always remove on home page (since they're viewing bookmarks)
    removeBookmark(bookmark.id);
    showToast('تمت الإزالة من المفضلة');
  }, [removeBookmark, showToast]);

  const renderBookmarkItem = React.useCallback(({ item }: { item: Bookmark }) => {
    const onPress = item.type === 'collection'
      ? () => handleCollectionPress(item.collectionKey || '')
      : () => handleZikrPress(item.parentCollectionKey || '', item.zikrTitle || '');

    return (
      <ZikrTile
        title={item.title}
        onPress={onPress}
        onBookmarkPress={() => handleBookmarkToggle(item)}
        isBookmarked={true} // Always true on home page
      />
    );
  }, [handleCollectionPress, handleZikrPress, handleBookmarkToggle]);

  if (bookmarks.length === 0) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <View className="p-6 border-b border-border dark:border-border-dark">
          <Title className="text-center">المفضلة</Title>
          <Body className="text-center mt-2 text-muted-foreground dark:text-muted-foreground-dark">
            Your bookmarked collections and azkar
          </Body>
        </View>
        <View className="flex-1 items-center justify-center p-6">
          <IconFeather
            name="bookmark"
            size={64}
            className="text-muted-foreground dark:text-muted-foreground-dark mb-4"
          />
          <EmptyState message="No bookmarks yet" />
          <Body className="text-center mt-2 text-muted-foreground dark:text-muted-foreground-dark">
            Tap the bookmark icon on any collection or zikr to add it here
          </Body>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-6 border-b border-border dark:border-border-dark">
        <Title className="text-center">المفضلة</Title>
        <Body className="text-center mt-2 text-muted-foreground dark:text-muted-foreground-dark">
          {bookmarks.length} bookmarked {bookmarks.length === 1 ? 'item' : 'items'}
        </Body>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4 pb-6"
        renderItem={renderBookmarkItem}
        renderSectionHeader={({ section }) => (
          <View className="py-3 px-2">
            <Heading className="text-lg">{section.title}</Heading>
          </View>
        )}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}
