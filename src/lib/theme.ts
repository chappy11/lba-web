/**
 * LBA Color Palette - Quick Reference
 * Import this file to access consistent color classes
 */

// THEME COLORS
export const THEME = {
  // Teams & Main UI (Purple/Indigo)
  TEAMS: {
    GRADIENT: 'bg-gradient-to-r from-purple-500 to-indigo-600',
    GRADIENT_BR: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    GRADIENT_HOVER: 'hover:from-purple-600 hover:to-indigo-700',
    TEXT: 'text-purple-600',
    BG: 'bg-purple-500',
    BORDER: 'border-purple-500',
  },

  // Info & Actions (Blue/Indigo)
  INFO: {
    GRADIENT: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    GRADIENT_BR: 'bg-gradient-to-br from-blue-600 to-indigo-600',
    GRADIENT_HOVER: 'hover:from-blue-700 hover:to-indigo-700',
    TEXT: 'text-blue-600',
    BG: 'bg-blue-600',
    BORDER: 'border-blue-600',
  },

  // Players (Red/Orange)
  PLAYER: {
    GRADIENT: 'bg-gradient-to-r from-red-500 to-orange-600',
    GRADIENT_BR: 'bg-gradient-to-br from-red-500 to-orange-600',
    GRADIENT_HOVER: 'hover:from-red-600 hover:to-orange-700',
    TEXT: 'text-red-600',
    BG: 'bg-red-500',
    BORDER: 'border-red-500',
  },

  // Success (Green/Emerald)
  SUCCESS: {
    GRADIENT: 'bg-gradient-to-r from-green-500 to-emerald-600',
    GRADIENT_BR: 'bg-gradient-to-br from-green-500 to-emerald-600',
    GRADIENT_HOVER: 'hover:from-green-600 hover:to-emerald-700',
    TEXT: 'text-green-600',
    BG: 'bg-green-500',
    BORDER: 'border-green-500',
  },

  // Warning/Featured (Yellow/Orange)
  WARNING: {
    GRADIENT: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    GRADIENT_BR: 'bg-gradient-to-br from-yellow-400 to-orange-500',
    GRADIENT_HOVER: 'hover:from-yellow-500 hover:to-orange-600',
    TEXT: 'text-yellow-600',
    BG: 'bg-yellow-400',
    BORDER: 'border-yellow-400',
  },

  // Achievements/MVP (Purple/Pink)
  ACHIEVEMENT: {
    GRADIENT: 'bg-gradient-to-r from-purple-500 to-pink-600',
    GRADIENT_BR: 'bg-gradient-to-br from-purple-500 to-pink-600',
    GRADIENT_HOVER: 'hover:from-purple-600 hover:to-pink-700',
    TEXT: 'text-purple-600',
    BG: 'bg-purple-500',
    BORDER: 'border-purple-500',
  },
} as const;

// SECTION BACKGROUNDS (Subtle gradients for content areas)
export const SECTION_BG = {
  BLUE: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  PURPLE: 'bg-gradient-to-br from-purple-50 to-pink-50',
  GREEN: 'bg-gradient-to-br from-green-50 to-emerald-50',
  YELLOW: 'bg-gradient-to-br from-yellow-50 to-orange-50',
  RED: 'bg-gradient-to-br from-red-50 to-orange-50',
  GRAY: 'bg-gradient-to-r from-gray-50 to-gray-100',
} as const;

// BACKGROUND COLORS
export const BG = {
  LIGHT: 'bg-gradient-to-br from-gray-50 to-blue-50',
  GRADIENT: 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50',
  WHITE: 'bg-white',
  GRAY: 'bg-gray-50',
} as const;

// BORDERS
export const BORDERS = {
  BLUE: 'border-blue-100',
  PURPLE: 'border-purple-100',
  GREEN: 'border-green-100',
  YELLOW: 'border-yellow-200',
  RED: 'border-red-200',
  GRAY: 'border-gray-200',
} as const;

// TEXT COLORS
export const TEXT = {
  PRIMARY: 'text-gray-900',
  SECONDARY: 'text-gray-700',
  MUTED: 'text-gray-600',
  LIGHT: 'text-gray-500',
  WHITE: 'text-white',
} as const;

// ICON COLORS
export const ICONS = {
  BLUE: 'text-blue-600',
  PURPLE: 'text-purple-600',
  GREEN: 'text-green-600',
  YELLOW: 'text-yellow-600',
  RED: 'text-red-600',
  ORANGE: 'text-orange-600',
  INDIGO: 'text-indigo-600',
} as const;

// STATS COLORS
export const STATS = {
  POINTS: 'from-blue-500 to-indigo-600',
  REBOUNDS: 'from-orange-500 to-red-600',
  ASSISTS: 'from-green-500 to-emerald-600',
  THREE_POINTERS: 'from-purple-500 to-indigo-600',
  FOULS: 'from-red-500 to-orange-600',
} as const;

// COMMON COMBINATIONS
export const COMBINATIONS = {
  // Button with gradient and hover
  BUTTON_PRIMARY: `${THEME.TEAMS.GRADIENT} ${THEME.TEAMS.GRADIENT_HOVER} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all`,
  BUTTON_SECONDARY: `${THEME.INFO.GRADIENT} ${THEME.INFO.GRADIENT_HOVER} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all`,
  BUTTON_PLAYER: `${THEME.PLAYER.GRADIENT} ${THEME.PLAYER.GRADIENT_HOVER} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all`,

  // Section with background and border
  SECTION_INFO: `${SECTION_BG.BLUE} ${BORDERS.BLUE} rounded-xl p-4`,
  SECTION_SUCCESS: `${SECTION_BG.GREEN} ${BORDERS.GREEN} rounded-xl p-4`,
  SECTION_WARNING: `${SECTION_BG.YELLOW} ${BORDERS.YELLOW} rounded-xl p-4`,
  SECTION_PLAYER: `${SECTION_BG.RED} ${BORDERS.RED} rounded-xl p-4`,
  SECTION_ACHIEVEMENT: `${SECTION_BG.PURPLE} ${BORDERS.PURPLE} rounded-xl p-4`,

  // Card styles
  CARD: 'bg-white rounded-2xl shadow-lg border border-gray-200',
  CARD_HOVER: 'bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-300',
  
  // Header accent bars
  ACCENT_TEAMS: 'h-12 w-2 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full',
  ACCENT_PLAYER: 'h-1 w-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full',
  ACCENT_INFO: 'h-1 w-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full',
} as const;

// Helper function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};
