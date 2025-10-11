# Batch Theme Implementation Script

This file contains all the find-and-replace patterns you need to implement the centralized color palette across all remaining files.

## General Pattern

For each file that needs updates:
1. Add import at the top: `import { THEME, BG, SECTION_BG } from '@/lib/theme'`
2. Replace hardcoded gradients with THEME constants (see mappings below)

## Global Replacements

### Teams (Purple/Indigo)
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-r from-purple-500 to-indigo-600` | `${THEME.TEAMS.GRADIENT}` |
| `bg-gradient-to-br from-purple-500 to-indigo-600` | `${THEME.TEAMS.GRADIENT_BR}` |
| `hover:from-purple-700 hover:to-indigo-700` | `${THEME.TEAMS.GRADIENT_HOVER}` |
| `bg-gradient-to-br from-purple-50 to-indigo-50` | `${SECTION_BG.PURPLE}` |

### Players (Red/Orange)
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-r from-red-500 to-orange-600` | `${THEME.PLAYER.GRADIENT}` |
| `bg-gradient-to-r from-red-600 to-orange-600` | `${THEME.PLAYER.GRADIENT}` |
| `bg-gradient-to-br from-red-500 to-orange-600` | `${THEME.PLAYER.GRADIENT_BR}` |
| `hover:from-red-700 hover:to-orange-700` | `${THEME.PLAYER.GRADIENT_HOVER}` |
| `bg-gradient-to-br from-red-50 to-orange-50` | `${SECTION_BG.RED}` |
| `bg-gradient-to-r from-red-50 to-orange-50` | `${SECTION_BG.RED}` |

### Info/Actions (Blue/Indigo)  
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-r from-blue-600 to-indigo-600` | `${THEME.INFO.GRADIENT}` |
| `bg-gradient-to-br from-blue-500 to-indigo-600` | `${THEME.INFO.GRADIENT_BR}` |
| `bg-gradient-to-br from-blue-600 to-indigo-600` | `${THEME.INFO.GRADIENT_BR}` |
| `hover:from-blue-700 hover:to-indigo-700` | `${THEME.INFO.GRADIENT_HOVER}` |
| `bg-gradient-to-br from-blue-50 to-indigo-50` | `${SECTION_BG.BLUE}` |
| `bg-gradient-to-r from-blue-50 to-indigo-50` | `${SECTION_BG.BLUE}` |

### Success (Green/Emerald)
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-r from-green-500 to-emerald-600` | `${THEME.SUCCESS.GRADIENT}` |
| `bg-gradient-to-br from-green-500 to-green-700` | `${THEME.SUCCESS.GRADIENT_BR}` |
| `bg-gradient-to-br from-green-50 to-green-100` | `${SECTION_BG.GREEN}` |
| `bg-gradient-to-br from-green-50 to-emerald-50` | `${SECTION_BG.GREEN}` |

### Warning/Featured (Yellow/Orange)
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-r from-yellow-400 to-orange-500` | `${THEME.WARNING.GRADIENT}` |
| `bg-gradient-to-r from-yellow-500 to-orange-600` | `${THEME.WARNING.GRADIENT}` |
| `bg-gradient-to-br from-yellow-400 to-orange-500` | `${THEME.WARNING.GRADIENT_BR}` |
| `bg-gradient-to-br from-yellow-500 to-orange-600` | `${THEME.WARNING.GRADIENT_BR}` |
| `bg-gradient-to-br from-yellow-50 to-orange-50` | `${SECTION_BG.YELLOW}` |
| `bg-gradient-to-r from-yellow-50 to-orange-50` | `${SECTION_BG.YELLOW}` |

### Achievements (Purple/Pink)
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-br from-purple-50 to-pink-50` | `${SECTION_BG.PURPLE}` |
| `bg-gradient-to-r from-purple-500 to-pink-600` | `${THEME.ACHIEVEMENT.GRADIENT}` |

### Backgrounds
| Find | Replace With |
|------|--------------|
| `bg-gradient-to-br from-gray-50 to-gray-100` | `${BG.PAGE}` |
| `bg-gradient-to-br from-gray-50 to-blue-50` | `${BG.LIGHT}` |
| `bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50` | `${BG.GRADIENT}` |

## Files Status

### ✅ COMPLETED
- AdminDashboard.tsx
- dashboardv2/page.tsx  
- PlayerList.tsx
- TeamsList.tsx (partial - still needs gradient replacements)

### 🔄 TO DO - Priority Order

