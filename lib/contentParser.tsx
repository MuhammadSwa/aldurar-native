import React from 'react';
import { View, Text } from 'react-native';
import { Body, Heading } from '@/components/Typography';

interface TextSegment {
  type: 'quranic' | 'bracketed' | 'parenthesized' | 'guillemet' | 'footnote' | 'citation' | 'instruction' | 'text';
  content: string;
  rawContent?: string; // For footnotes to hide the ^
}

interface ContentLine {
  type: 'header' | 'poemVerse' | 'numbered' | 'text' | 'empty';
  content: string;
  numberPart?: string; // For numbered lines
  textPart?: string;   // For numbered lines
  parts?: { content: string; isRight: boolean }[]; // For poem verses
}

/**
 * Enhanced content parser for azkar text with sophisticated formatting
 * Handles:
 * - Quranic text between ﴾﴿ - special ornate styling with Amiri font
 * - Text between [] - italic muted style
 * - Text between () - subtle highlight
 * - Text between «» - bold accent style
 * - Lines starting with number+dot (1., 2., etc.) - style only the number
 * - Headings (## or lines in ALL CAPS)
 * - Footnote indicators [^1] - hide ^ and make superscript
 * - Poems (F...X format) - alternating right/left alignment
 */

/**
 * Parse inline formatting within text
 */
function parseInlineFormatting(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let currentPos = 0;

  // Define patterns with their types - order matters for precedence
  const patterns = [
    {
      regex: /﴾([^﴿]+)﴿/g,
      type: 'quranic' as const,
      captureGroup: 1
    },
    {
      regex: /\[\^([^\]]+)\]/g,
      type: 'footnote' as const,
      captureGroup: 1
    },
    // Citation pattern: [Text: Number] or [Text:Number]
    {
      regex: /\[([\u0600-\u06FF\s]+:[^\]]+[0-9])\]/g,
      type: 'citation' as const,
      captureGroup: 1
    },
    // Specific instructions like [Read once...]
    {
      regex: /\[(تقرأ مرة واحدة للمتعجل|سبع مرات|ثلاثًا)\]/g,
      type: 'instruction' as const,
      captureGroup: 1
    },
    {
      regex: /\[([^\]]+)\]/g,
      type: 'bracketed' as const,
      captureGroup: 1
    },
    {
      regex: /\(([^)]+)\)/g,
      type: 'parenthesized' as const,
      captureGroup: 1
    },
    {
      regex: /«([^»]+)»/g,
      type: 'guillemet' as const,
      captureGroup: 1
    },
  ];

  // Find all matches across all patterns
  interface Match {
    start: number;
    end: number;
    type: TextSegment['type'];
    content: string;
    rawContent: string;
  }

  const allMatches: Match[] = [];

  patterns.forEach(({ regex, type, captureGroup }) => {
    const re = new RegExp(regex.source, regex.flags);
    let match;

    while ((match = re.exec(text)) !== null) {
      allMatches.push({
        start: match.index,
        end: match.index + match[0].length,
        type,
        content: match[captureGroup],
        rawContent: match[0]
      });
    }
  });

  // Sort by start position
  allMatches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (keep first occurrence)
  const validMatches: Match[] = [];
  let lastEnd = 0;

  for (const match of allMatches) {
    if (match.start >= lastEnd) {
      validMatches.push(match);
      lastEnd = match.end;
    }
  }

  // Build segments
  currentPos = 0;
  validMatches.forEach(match => {
    // Add plain text before this match
    if (currentPos < match.start) {
      const plainText = text.substring(currentPos, match.start);
      if (plainText) {
        segments.push({
          type: 'text',
          content: plainText
        });
      }
    }

    // Add the formatted segment
    segments.push({
      type: match.type,
      content: match.content,
      rawContent: match.rawContent
    });

    currentPos = match.end;
  });

  // Add remaining text
  if (currentPos < text.length) {
    const remaining = text.substring(currentPos);
    if (remaining) {
      segments.push({
        type: 'text',
        content: remaining
      });
    }
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}

/**
 * Parse a single line to determine its type
 */
