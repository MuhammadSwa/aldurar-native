import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, ViewStyle, GestureResponderEvent } from "react-native";

interface ZikrTileProps {
  title: string;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  style?: ViewStyle;
  isBookmarked?: boolean; // Added for visual state
  className?: string;
}

export const ZikrTile: React.FC<ZikrTileProps> = ({
  title,
  onPress,
  onBookmarkPress,
  style,
  isBookmarked = false,
  className = ""
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm mb-3 ${className}`}
      style={style}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* 
        Main Content Container 
        Uses flex-1 to push the chevron to the far edge
      */}
      <View className="flex-1 flex-row items-center gap-3">

        {/* Bookmark Action */}
        <TouchableOpacity
          className="p-2 -ml-2 rounded-full active:bg-slate-50"
          onPress={(e: GestureResponderEvent) => {
            e.stopPropagation();
            onBookmarkPress?.();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Bookmark"
        >
          <Feather
            name="bookmark"
            size={22}
            color={isBookmarked ? "#059669" : "#94a3b8"} // Emerald if active, Slate if inactive
            fill={isBookmarked ? "#059669" : "transparent"} // Fill effect
          />
        </TouchableOpacity>

        {/* Title Text */}
        <Text
          className="flex-1 text-lg font-semibold text-slate-800"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ writingDirection: 'rtl' }} // Ensures Arabic flows correctly even if device is LTR
        >
          {title}
        </Text>
      </View>

      {/* Navigation Indicator */}
      <MaterialIcons
        name="chevron-right" // In RTL mode, Flexbox moves this to the Left automatically
        size={28}
        className="text-slate-300"
      />
    </TouchableOpacity>
  );
};

export default ZikrTile;
