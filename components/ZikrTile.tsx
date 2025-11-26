import { Feather, MaterialIcons } from "@expo/vector-icons";
import { IconFeather, IconMaterial } from './Icons';
import React from "react";
import { Text, TouchableOpacity, View, ViewStyle, GestureResponderEvent } from "react-native";
import { Heading } from './Typography';
import Card from './Card';
import IconButton from './IconButton';

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
      className={`w-full mb-3 ${className}`}
      style={style}
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <Card className="p-4 flex-row items-center justify-between">
        {/* Main Content Container */}
        <View className="flex-1 flex-row items-center gap-3">
          {/* Bookmark Action */}
          <IconButton
            onPress={(e: GestureResponderEvent) => {
              e.stopPropagation();
              onBookmarkPress?.();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityLabel="Bookmark"
            className="-ml-2"
          >
            <IconFeather
              name="bookmark"
              size={22}
              className={`${isBookmarked ? 'text-primary dark:text-primary-dark' : 'text-accent dark:text-accent-dark'}`}
            />
          </IconButton>

          {/* Title Text */}
          <Heading
            className="flex-1"
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ writingDirection: "rtl" }}
          >
            {title}
          </Heading>
        </View>

        {/* Navigation Indicator */}
        <IconButton className="opacity-80">
          <IconMaterial
            name="chevron-left"
            size={28}
            className="text-accent dark:text-accent-dark"
          />
        </IconButton>
      </Card>
    </TouchableOpacity>
  );
};

export default ZikrTile;
