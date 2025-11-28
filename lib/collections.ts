import type { Zikr, ZikrCollection } from '@/lib/types';

// Metadata for listing without loading the heavy JSON files
const COLLECTIONS_META_DATA: Record<string, string> = {
  salawatYousriaCollection: "الصلوات اليسيرية",
  poemsCollection: "قصائد",
  chosenSalawatCollection: "صلوات مختارة على النبي ﷺ",
  azkarAlgomariCollection: "أوراد سيدي عبد الله بن الصديق الغماري",
  morningEveningAzkarCollection: "أذكار الصباح والمساء",
  dalayilAlkhayratCollection: "دلائل الخيرات",
  tareeqaBiosCollection: "تراجم رجال الطريقة",
};

// Lazy loaders for collections
const COLLECTIONS_LOADERS: Record<string, () => any> = {
  salawatYousriaCollection: () => require('@/azkar/collections/salawatYousriaCollection'),
  poemsCollection: () => require('@/azkar/collections/poemsCollection'),
  chosenSalawatCollection: () => require('@/azkar/collections/chosenSalawatCollection'),
  azkarAlgomariCollection: () => require('@/azkar/collections/azkarAlgomariCollection'),
  morningEveningAzkarCollection: () => require('@/azkar/collections/morningEveningAzkarCollection'),
  dalayilAlkhayratCollection: () => require('@/azkar/collections/dalayilAlkhayratCollection'),
  tareeqaBiosCollection: () => require('@/azkar/collections/tareeqaBiosCollection'),
};

export interface Collection {
  title?: string;
  collection?: Zikr[];
}

export interface CollectionMeta {
  key: string;
  title: string;
}

// Collection keys for type safety
export type CollectionKey = keyof typeof COLLECTIONS_META_DATA;

// Cache for loaded collections
const COLLECTION_CACHE = new Map<string, Collection>();

// Cache for Zikr lookups: CollectionKey -> Map<Title, Zikr>
const ZIKR_LOOKUP_CACHE = new Map<string, Map<string, Zikr>>();

/**
 * Get all collections metadata (for listing page)
 * Optimized to use static metadata without loading files
 */
export function getAllCollectionsMeta(): CollectionMeta[] {
  return Object.entries(COLLECTIONS_META_DATA).map(([key, title]) => ({
    key,
    title,
  }));
}

/**
 * Get a specific collection by key
 * Uses lazy loading and caching
 */
export function getCollection(key: string): Collection | null {
  if (COLLECTION_CACHE.has(key)) {
    return COLLECTION_CACHE.get(key)!;
  }

  const loader = COLLECTIONS_LOADERS[key];
  if (loader) {
    try {
      const module = loader();
      // Handle default export or named export matching the key
      // Most files export default or the variable name
      const collection = module.default || module[key];
      if (collection) {
        COLLECTION_CACHE.set(key, collection);
        return collection;
      }
    } catch (e) {
      console.error(`Failed to load collection ${key}`, e);
    }
  }
  return null;
}

/**
 * Get a specific zikr item from a collection
 * Optimized with O(1) lookup cache
 */
export function getZikrFromCollection(
  collectionKey: string,
  zikrTitle: string
): Zikr | null {
  // Ensure collection is loaded
  const collection = getCollection(collectionKey);

  if (!collection?.collection) {
    return null;
  }

  // Check lookup cache
  if (!ZIKR_LOOKUP_CACHE.has(collectionKey)) {
    const map = new Map<string, Zikr>();
    collection.collection.forEach((z) => {
      if (z.title) {
        map.set(z.title, z);
        // Also index by decoded title just in case
        map.set(decodeURIComponent(z.title), z);
      }
    });
    ZIKR_LOOKUP_CACHE.set(collectionKey, map);
  }

  const lookup = ZIKR_LOOKUP_CACHE.get(collectionKey);
  const decodedTitle = decodeURIComponent(zikrTitle);

  return lookup?.get(zikrTitle) || lookup?.get(decodedTitle) || null;
}
