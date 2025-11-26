import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { CollectionItemsView } from '@/components/views/CollectionItemsView';

export default function CollectionListScreen() {
    const { collectionName } = useLocalSearchParams<{ collectionName: string }>();

    return (
        <CollectionItemsView
            collectionName={collectionName || ''}
            basePath="/(tabs)/awrad"
        />
    );
}
