import React, { useMemo } from 'react';
import { Text, View, TextStyle } from 'react-native';
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';

// ----------------------------------------------------------------------
// 1. Types & Interfaces
// ----------------------------------------------------------------------

export type ParsedItemType = 'poem_verse' | 'heading' | 'list_item' | 'paragraph' | 'basmalah' | 'quran';

export interface ParsedItem {
  id: string;
  type: ParsedItemType;
  text?: string;
  right?: string;
  left?: string;
  level?: number;
  number?: string;
}

interface ParserProps {
  content: string;
  baseTextStyle?: TextStyle;
}

// ----------------------------------------------------------------------
// 2. Constants & Regex
// ----------------------------------------------------------------------

const BASMALAH_PLAIN = "بسم الله الرحمن الرحيم";
const BASMALAH_FULL = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ";

const REGEX_POEM_BLOCK = /F([\s\S]*?)X/g;
const REGEX_HEADING = /^(#+)\s+(.*)/;
const REGEX_NUMBERED_LIST = /^(\d+(?:\/\d+)?\.)\s+(.*)/;
const REGEX_POEM_SPLIT = /__/;

const REGEX_INLINE_PARSER = new RegExp(
  `(${BASMALAH_FULL}|${BASMALAH_PLAIN}|﴿[\\s\\S]*?﴾|\\[\\^\\d+\\]|\\[.*?\\]|\\(.*?\\)|«.*?»)`
  , 'g');

// ----------------------------------------------------------------------
// 3. Helper Functions
// ----------------------------------------------------------------------

const parseInlineStyles = (text: string, keyPrefix: string): React.ReactNode[] => {
  const parts = text.split(REGEX_INLINE_PARSER);

  return parts.map((part, index) => {
    if (!part) return null;
    const key = `${keyPrefix}-${index}`;

    // 1. Quranic Text
    const isBasmalah = part === BASMALAH_PLAIN || part === BASMALAH_FULL;
    const isQuranBlock = part.startsWith('﴿') && part.endsWith('﴾');

    if (isBasmalah || isQuranBlock) {
      return (
        <Text key={key} className="font-amiri text-xl text-emerald-600 dark:text-emerald-400 writing-rtl">
          {part}
        </Text>
      );
    }

    // 2. Footnotes
    if (part.startsWith('[^') && part.endsWith(']')) {
      const number = part.replace(/[^\d]/g, '');
      return (
        <View key={key} className="justify-start h-5 w-6">
          <Text className="text-[11px] leading-4 font-bold text-slate-500 dark:text-slate-400 -translate-y-1.5">
            [{number}]
          </Text>
        </View>
      );
    }

    // 3. Brackets
    if (
      (part.startsWith('[') && part.endsWith(']')) ||
      (part.startsWith('(') && part.endsWith(')')) ||
      (part.startsWith('«') && part.endsWith('»'))
    ) {
      return (
        <Text key={key} className="font-medium text-base text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/10">
          {part}
        </Text>
      );
    }

    // 4. Regular Text
    return <Text key={key} className="text-slate-700 dark:text-slate-200">{part}</Text>;
  });
};

/**
 * Parses the raw content string into a flat list of items suitable for virtualization.
 */
export const parseZikrContent = (content: string): ParsedItem[] => {
  const items: ParsedItem[] = [];
  const rawBlocks = content.split(REGEX_POEM_BLOCK);

  rawBlocks.forEach((block, blockIndex) => {
    if (!block) return;
    const isPoem = blockIndex % 2 === 1;

    if (isPoem) {
      const verses = block.split('\n').filter((l) => l.trim().length > 0);
      verses.forEach((verse, vIndex) => {
        const [right, left] = verse.split(REGEX_POEM_SPLIT);
        items.push({
          id: `poem-${blockIndex}-${vIndex}`,
          type: 'poem_verse',
          right: right?.trim() || '',
          left: left?.trim(),
        });
      });
    } else {
      const lines = block.split('\n');
      lines.forEach((line, lineIndex) => {
        if (!line.trim()) return;
        const id = `text-${blockIndex}-${lineIndex}`;

        // A. Headings
        const headingMatch = line.match(REGEX_HEADING);
        if (headingMatch) {
          items.push({
            id,
            type: 'heading',
            level: headingMatch[1].length,
            text: headingMatch[2],
          });
          return;
        }

        // B. Numbered Lists
        const listMatch = line.match(REGEX_NUMBERED_LIST);
        if (listMatch) {
          items.push({
            id,
            type: 'list_item',
            number: listMatch[1],
            text: listMatch[2],
          });
          return;
        }

        // C. Regular Paragraphs
        items.push({
          id,
          type: 'paragraph',
          text: line,
        });
      });
    }
  });

  return items;
};

// ----------------------------------------------------------------------
// 4. Components
// ----------------------------------------------------------------------

export const ZikrItemRenderer = React.memo(({ item, baseTextStyle }: { item: ParsedItem; baseTextStyle?: TextStyle }) => {
  switch (item.type) {
    case 'poem_verse':
      return (
        <View className="mb-6 w-full">
          <View className="self-start mb-1.5 max-w-[90%]">
            <Text className="text-xl font-bold text-center font-amiri-bold leading-9 text-slate-800 dark:text-slate-100">
              {parseInlineStyles(item.right || '', `${item.id}-r`)}
            </Text>
          </View>

          {item.left && (
            <View className="self-end max-w-[90%]">
              <Text className="text-xl font-bold text-center font-amiri-bold leading-9 text-slate-800 dark:text-slate-100">
                {parseInlineStyles(item.left, `${item.id}-l`)}
              </Text>
            </View>
          )}
        </View>
      );

    case 'heading':
      const sizeClass = item.level === 1 ? 'text-2xl' : item.level === 2 ? 'text-xl' : 'text-lg';
      return (
        <Text className={`font-bold mb-3 mt-5 text-left writing-rtl text-slate-900 dark:text-slate-50 ${sizeClass}`} style={baseTextStyle}>
          {parseInlineStyles(item.text || '', item.id)}
        </Text>
      );

    case 'list_item':
      return (
        <Text className="text-lg leading-8 mb-3 text-left writing-rtl text-slate-700 dark:text-slate-200" style={baseTextStyle}>
          <Text className="font-bold text-lg text-red-600 dark:text-red-400">
            {item.number}{' '}
          </Text>
          {parseInlineStyles(item.text || '', item.id)}
        </Text>
      );

    case 'paragraph':
    default:
      return (
        <Text className="text-lg leading-8 mb-4 text-left writing-rtl text-slate-700 dark:text-slate-200" style={baseTextStyle}>
          {parseInlineStyles(item.text || '', item.id)}
        </Text>
      );
  }
});

export const RichTextParser: React.FC<ParserProps> = ({ content, baseTextStyle }) => {
  let [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });

  const parsedItems = useMemo(() => parseZikrContent(content), [content]);

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <View className="px-1 py-2">
      {parsedItems.map((item) => (
        <ZikrItemRenderer key={item.id} item={item} baseTextStyle={baseTextStyle} />
      ))}
    </View>
  );
};
