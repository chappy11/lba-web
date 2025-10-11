/**
 * Color Palette Reference Component
 * Use this to visualize the color palette in development
 * Access at /color-palette route (create the route to use this)
 */

import { BORDERS, COMBINATIONS, ICONS, SECTION_BG, STATS, TEXT, THEME } from '@/lib/theme';
import { Award, MapPin, Shield, Star, Trophy, Users } from 'lucide-react';

export default function ColorPaletteReference() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h1 className="text-4xl font-black text-gray-900 mb-4">LBA Color Palette Reference</h1>
          <p className="text-gray-600">Consistent colors across all components</p>
        </div>

        {/* Theme Colors */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme Colors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Teams Theme */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Teams (Purple/Indigo)
              </h3>
              <div className={`${THEME.TEAMS.GRADIENT} h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg`}>
                Primary Theme
              </div>
              <div className={`${SECTION_BG.BLUE} ${BORDERS.BLUE} p-4 rounded-lg`}>
                <p className="text-sm text-gray-700">Section Background</p>
              </div>
            </div>

            {/* Info Theme */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Info (Blue/Indigo)
              </h3>
              <div className={`${THEME.INFO.GRADIENT} h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg`}>
                Secondary Theme
              </div>
              <div className={`${SECTION_BG.BLUE} ${BORDERS.BLUE} p-4 rounded-lg`}>
                <p className="text-sm text-gray-700">Section Background</p>
              </div>
            </div>

            {/* Player Theme */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Players (Red/Orange)
              </h3>
              <div className={`${THEME.PLAYER.GRADIENT} h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg`}>
                Player Theme
              </div>
              <div className={`${SECTION_BG.RED} ${BORDERS.RED} p-4 rounded-lg`}>
                <p className="text-sm text-gray-700">Section Background</p>
              </div>
            </div>

            {/* Success Theme */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Success (Green/Emerald)
              </h3>
              <div className={`${THEME.SUCCESS.GRADIENT} h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg`}>
                Success Theme
              </div>
              <div className={`${SECTION_BG.GREEN} ${BORDERS.GREEN} p-4 rounded-lg`}>
                <p className="text-sm text-gray-700">Section Background</p>
              </div>
            </div>

            {/* Warning Theme */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Warning (Yellow/Orange)
              </h3>
              <div className={`${THEME.WARNING.GRADIENT} h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg`}>
                Warning Theme
              </div>
              <div className={`${SECTION_BG.YELLOW} ${BORDERS.YELLOW} p-4 rounded-lg`}>
                <p className="text-sm text-gray-700">Section Background</p>
              </div>
            </div>

            {/* Achievement Theme */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Achievement (Purple/Pink)
              </h3>
              <div className={`${THEME.ACHIEVEMENT.GRADIENT} h-24 rounded-lg flex items-center justify-center text-white font-semibold shadow-lg`}>
                Achievement Theme
              </div>
              <div className={`${SECTION_BG.PURPLE} ${BORDERS.PURPLE} p-4 rounded-lg`}>
                <p className="text-sm text-gray-700">Section Background</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className={COMBINATIONS.BUTTON_PRIMARY}>
              Primary Button
            </button>
            <button className={COMBINATIONS.BUTTON_SECONDARY}>
              Secondary Button
            </button>
            <button className={COMBINATIONS.BUTTON_PLAYER}>
              Player Button
            </button>
          </div>
        </div>

        {/* Sections */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Examples</h2>
          <div className="space-y-4">
            <div className={COMBINATIONS.SECTION_INFO}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className={ICONS.BLUE} />
                <h3 className="font-bold text-gray-900">Information Section</h3>
              </div>
              <p className="text-gray-700">Blue gradient background for info sections</p>
            </div>

            <div className={COMBINATIONS.SECTION_SUCCESS}>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className={ICONS.GREEN} />
                <h3 className="font-bold text-gray-900">Success Section</h3>
              </div>
              <p className="text-gray-700">Green gradient background for success/scores</p>
            </div>

            <div className={COMBINATIONS.SECTION_WARNING}>
              <div className="flex items-center gap-2 mb-2">
                <Star className={ICONS.YELLOW} />
                <h3 className="font-bold text-gray-900">Warning Section</h3>
              </div>
              <p className="text-gray-700">Yellow gradient background for warnings/featured</p>
            </div>

            <div className={COMBINATIONS.SECTION_PLAYER}>
              <div className="flex items-center gap-2 mb-2">
                <Users className={ICONS.RED} />
                <h3 className="font-bold text-gray-900">Player Section</h3>
              </div>
              <p className="text-gray-700">Red gradient background for player content</p>
            </div>

            <div className={COMBINATIONS.SECTION_ACHIEVEMENT}>
              <div className="flex items-center gap-2 mb-2">
                <Award className={ICONS.PURPLE} />
                <h3 className="font-bold text-gray-900">Achievement Section</h3>
              </div>
              <p className="text-gray-700">Purple gradient background for achievements/MVP</p>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Text Colors</h2>
          <div className="space-y-2">
            <p className={TEXT.PRIMARY}>Primary Text (text-gray-900)</p>
            <p className={TEXT.SECONDARY}>Secondary Text (text-gray-700)</p>
            <p className={TEXT.MUTED}>Muted Text (text-gray-600)</p>
            <p className={TEXT.LIGHT}>Light Text (text-gray-500)</p>
          </div>
        </div>

        {/* Stats Colors */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Stats Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className={`bg-gradient-to-r ${STATS.POINTS} p-4 rounded-lg text-white font-semibold text-center`}>
              Points
            </div>
            <div className={`bg-gradient-to-r ${STATS.REBOUNDS} p-4 rounded-lg text-white font-semibold text-center`}>
              Rebounds
            </div>
            <div className={`bg-gradient-to-r ${STATS.ASSISTS} p-4 rounded-lg text-white font-semibold text-center`}>
              Assists
            </div>
            <div className={`bg-gradient-to-r ${STATS.THREE_POINTERS} p-4 rounded-lg text-white font-semibold text-center`}>
              3-Pointers
            </div>
            <div className={`bg-gradient-to-r ${STATS.FOULS} p-4 rounded-lg text-white font-semibold text-center`}>
              Fouls
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Usage Examples</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <code className="text-sm">
                {`import { THEME, COMBINATIONS } from '@/lib/theme';`}
                <br />
                <br />
                {`<button className={COMBINATIONS.BUTTON_PRIMARY}>Click Me</button>`}
                <br />
                {`<div className={COMBINATIONS.SECTION_INFO}>...</div>`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