#### 1. TeamsList.tsx (continue)
**Lines to update:**
- Line 142: `bg-gradient-to-r from-purple-500 to-indigo-600` → `${THEME.TEAMS.GRADIENT}`
- Line 184: `hover:from-purple-50 hover:to-indigo-50` → `hover:${SECTION_BG.PURPLE}`  
- Line 190: `bg-gradient-to-br from-purple-100 to-indigo-100` → Use purple-indigo styling
- Line 227: `bg-gradient-to-r from-purple-600 to-indigo-600` → `${THEME.TEAMS.GRADIENT}`
- Line 227: `hover:from-purple-700 hover:to-indigo-700` → `${THEME.TEAMS.GRADIENT_HOVER}`
- Line 332: `bg-gradient-to-r from-purple-600 to-indigo-600` → `${THEME.TEAMS.GRADIENT}`

#### 2. Match Schedule Components

**DisplayMatchScedule.tsx:**
```typescript
import { THEME, SECTION_BG } from '@/lib/theme'
```
- Blue gradients → `THEME.INFO`
- Yellow-orange gradients → `THEME.WARNING`

**DisplayEliminationMatchSchedule.tsx:**  
```typescript
import { THEME, SECTION_BG } from '@/lib/theme'
```
- Yellow-orange → `THEME.WARNING`
- Blue-indigo → `THEME.INFO`

**DisplayMatchResult.tsx:**
```typescript
import { THEME, SECTION_BG } from '@/lib/theme'
```
- Blue gradients → `THEME.INFO`
- Yellow-orange → `THEME.WARNING`
- Green → `THEME.SUCCESS`

**GenerateMatchSchedule.tsx:**
```typescript
import { THEME } from '@/lib/theme'
```
- Blue-indigo → `THEME.INFO`

#### 3. Game Components

**PlayerScoreTable.tsx:**
```typescript
import { THEME, SECTION_BG } from '@/lib/theme'
```
- Blue-indigo gradients → `THEME.INFO`

**UpdateGames.tsx:**
```typescript
import { BG } from '@/lib/theme'
```
- Background → `BG.PAGE`

#### 4. Match Schedule Pages

**administrator/match-schedule/page.tsx:**
```typescript
import { THEME, SECTION_BG, BG } from '@/lib/theme'
```
- Orange-red → `THEME.PLAYER`
- Yellow-orange → `THEME.WARNING`
- Blue → `THEME.INFO`

**@RoundRobinMatch/page.tsx:**
```typescript
import { SECTION_BG } from '@/lib/theme'
```
- Gray-blue background → `SECTION_BG.BLUE`

#### 5. Page-Level Files

**app/page.tsx (Homepage):**
```typescript
import { THEME } from '@/lib/theme'
```
- Orange-red → `THEME.PLAYER.GRADIENT`
- Blue-purple → `THEME.INFO.GRADIENT`

**app/teams/page.tsx:**
```typescript
import { THEME, BG } from '@/lib/theme'
```
- Purple-indigo → `THEME.TEAMS`
- Background → `BG.PAGE`

**administrator/teams/page.tsx:**
```typescript
import { BG } from '@/lib/theme'
```
- Background → `BG.PAGE`

## Quick Implementation Guide

For each file:

1. **Add import** (usually after other imports):
   ```typescript
   import { THEME, BG, SECTION_BG } from '@/lib/theme'
   ```

2. **Find hardcoded gradients** using search:
   - Search for: `from-purple-`, `from-blue-`, `from-red-`, `from-yellow-`, `from-green-`

3. **Replace with template literals**:
   ```typescript
   // Before
   className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
   
   // After
   className={`${THEME.TEAMS.GRADIENT} text-white`}
   ```

4. **Use hover states**:
   ```typescript
   // Before
   className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
   
   // After
   className={`${THEME.INFO.GRADIENT} ${THEME.INFO.GRADIENT_HOVER} transition-all`}
   ```

## Testing Checklist

After updates, verify:
- [ ] All pages render without errors
- [ ] Colors are consistent across similar components
- [ ] Hover states work properly
- [ ] No hardcoded gradients remain (search for `from-purple-`, etc.)
- [ ] Theme constants are imported where needed

## Remaining Work Estimate
- 15-20 files to update
- ~2-3 gradients per file average
- Estimated time: 30-45 minutes

## Benefits
✅ Centralized color management
✅ Easy to update entire app's color scheme
✅ Consistent branding across all pages
✅ Better maintainability
✅ Documented color purposes (teams vs players vs info)
