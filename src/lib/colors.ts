/**
 * Centralized Color Palette for LBA Web Application
 * This ensures consistent colors across all components
 */

export const colors = {
  // Primary Theme - Purple/Indigo for Teams & Main UI
  primary: {
    from: "from-purple-500",
    to: "to-indigo-600",
    gradient: "bg-gradient-to-r from-purple-500 to-indigo-600",
    gradientBr: "bg-gradient-to-br from-purple-500 to-indigo-600",
    text: "text-purple-600",
    bg: "bg-purple-500",
    border: "border-purple-500",
    ring: "ring-purple-500",
    hover: "hover:from-purple-600 hover:to-indigo-700",
  },

  // Secondary Theme - Blue/Indigo for Info & Actions
  secondary: {
    from: "from-blue-600",
    to: "to-indigo-600",
    gradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
    gradientBr: "bg-gradient-to-br from-blue-600 to-indigo-600",
    text: "text-blue-600",
    bg: "bg-blue-600",
    border: "border-blue-600",
    ring: "ring-blue-600",
    hover: "hover:from-blue-700 hover:to-indigo-700",
  },

  // Player Theme - Red/Orange
  player: {
    from: "from-red-500",
    to: "to-orange-600",
    gradient: "bg-gradient-to-r from-red-500 to-orange-600",
    gradientBr: "bg-gradient-to-br from-red-500 to-orange-600",
    text: "text-red-600",
    bg: "bg-red-500",
    border: "border-red-500",
    ring: "ring-red-500",
    hover: "hover:from-red-600 hover:to-orange-700",
  },

  // Success Theme - Green/Emerald
  success: {
    from: "from-green-500",
    to: "to-emerald-600",
    gradient: "bg-gradient-to-r from-green-500 to-emerald-600",
    gradientBr: "bg-gradient-to-br from-green-500 to-emerald-600",
    text: "text-green-600",
    bg: "bg-green-500",
    border: "border-green-500",
    ring: "ring-green-500",
    hover: "hover:from-green-600 hover:to-emerald-700",
  },

  // Warning Theme - Yellow/Orange
  warning: {
    from: "from-yellow-400",
    to: "to-orange-500",
    gradient: "bg-gradient-to-r from-yellow-400 to-orange-500",
    gradientBr: "bg-gradient-to-br from-yellow-400 to-orange-500",
    text: "text-yellow-600",
    bg: "bg-yellow-400",
    border: "border-yellow-400",
    ring: "ring-yellow-400",
    hover: "hover:from-yellow-500 hover:to-orange-600",
  },

  // Error/Danger Theme - Red
  danger: {
    from: "from-red-500",
    to: "to-red-700",
    gradient: "bg-gradient-to-r from-red-500 to-red-700",
    gradientBr: "bg-gradient-to-br from-red-500 to-red-700",
    text: "text-red-600",
    bg: "bg-red-500",
    border: "border-red-500",
    ring: "ring-red-500",
    hover: "hover:from-red-600 hover:to-red-800",
  },

  // Achievement/MVP Theme - Purple/Pink
  achievement: {
    from: "from-purple-500",
    to: "to-pink-600",
    gradient: "bg-gradient-to-r from-purple-500 to-pink-600",
    gradientBr: "bg-gradient-to-br from-purple-500 to-pink-600",
    text: "text-purple-600",
    bg: "bg-purple-500",
    border: "border-purple-500",
    ring: "ring-purple-500",
    hover: "hover:from-purple-600 hover:to-pink-700",
  },

  // Background Gradients
  background: {
    light: "bg-gradient-to-br from-gray-50 to-gray-100",
    card: "bg-white",
    hover: "hover:bg-gray-50",
  },

  // Card/Section Backgrounds (Subtle gradients)
  section: {
    blue: "bg-gradient-to-br from-blue-50 to-indigo-50",
    purple: "bg-gradient-to-br from-purple-50 to-pink-50",
    green: "bg-gradient-to-br from-green-50 to-emerald-50",
    yellow: "bg-gradient-to-br from-yellow-50 to-orange-50",
    red: "bg-gradient-to-br from-red-50 to-orange-50",
    gray: "bg-gradient-to-r from-gray-50 to-gray-100",
  },

  // Border Colors
  border: {
    blue: "border-blue-100",
    purple: "border-purple-100",
    green: "border-green-100",
    yellow: "border-yellow-200",
    red: "border-red-200",
    gray: "border-gray-200",
  },

  // Text Colors
  text: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    muted: "text-gray-600",
    light: "text-gray-500",
    white: "text-white",
  },

  // Icon Colors
  icon: {
    blue: "text-blue-600",
    purple: "text-purple-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    orange: "text-orange-600",
    indigo: "text-indigo-600",
  },

  // Stats/Metrics Colors
  stats: {
    points: "from-blue-500 to-indigo-600",
    rebounds: "from-orange-500 to-red-600",
    assists: "from-green-500 to-emerald-600",
    threePointers: "from-purple-500 to-indigo-600",
    fouls: "from-red-500 to-orange-600",
  },
} as const;

/**
 * Helper function to get gradient classes
 */
export const getGradient = (type: keyof typeof colors, direction: 'r' | 'br' = 'r') => {
  const theme = colors[type as keyof typeof colors];
  if (theme && 'gradient' in theme) {
    return direction === 'r' ? theme.gradient : theme.gradientBr;
  }
  return '';
};

/**
 * Helper function to combine gradient with hover
 */
export const getButtonGradient = (type: keyof typeof colors) => {
  const theme = colors[type as keyof typeof colors];
  if (theme && 'gradient' in theme && 'hover' in theme) {
    return `${theme.gradient} ${theme.hover}`;
  }
  return '';
};
