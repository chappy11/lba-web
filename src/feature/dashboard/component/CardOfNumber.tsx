import { THEME } from "@/lib/theme"

type Props = {
  count: number
  title: string
  description: string
}

export const CardOfNumber = (props: Props) => {
  const { count, title, description } = props

  // Assign different gradient based on title
  const getGradient = () => {
    if (title === "Players") return THEME.PLAYER.GRADIENT
    if (title === "Teams") return THEME.TEAMS.GRADIENT
    if (title === "Games") return THEME.INFO.GRADIENT
    return THEME.INFO.GRADIENT // default
  }

  return (
    <div
      className={`${getGradient()} border border-white/20 rounded-xl p-6 text-center flex flex-1 flex-col w-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
    >
      <div className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
        {count}
      </div>
      <div className="text-white font-semibold text-lg">{title}</div>
      <div className="text-white/80 text-sm mt-1">{description}</div>
    </div>
  )
}
