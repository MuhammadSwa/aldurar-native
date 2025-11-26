import type { Zikr } from '@/lib/types';

// Import all collection JSON files
import salawatYousria from 'azkar/collections/salawatYousriaCollection.json';
import poemsCollection from 'azkar/collections/poemsCollection.json';
import chosenSalawatCollection from 'azkar/collections/chosenSalawatCollection.json';
import azkarAlgomariCollection from 'azkar/collections/azkarAlgomariCollection.json';
import morningEveningAzkarCollection from 'azkar/collections/morningEveningAzkarCollection.json';
import dalayilAlkhayratCollection from 'azkar/collections/dalayilAlkhayratCollection.json';
import tareeqaBiosCollection from 'azkar/collections/tareeqaBiosCollection.json';

export interface Collection {
    title?: string;
    collection?: Zikr[];
}

export interface CollectionMeta {
    key: string;
    title: string;
    itemCount: number;
}

// Centralized collection registry
export const COLLECTIONS_MAP: Record<string, Collection> = {
    salawatYousriaCollection: salawatYousria,
    poemsCollection: poemsCollection,
    chosenSalawatCollection: chosenSalawatCollection,
    azkarAlgomariCollection: azkarAlgomariCollection,
    morningEveningAzkarCollection: morningEveningAzkarCollection,
    dalayilAlkhayratCollection: dalayilAlkhayratCollection,
    tareeqaBiosCollection: tareeqaBiosCollection,
} as const;

// Collection keys for type safety
export type CollectionKey = keyof typeof COLLECTIONS_MAP;

/**
 * Get all collections metadata (for listing page)
 * Optimized to only extract necessary information
 */
export function getAllCollectionsMeta(): CollectionMeta[] {
    return Object.entries(COLLECTIONS_MAP).map(([key, collection]) => ({
        key,
        title: collection.title || key,
        itemCount: collection.collection?.length || 0,
    }));
}

/**
 * Get a specific collection by key
 */
export function getCollection(key: string): Collection | null {
    return COLLECTIONS_MAP[key] || null;
}

/**
 * Get a specific zikr item from a collection
 */
export function getZikrFromCollection(
    collectionKey: string,
    zikrTitle: string
): Zikr | null {
    const collection = getCollection(collectionKey);

    if (!collection?.collection) {
        return null;
    }

    return (
        collection.collection.find((z) => z.title === zikrTitle) ||
        collection.collection.find((z) => z.title === decodeURIComponent(zikrTitle)) ||
        null
    );
}
