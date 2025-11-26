import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type BookmarkType = 'collection' | 'zikr';

export interface Bookmark {
    id: string;
    type: BookmarkType;
    title: string;
    // For collections
    collectionKey?: string;
    // For zikr items
    zikrTitle?: string;
    parentCollectionKey?: string;
    timestamp: number;
}

interface BookmarkState {
    bookmarks: Bookmark[];

    // Actions
    addBookmark: (bookmark: Omit<Bookmark, 'id' | 'timestamp'>) => void;
    removeBookmark: (id: string) => void;
    isBookmarked: (id: string) => boolean;
    getCollectionBookmarks: () => Bookmark[];
    getZikrBookmarks: () => Bookmark[];
    getAllBookmarks: () => Bookmark[];
    clearAllBookmarks: () => void;
}

// Generate consistent bookmark ID
export const generateBookmarkId = (type: BookmarkType, key: string): string => {
    return `${type}:${key}`;
};

export const useBookmarkStore = create<BookmarkState>()(
    persist(
        (set, get) => ({
            bookmarks: [],

            addBookmark: (bookmark) => {
                const id = bookmark.type === 'collection'
                    ? generateBookmarkId('collection', bookmark.collectionKey || '')
                    : generateBookmarkId('zikr', `${bookmark.parentCollectionKey}:${bookmark.zikrTitle}`);

                const newBookmark: Bookmark = {
                    ...bookmark,
                    id,
                    timestamp: Date.now(),
                };

                set((state) => {
                    // Check if already bookmarked
                    if (state.bookmarks.some((b) => b.id === id)) {
                        return state;
                    }

                    return {
                        bookmarks: [...state.bookmarks, newBookmark],
                    };
                });
            },

            removeBookmark: (id) => {
                set((state) => ({
                    bookmarks: state.bookmarks.filter((b) => b.id !== id),
                }));
            },

            isBookmarked: (id) => {
                return get().bookmarks.some((b) => b.id === id);
            },

            getCollectionBookmarks: () => {
                return get().bookmarks.filter((b) => b.type === 'collection');
            },

            getZikrBookmarks: () => {
                return get().bookmarks.filter((b) => b.type === 'zikr');
            },

            getAllBookmarks: () => {
                return get().bookmarks;
            },

            clearAllBookmarks: () => {
                set({ bookmarks: [] });
            },
        }),
        {
            name: 'bookmarks-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
