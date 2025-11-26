import { ZikrTile } from '@/components/ZikrTile';
import { router } from 'expo-router';
import * as React from 'react';
import { View, FlatList } from 'react-native';
import salawatYousria from "azkar/collections/salawatYousriaCollection.json";

export default function Screen() {
  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={salawatYousria}
        // Use a unique ID if your JSON has one, otherwise fallback to index
        keyExtractor={(item, index) => index.toString()}

        // NativeWind styling for the internal list container (padding & gap)
        contentContainerClassName="p-4 gap-4 pb-10"

        // Optional: Render the header inside the list so it scrolls with items

        renderItem={({ item }) => (
          <ZikrTile
            title={item.title}
            onPress={() => {
              // Best practice: Use object syntax to handle spaces/special chars in titles
              router.push({
                pathname: "/(tabs)/awrad/[title]", // Make sure this matches your file name
                params: { title: item.title }
              });
            }}
          />
        )}
      />
    </View>
  );
}
