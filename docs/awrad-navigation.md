# Awrad Navigation Implementation

## Overview
Implemented a performant, hierarchical navigation system for the Awrad section with proper Expo Router file structure.

## File Structure
```
app/(tabs)/awrad/
├── index.tsx                      # List all collections
└── [collectionName]/
    ├── index.tsx                  # List items in a collection
    └── [title].tsx                # Detail view for a zikr item
```

## Navigation Flow

### 1. Collections List (`/awrad`)
**File:** `app/(tabs)/awrad/index.tsx`
- Displays all available collections using `ZikrTile` components
- Uses `getAllCollectionsMeta()` utility for efficient metadata retrieval
- Routes to: `/(tabs)/awrad/{collectionName}/`

### 2. Collection Items (`/awrad/{collectionName}`)
**File:** `app/(tabs)/awrad/[collectionName]/index.tsx`
- Shows all zikr items within a specific collection
- Uses `getCollection(collectionName)` utility
- Routes to: `/(tabs)/awrad/{collectionName}/{encodedTitle}`

### 3. Zikr Detail (`/awrad/{collectionName}/{title}`)
**File:** `app/(tabs)/awrad/[collectionName]/[title].tsx`
- Displays full content of a specific zikr
- Uses `getZikrFromCollection(collectionName, title)` utility
- Supports audio playback via URL if available
- Renders formatted content with markdown-like headers

## Utilities Module
**File:** `lib/collections.ts`

Provides centralized collection management:

### Functions:
- `getAllCollectionsMeta()` - Returns metadata for all collections
- `getCollection(key)` - Returns a specific collection
- `getZikrFromCollection(collectionKey, zikrTitle)` - Returns a specific zikr item

### Benefits:
- ✅ **Single source of truth** for collection data
- ✅ **Type safety** with TypeScript interfaces
- ✅ **Easy maintenance** - add new collections in one place
- ✅ **Performance** - only loads needed data

## Key Features

### Performance Optimizations:
1. **Memoization** - Uses `React.useMemo` for expensive computations
2. **Lazy loading** - Collections loaded on-demand
3. **Efficient rendering** - `FlatList` with proper key extraction

### Type Safety:
- Proper null/undefined handling for optional fields
- Type guards for route parameters
- TypeScript interfaces for all data structures

### User Experience:
- URL encoding for titles with special characters
- Proper back navigation with breadcrumbs
- Empty states for missing data
- Loading states handled gracefully

## URL Structure

```
/awrad
  → Shows: All collections (7 total)

/awrad/salawatYousriaCollection
  → Shows: All items in "الصلوات اليسيرية"

/awrad/salawatYousriaCollection/مقدمة%20الصلوات%20اليسرية
  → Shows: Full content of specific zikr
```

## Collections Registry

Currently supports 7 collections:
1. salawatYousriaCollection
2. poemsCollection
3. chosenSalawatCollection
4. azkarAlgomariCollection
5. morningEveningAzkarCollection
6. dalayilAlkhayratCollection
7. tareeqaBiosCollection

## Adding New Collections

To add a new collection:

1. Add JSON file to `azkar/collections/`
2. Import in `lib/collections.ts`
3. Add to `COLLECTIONS_MAP`

That's it! The UI automatically updates.

## Technical Decisions

### Why This Structure?
- **Nested routes** prevent ambiguity (can't have two dynamic routes at same level)
- **Clear hierarchy** matches mental model: Collection → Items → Detail
- **SEO friendly** URLs are bookmarkable and shareable
- **Scalable** - easy to add features like search, filters, etc.

### Why Centralized Utilities?
- **DRY principle** - avoid repeating collection imports
- **Testability** - easier to unit test
- **Refactoring** - change data source without touching UI code
- **Performance** - can add caching layer if needed

## Future Enhancements

Possible improvements:
- [ ] Add search functionality
- [ ] Implement bookmarking system
- [ ] Add collection categories/tags
- [ ] Offline support with AsyncStorage
- [ ] Share functionality for specific azkar
- [ ] Audio player integration
- [ ] Progress tracking
