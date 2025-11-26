import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ZikrDetailView } from '@/components/views/ZikrDetailView';

export default function ZikrDetailScreen() {
  const { title, collectionName } = useLocalSearchParams();

  return (
    <ZikrDetailView
      title={(title as string) || ''}
      collectionName={(collectionName as string) || ''}
    />
  );
}

