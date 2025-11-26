export const themes = {
  light: {
    colors: {
      // Semantic colors
      text: '#0B2D17', // deep greenish black for readability
      subtext: '#536053',
      background: '#F7F5EF', // soft tent canvas / sand cream
      surface: '#FFFFFF', // surfaces that sit above canvas

      // Primary brand greens (Sufi-inspired)
      primary: '#2F9E4B', // primary
      primary700: '#256F39',
      primary500: '#2F9E4B',
      primary300: '#85D49E',

      // Accents and alternative
      accent: '#8CC3B2', // cool teal accent
      gold: '#C9A34A', // tent/gilded accent

      // Supporting colors
      success: '#2DB34A',
      danger: '#D9534F',
      muted: '#6B7280',
      border: '#E6E2D9',
      placeholder: '#A0A39F',
      shadow: 'rgba(11, 45, 23, 0.08)',
      // On colors (text that sits on a particular background)
      onPrimary: '#FFFFFF',
      onBackground: '#0B2D17',
      onSurface: '#0B2D17',
    },
  },
  dark: {
    colors: {
      text: '#ECECEE',
      subtext: '#9AA59A',
      background: '#08130F', // dark tent canvas
      surface: '#0E2216', // slightly raised surface

      // Primary brand greens (stand out on dark)
      primary: '#2DB34A',
      primary700: '#1B6E2C',
      primary500: '#2DB34A',
      primary300: '#60DA82',

      accent: '#7FC9B8',
      gold: '#C9A34A',

      success: '#2DB34A',
      danger: '#F8716F',
      muted: '#9BA1A6',
      border: '#101A14',
      placeholder: '#7B8A7B',
      shadow: 'rgba(0,0,0,0.6)',
      // On colors
      onPrimary: '#08130F',
      onBackground: '#ECEDEE',
      onSurface: '#ECEDEE',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const sizes = {
  tileHeight: 64,
  icon: 24,
  chevron: 28,
};

export const radii = {
  sm: 4,
  md: 8,
  lg: 12,
};

export default {
  themes,
  spacing,
  sizes,
  radii,
};

export type ThemeName = keyof typeof themes;
export interface Tokens {
  colors: typeof themes.light.colors;
  spacing: typeof spacing;
  sizes: typeof sizes;
  radii: typeof radii;
}
