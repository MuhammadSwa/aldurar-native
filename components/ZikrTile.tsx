import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, ViewStyle, GestureResponderEvent } from "react-native";

interface ZikrTileProps {
  title: string;
  onPress?: () => void;
  onBookmarkPress?: () => void;
  style?: ViewStyle;
  isBookmarked?: boolean;
  className?: string;
}

export const ZikrTile: React.FC<ZikrTileProps> = ({
  title,
  onPress,
  onBookmarkPress,
  style,
  isBookmarked = false,
  className = "",
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center justify-between w-full p-4 mb-3 rounded-2xl border bg-white dark:bg-card-dark border-[#E6E2D9] dark:border-[#101A14] shadow-sm ${className}`}
      style={style}
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {/* Main Content Container */}
      <View className="flex-1 flex-row items-center gap-3">
        {/* Bookmark Action */}
        <TouchableOpacity
          className="p-2 -ml-2 rounded-full active:bg-[hsl(45,20%,90%)] dark:active:bg-[hsl(144,30%,15%)]"
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
            className={isBookmarked ? "text-[#2F9E4B] dark:text-[#2DB34A]" : "text-[#536053] dark:text-[#9AA59A]"}
          />
        </TouchableOpacity>

        {/* Title Text */}
        <Text
          className="flex-1 text-lg font-semibold text-[#0B2D17] dark:text-[#ECECEE]"
          numberOfLines={1}
          adjustsFontSizeToFit
          style={{ writingDirection: "rtl" }}
        >
          {title}
        </Text>
      </View>

      {/* Navigation Indicator */}
      <MaterialIcons
        name="chevron-right"
        size={28}
        className="text-[#536053] dark:text-[#9AA59A]"
      />
    </TouchableOpacity>
  );
};

export default ZikrTile;
