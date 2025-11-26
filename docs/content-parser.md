# Content Parser Documentation

## Overview
The content parser in `lib/contentParser.tsx` is a sophisticated text formatting engine designed to beautifully render Arabic Islamic texts with proper styling for different content types.

## Supported Formats

### 1. **Headers** (`##`)
Lines starting with `##` are rendered as section headers.

**Example:**
```
## الفصل الأول (في الغزل وشكوى الغرام)
```

**Styling:**
- Large, centered text
- Primary color
- Extra spacing above and below

### 2. **Poem Verses** (`F...X`)
Poetry is formatted with special delimiters and split into two parts.

**Format:** `F[right half]__[left half]X`

**Example:**
```
Fيَـا رَبِّ صَلِّ عَلَىٰ الْمُخْتَارِ __ مِن مُّضَـرٍ وَالْأَنبِيَـا وَجَمِيـعِ الرُّسْلِ مَا ذُكِرُواْX
```

**Rendering:**
- First part: Right-aligned
- Second part: Left-aligned, indented
- Font: Medium weight
- RTL (Right-to-Left) text direction

### 3. **Numbered Items** (`1.`, `2.`, etc.)
Lists starting with numbers are highlighted.

**Example:**
```
1. بانت: فارقت
2. سعاد: رمز المحبوبة
```

**Styling:**
- Bold, semibold font
- Primary color
- Extra line spacing

### 4. **Quranic Verses** (`﴾...﴿`)
Quranic text enclosed in decorative brackets.

**Example:**
```
﴾إِذۡ تَسۡتَغِيثُونَ رَبَّكُمۡ فَٱسۡتَجَابَ لَكُمۡ﴿
```

**Styling:**
- Bold text
- Primary color
- Special highlighting

### 5. **Guillemet Text** (`«...»`)
Quoted or emphasized text in French quotes.

**Example:**
```
«أتقاكم»
```

**Styling:**
- Semibold font
- Accent color
- Stands out in regular text

### 6. **Bracketed Text** (`[...]`)
References, notes, or clarifications in square brackets.

**Example:**
```
[1]: متفق عليه، البخاري: 2/981
```

**Styling:**
- Italic text
- Muted color
- Subtle appearance

### 7. **Footnotes** (`[^...]` or `[^^...]`)
Footnote markers and references.

**Example:**
```
[^^1] [^^2] [^^3]
```

**Styling:**
- Small, superscript-like size
- Muted color
- Inline with text

### 8. **Regular Text**
Standard paragraphs and sentences.

**Styling:**
- Large, readable font (18sp/1.17rem)
- Comfortable line height (2.5rem)
- RTL direction for Arabic

### 9. **Empty Lines**
Blank lines for spacing.

**Rendering:**
- Small vertical spacer (8px)

## Usage

### Basic Import
```typescript
import { renderFormattedContent } from '@/lib/contentParser';
```

### In a Component
```tsx
<View>
  {renderFormattedContent(item.content || '')}
</View>
```

## Implementation Details

### Line Parsing
The parser processes content line-by-line:

1. **Split**: Content is split by newlines
2. **Classify**: Each line is classified by type
3. **Parse**: Special formatting within lines is detected
4. **Render**: Appropriate React Native components are returned

### Text Segment Formatting
Within each line, the parser:

1. Detects special patterns (Quranic verses, guillemets, brackets, footnotes)
2. Splits text into segments
3. Applies appropriate styling to each segment
4. Reassembles into a single text component

### Pattern Matching
Uses regex patterns:
```typescript
/﴾([^﴿]+)﴿/g     // Quranic verses
/«([^»]+)»/g      // Guillemets
/\[([^\]]+)\]/g   // Brackets
/\[\^+([^\]]+)\]/g // Footnotes
```

## Styling System

### Color Classes
- `text-primary dark:text-primary-dark` - Headers, important text
- `text-accent dark:text-accent-dark` - Emphasized text
- `text-muted-foreground dark:text-muted-foreground-dark` - Subtle text

### Typography
- Headers: `text-xl` (20px)
- Body: `text-lg` (18px)
- Footnotes: `text-xs` (12px)

### Spacing
- Headers: `mt-6 mb-3` (24px top, 12px bottom)
- Poems: `mb-3` (12px bottom)
- Regular: `my-1` (4px vertical)

## Arabic Text Handling

### RTL (Right-to-Left)
All Arabic content uses:
```tsx
style={{ writingDirection: 'rtl' }}
```

### Text Alignment
- Poems: Split alignment (right/left)
- Headers: Centered
- Body: Natural RTL alignment

## Performance Considerations

1. **Memoization**: Pattern matches are computed once per line
2. **Key Optimization**: Each element has a unique, stable key
3. **Efficient Regex**: Patterns compiled once and reused

## Example Output

### Input
```
## الفصل الأول

Fبَانَتْ سُعَادُ فَقَلْبِي الْيَومَ مَتْبُولُ__مُتَيَّمٌ إِثْرَهَا لَمْ يُفْدَ مَكْبُولُX

قال رسول الله ﷺ: ﴾إِنَّ اللهَ جَمِيلٌ يُحِبُّ الْجَمَالَ﴿

1. بانت: فارقت

يحمل معنى «الصبر» في قلبه [متفق عليه][^^1]
```

### Rendered Output
- **Header**: "الفصل الأول" - large, centered, primary color
- **Poem**: Two lines, right and left aligned
- **Quranic**: Highlighted in bold primary color
- **List**: "1. بانت: فارقت" - bold, primary color
- **Mixed**: Regular text with guillemet emphasis and footnote marker

## Future Enhancements

Potential improvements:
- [ ] Support for custom color themes
- [ ] Adjustable font sizes
- [ ] Copy/share functionality
- [ ] Search within formatted content
- [ ] Accessibility improvements (screen readers)
- [ ] Support for more text decorations
- [ ] Inline images/diagrams
- [ ] Audio pronunciation markers
