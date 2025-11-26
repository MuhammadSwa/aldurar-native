import React from 'react';
import { View, Text } from 'react-native';
import { Body, Heading, Muted } from '@/components/Typography';

interface ContentLine {
    type: 'header' | 'poemVerse' | 'numbered' | 'text' | 'quranic' | 'guillemet' | 'bracketed' | 'footnote' | 'empty';
    content: string;
    parts?: { content: string; isRight: boolean }[]; // For poem verses
}

/**
 * Advanced content parser for azkar text
 * Handles:
 * - Headers (## )
 * - Poem verses (F...__)
 * - Numbered items (1., 2., etc.)
 * - Quranic verses (﴾...﴿)
 * - Guillemet text («...»)
 * - Bracketed text ([...])
 * - Footnotes ([^...] or [^^...])
 * - Regular text
 */
function parseContentLine(line: string): ContentLine {
    const trimmed = line.trim();

    if (!trimmed) {
        return { type: 'empty', content: '' };
    }

    // Check for header
    if (trimmed.startsWith('##')) {
        return {
            type: 'header',
            content: trimmed.replace(/^##\s*/, '')
        };
    }

    // Check for poem verse (F...X format)
    if (trimmed.startsWith('F') && trimmed.endsWith('X')) {
        const poemContent = trimmed.slice(1, -1); // Remove F and X
        const parts = poemContent.split('__').map(s => s.trim()).filter(Boolean);

        return {
            type: 'poemVerse',
            content: poemContent,
            parts: parts.length === 2 ? [
                { content: parts[0], isRight: true },
                { content: parts[1], isRight: false }
            ] : [{ content: poemContent, isRight: true }]
        };
    }

    // Check for numbered item
    if (/^\d+\./.test(trimmed)) {
        return {
            type: 'numbered',
            content: trimmed
        };
    }

    // Check if contains footnote markers
    if (trimmed.includes('[^')) {
        return {
            type: 'footnote',
            content: trimmed
        };
    }

    return {
        type: 'text',
        content: trimmed
    };
}

/**
 * Parse text segments within a line to handle special formatting
 */
function renderTextWithFormatting(text: string): React.ReactNode {
    const segments: React.ReactNode[] = [];
    let currentIndex = 0;
    const patterns = [
        { regex: /﴾([^﴿]+)﴿/g, type: 'quranic' },
        { regex: /«([^»]+)»/g, type: 'guillemet' },
        { regex: /\[([^\]]+)\]/g, type: 'bracketed' },
        { regex: /\[\^+([^\]]+)\]/g, type: 'footnote' },
    ];

    // Collect all matches with their positions
    const matches: Array<{ start: number; end: number; content: string; type: string }> = [];

    patterns.forEach(({ regex, type }) => {
        let match;
        const re = new RegExp(regex);
        while ((match = re.exec(text)) !== null) {
            matches.push({
                start: match.index,
                end: match.index + match[0].length,
                content: match[1] || match[0],
                type
            });
        }
    });

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Build segments
    matches.forEach((match, index) => {
        // Add text before this match
        if (currentIndex < match.start) {
            segments.push(
                <Text key={`text-${index}`}>
                    {text.substring(currentIndex, match.start)}
                </Text>
            );
        }

        // Add formatted match
        segments.push(
            <Text
                key={`${match.type}-${index}`}
                className={getStyleForType(match.type)}
            >
                {match.content}
            </Text>
        );

        currentIndex = match.end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
        segments.push(
            <Text key="text-end">
                {text.substring(currentIndex)}
            </Text>
        );
    }

    return segments.length > 0 ? <Text>{segments}</Text> : <Text>{text}</Text>;
}

function getStyleForType(type: string): string {
    switch (type) {
        case 'quranic':
            return 'font-bold text-primary dark:text-primary-dark';
        case 'guillemet':
            return 'font-semibold text-accent dark:text-accent-dark';
        case 'bracketed':
            return 'italic text-muted-foreground dark:text-muted-foreground-dark';
        case 'footnote':
            return 'text-xs text-muted-foreground dark:text-muted-foreground-dark align-super';
        default:
            return '';
    }
}

export function renderFormattedContent(content: string): React.ReactNode {
    if (!content) return null;

    const lines = content.split('\n');
    const parsedLines = lines.map(parseContentLine);

    return parsedLines.map((line, index) => {
        switch (line.type) {
            case 'empty':
                return <View key={index} className="h-2" />;

            case 'header':
                return (
                    <Heading
                        key={index}
                        className="mt-6 mb-3 text-xl text-primary dark:text-primary-dark text-center"
                    >
                        {line.content}
                    </Heading>
                );

            case 'poemVerse':
                // Render poem verses in two parts
                return (
                    <View key={index} className="mb-3">
                        {line.parts?.map((part, partIndex) => (
                            <Body
                                key={`${index}-${partIndex}`}
                                className={`text-lg font-medium leading-[2rem] ${part.isRight
                                        ? 'text-right'
                                        : 'text-left pl-8'
                                    }`}
                                style={{ writingDirection: 'rtl' }}
                            >
                                {renderTextWithFormatting(part.content)}
                            </Body>
                        ))}
                    </View>
                );

            case 'numbered':
                return (
                    <Body
                        key={index}
                        className="my-2 text-lg font-semibold text-primary dark:text-primary-dark leading-[2rem]"
                        style={{ writingDirection: 'rtl' }}
                    >
                        {renderTextWithFormatting(line.content)}
                    </Body>
                );

            case 'footnote':
                return (
                    <Muted
                        key={index}
                        className="my-1 text-sm leading-5"
                        style={{ writingDirection: 'rtl' }}
                    >
                        {renderTextWithFormatting(line.content)}
                    </Muted>
                );

            case 'text':
            default:
                return (
                    <Body
                        key={index}
                        className="leading-[2.5rem] text-lg font-normal my-1"
                        style={{ writingDirection: 'rtl' }}
                    >
                        {renderTextWithFormatting(line.content)}
                    </Body>
                );
        }
    });
}