function parseContentLine(line: string): ContentLine {
  const trimmed = line.trim();

  if (!trimmed) {
    return { type: 'empty', content: '' };
  }

  // Check for markdown-style header
  if (trimmed.startsWith('##')) {
    return {
      type: 'header',
      content: trimmed.replace(/^##\s*/, '').trim()
    };
  }


  // Check for poem verse (F...X format)
  if (trimmed.startsWith('F') && trimmed.endsWith('X')) {
    const poemContent = trimmed.slice(1, -1).trim(); // Remove F and X
    const parts = poemContent.split('__').filter(Boolean);

    return {
      type: 'poemVerse',
      content: poemContent,
      parts: parts.map((part, idx) => ({
        content: part.trim(),
        isRight: idx % 2 === 0 // First, third, etc. to right; second, fourth to left
      }))
    };
  }

  // Check for numbered item (1., 2., etc.)
  // Matches "1. Text" or "10. Text"
  const numberedMatch = trimmed.match(/^(\d+\.)\s+(.*)$/);
  if (numberedMatch) {
    return {
      type: 'numbered',
      content: trimmed,
      numberPart: numberedMatch[1],
      textPart: numberedMatch[2]
    };
  }

  // Default to regular text
  return {
    type: 'text',
    content: trimmed
  };
}

/**
 * Render text segments with proper styling
 */
function renderTextSegments(segments: TextSegment[]): React.ReactNode {
  return segments.map((segment, idx) => {
    switch (segment.type) {
      case 'quranic':
        return (
          <Text
            key={idx}
            className="text-emerald-800 dark:text-emerald-400 text-2xl"
            style={{
              fontFamily: 'Amiri_700Bold',
              lineHeight: 40,
              paddingHorizontal: 4
            }}
          >
            ﴾{segment.content}﴿
          </Text>
        );

      case 'footnote':
        return (
          <Text
            key={idx}
            className="text-xs text-muted-foreground dark:text-muted-foreground-dark"
            style={{
              fontSize: 11,
              lineHeight: 16,
              textAlignVertical: 'top',
              marginTop: -6,
              color: '#888'
            }}
          >
            [{segment.content}]
          </Text>
        );

      case 'citation':
        return (
          <Text
            key={idx}
            className="text-xs text-slate-500 dark:text-slate-400"
            style={{ fontSize: 12 }}
          >
            [{segment.content}]
          </Text>
        );

      case 'instruction':
        return (
          <Text
            key={idx}
            className="text-xs text-amber-600 dark:text-amber-400 italic"
            style={{ fontSize: 12 }}
          >
            [{segment.content}]
          </Text>
        );

      case 'bracketed':
        return (
          <Text
            key={idx}
            className="italic text-slate-600 dark:text-slate-400"
          >
            [{segment.content}]
          </Text>
        );

      case 'parenthesized':
        return (
          <Text
            key={idx}
            className="text-foreground/90 dark:text-foreground-dark/90"
          >
            ({segment.content})
          </Text>
        );

      case 'guillemet':
        return (
          <Text
            key={idx}
            className="font-semibold text-amber-800 dark:text-amber-400"
          >
            «{segment.content}»
          </Text>
        );

      case 'text':
      default:
        return (
          <Text key={idx}>
            {segment.content}
          </Text>
        );
    }
  });
}

/**
 * Main rendering function
 */
export function renderFormattedContent(content: string): React.ReactNode {
  if (!content) return null;

  const lines = content.split('\n');
  const parsedLines = lines.map(parseContentLine);

  return parsedLines.map((line, index) => {
    switch (line.type) {
      case 'empty':
        return <View key={index} className="h-4" />;

      case 'header':
        return (
          <Heading
            key={index}
            className="mt-8 mb-4 text-4xl font-bold text-primary dark:text-primary-dark "
          >
            {/* {renderTextSegments(parseInlineFormatting(line.content))} */}
            {line.content}
          </Heading>
        );

      case 'poemVerse':
        return (
          <View key={index} className="my-4 px-4 w-full">
            {line.parts?.map((part, partIndex) => (
              <View
                key={`${index}-${partIndex}`}
                className={`py-1 w-full ${part.isRight ? 'items-start' : 'items-end'}`}
              >
                <Text
                  className={`text-xl font-medium leading-9 text-foreground dark:text-foreground-dark`}
                  style={{
                    writingDirection: 'rtl',
                    textAlign: part.isRight ? 'right' : 'left',
                    fontFamily: 'Amiri_400Regular'
                  }}
                >
                  {renderTextSegments(parseInlineFormatting(part.content))}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'numbered':
        return (
          <View key={index} className="flex-row my-2 w-full" style={{ direction: 'rtl' }}>
            <Text className="font-bold text-lg text-primary dark:text-primary-dark ml-2 mt-1">
              {line.numberPart}
            </Text>
            <Text
              className="flex-1 text-lg leading-9 text-foreground dark:text-foreground-dark text-justify"
              style={{ writingDirection: 'rtl' }}
            >
              {line.textPart && renderTextSegments(parseInlineFormatting(line.textPart))}
            </Text>
          </View>
        );

      case 'text':
      default:
        return (
          <Body
            key={index}
            className="leading-9 text-lg my-1 text-foreground dark:text-foreground-dark text-justify"
            style={{ writingDirection: 'rtl' }}
          >
            {renderTextSegments(parseInlineFormatting(line.content))}
          </Body>
        );
    }
  });
}
