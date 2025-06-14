import { GameTeamInfo } from "@/_lib/dto/Game.model"
import Image from "next/image"

type Props = {
  gameTeamInfo: GameTeamInfo
  score: number
  winner: GameTeamInfo | null
}

export default function TeamInfo(props: Props) {
  const { gameTeamInfo, score, winner } = props

  function isWinner(game: GameTeamInfo): boolean {
    if (!winner) return false
    return (winner?.id as string) === (game.id as string)
  }
    
    function displayCrown() {
       
        if (!winner) return null

        if(winner.id as string === gameTeamInfo.id as string) {
            return (
                <span className="text-yellow-500 text-3xl ml-2 absolute top-0 right-3" role="img" aria-label="crown">
                    👑
                </span>
            )
        }

        return null
  }
  return (
    <div
          className={`text-center 
        relative
        } ${
          isWinner(gameTeamInfo as GameTeamInfo)
            ? "ring-4 ring-black rounded-2xl p-4"
            : ""
        }`}
      >
          {displayCrown()}
      <div className=" flex justify-center items-center mb-4">
        {gameTeamInfo?.teamLogo ? (
          <Image
            src={gameTeamInfo?.teamLogo}
            width={200}
            height={200}
            alt={gameTeamInfo?.teamName}
          />
        ) : (
          <div className=" w-[200px] h-[200px]" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-black mb-1">
        {gameTeamInfo?.teamName}
      </h2>

      <div
        className={`text-5xl font-bold ${
          isWinner(gameTeamInfo as GameTeamInfo)
            ? "text-black"
            : "text-gray-800"
        } transition-colors duration-300`}
      >
        {score}
      </div>
      {isWinner(gameTeamInfo as GameTeamInfo) && (
        <div className="mt-2 text-black font-semibold">WINNER</div>
      )}
    </div>
  )
}
