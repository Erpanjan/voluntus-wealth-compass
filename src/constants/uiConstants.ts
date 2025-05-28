
export const SECTION_HEIGHTS = {
  FAQ_MOBILE: 520,
  FAQ_SMALL: 380,
  FAQ_MEDIUM: 400,
} as const;

export const BREAKPOINTS = {
  MOBILE: 768,
  SMALL: 640,
  MEDIUM: 768,
} as const;

export const SECTION_HEIGHT_CLASSES = {
  FAQ_MATCH: 'py-16 md:py-24',
  CAROUSEL: 'py-3 md:py-6',
  DEFAULT: 'min-h-[70vh] md:min-h-screen py-8 sm:py-10 md:py-16',
} as const;

export const TAB_CONTENT_HEIGHTS = {
  MOBILE: `${SECTION_HEIGHTS.FAQ_MOBILE}px`,
  SMALL: `${SECTION_HEIGHTS.FAQ_SMALL}px`,
  MEDIUM: `${SECTION_HEIGHTS.FAQ_MEDIUM}px`,
} as const;
