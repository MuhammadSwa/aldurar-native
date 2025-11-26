# Bookmark System Implementation

## Overview
Implemented a comprehensive bookmark system using Zustand with AsyncStorage persistence, allowing users to bookmark both collections and individual zikr items.

## Features

### ✅ Bookmark Collections
- Tap bookmark icon on any collection to save it
- Visual feedback with filled bookmark icon when bookmarked

### ✅ Bookmark Individual Azkar
- Bookmark specific zikr items from within collections
- Each bookmark saves the parent collection context

### ✅ Persistent Storage
- All bookmarks stored in AsyncStorage
- Survives app restarts
- Automatic sync across app

### ✅ Home Page Integration
- Dedicated "المفضلة" (Favorites) page
- Grouped display: Collections and Azkar sections
- Same navigation structure as Awrad tab
- **Stays within Home tab** - no switching to Awrad

## File Structure

```
app/(tabs)/
├── home/
│   ├── index.tsx                      # Bookmarks list
│   └── [collectionName]/
│       ├── index.tsx                  # Collection items (home context)
│       └── [title].tsx                # Zikr detail (home context)
└── awrad/
    ├── index.tsx                      # All collections
    └── [collectionName]/
        ├── index.tsx                  # Collection items (awrad context)
        └── [title].tsx                # Zikr detail (awrad context)

lib/
└── stores/
    └── bookmarkStore.ts               # Zustand bookmark store
```

## Navigation Flow

### Home Tab (Bookmarks)
```
/(tabs)/home
  → Shows: Bookmarked collections & azkar
  → Click collection bookmark
    ↓
/(tabs)/home/[collectionName]
  → Shows: Items in that collection
  → Click item
    ↓
/(tabs)/home/[collectionName]/[title]
  → Shows: Full zikr content
```

### Awrad Tab (All Collections)
```
/(tabs)/awrad
  → Shows: All 7 collections
  → Click collection
    ↓
/(tabs)/awrad/[collectionName]
  → Shows: Items in that collection
  → Click item
    ↓
/(tabs)/awrad/[collectionName]/[title]
  → Shows: Full zikr content
```

## Store API

### State
```typescript
interface BookmarkState {
  bookmarks: Bookmark[];
  
  // Actions
  addBookmark: (bookmark) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  getCollectionBookmarks: () => Bookmark[];
  getZikrBookmarks: () => Bookmark[];
  getAllBookmarks: () => Bookmark[];
  clearAllBookmarks: () => void;
}
```

### Bookmark Interface
```typescript
interface Bookmark {
  id: string;                    // Generated unique ID
  type: 'collection' | 'zikr';   // Bookmark type
  title: string;                 // Display title
  
  // For collections
  collectionKey?: string;
  
  // For zikr items
  zikrTitle?: string;
  parentCollectionKey?: string;
  
  timestamp: number;             // When bookmarked
}
```

### ID Generation
```typescript
// Collection bookmark ID
generateBookmarkId('collection', 'salawatYousriaCollection')
// → "collection:salawatYousriaCollection"

// Zikr bookmark ID
generateBookmarkId('zikr', 'salawatYousriaCollection:صلوات اليوم الأول')
// → "zikr:salawatYousriaCollection:صلوات اليوم الأول"
```

## Usage Examples

### Check if Bookmarked
```tsx
const { isBookmarked } = useBookmarkStore();
const bookmarkId = generateBookmarkId('collection', collectionKey);
const bookmarked = isBookmarked(bookmarkId);
```

### Add Bookmark
```tsx
const { addBookmark } = useBookmarkStore();

// Bookmark a collection
addBookmark({
  type: 'collection',
  title: 'الصلوات اليسيرية',
  collectionKey: 'salawatYousriaCollection',
});

// Bookmark a zikr
addBookmark({
  type: 'zikr',
  title: 'صلوات اليوم الأول',
  zikrTitle: 'صلوات اليوم الأول',
  parentCollectionKey: 'salawatYousriaCollection',
});
```

### Remove Bookmark
```tsx
const { removeBookmark } = useBookmarkStore();
const bookmarkId = generateBookmarkId('collection', collectionKey);
removeBookmark(bookmarkId);
```

### Toggle Bookmark
```tsx
const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();

const handleToggle = (collectionKey: string, title: string) => {
  const bookmarkId = generateBookmarkId('collection', collectionKey);
  
  if (isBookmarked(bookmarkId)) {
    removeBookmark(bookmarkId);
  } else {
    addBookmark({
      type: 'collection',
      title,
      collectionKey,
    });
  }
};
```

## UI Components Integration

### ZikrTile Component
Already supports bookmark functionality:
```tsx
<ZikrTile
  title="Collection Title"
  onPress={() => navigate()}
  onBookmarkPress={() => toggleBookmark()}
  isBookmarked={bookmarked}
/>
```

### Visual States
- **Not Bookmarked**: Empty bookmark icon (outline)
- **Bookmarked**: Filled bookmark icon with primary color

## Data Persistence

### Storage Key
- `bookmarks-storage`

### Storage Format
```json
{
  "state": {
    "bookmarks": [
      {
        "id": "collection:salawatYousriaCollection",
        "type": "collection",
        "title": "الصلوات اليسيرية",
        "collectionKey": "salawatYousriaCollection",
        "timestamp": 1700000000000
      },
      {
        "id": "zikr:salawatYousriaCollection:صلوات اليوم الأول",
        "type": "zikr",
        "title": "صلوات اليوم الأول",
        "zikrTitle": "صلوات اليوم الأول",
        "parentCollectionKey": "salawatYousriaCollection",
        "timestamp": 1700000000000
      }
    ]
  },
  "version": 0
}
```

## Benefits

### 1. **Consistent UX**
- Same bookmark icon behavior across all pages
- Visual feedback on bookmark state
- Easy to understand and use

### 2. **Performance**
- Zustand provides optimal re-renders
- AsyncStorage for persistence
- Memoized selectors for filtering

### 3. **Maintainability**
- Centralized state management
- Type-safe with TypeScript
- Clear separation of concerns

### 4. **Scalability**
- Easy to add new bookmark types
- Can extend with categories/tags
- Ready for sync features

### 5. **Tab Independence**
- Home tab has its own navigation stack
- Awrad tab works independently
- No cross-tab navigation conflicts

## Future Enhancements

Possible improvements:
- [ ] Bookmark search functionality
- [ ] Export/import bookmarks
- [ ] Bookmark categories/tags
- [ ] Bookmark notes
- [ ] Share bookmarks
- [ ] Cloud sync
- [ ] Bookmark statistics
- [ ] Recently bookmarked section
- [ ] Bookmark sorting options
