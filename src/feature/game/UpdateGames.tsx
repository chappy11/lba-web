"use client";

import { Game, GameStatus, GameTeamInfo } from "@/_lib/dto/Game.model"
import { GamePlayer } from "@/_lib/dto/GamePlayer.model"
import { getGamesById } from "@/_lib/server/game";
import { Calendar, Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import PlayerScoreTable from "./component/PlayerScoreTable";
import TeamInfo from "./component/TeamInfo"
import UpdateGame from "./component/UpdateGame"

type Props = {
	gameId: string;
};

export default function UpdateGames(
	props: Props
) {
	const { gameId } = props;
	const [game, setGame] =
		useState<Game | null>(null);
	const [isAnimating, setIsAnimating] =
		useState(false);
	const sendRequest = async () => {
		try {
			const resp = await getGamesById(
				gameId as string
			);

			setGame(resp as Game);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		sendRequest();
	}, [gameId]);

	useEffect(() => {
		setIsAnimating(true);
		const timer = setTimeout(
			() => setIsAnimating(false),
			1000
		);
		return () => clearTimeout(timer);
	}, []);

	const getStatusColor = (
		status: GameStatus
	) => {
		switch (status) {
			case GameStatus.PENDING:
				return "bg-black animate-pulse";
			case GameStatus.DONE:
				return "bg-gray-800";
			case GameStatus.PENDING:
				return "bg-gray-600";
			case GameStatus.DONE:
				return "bg-gray-400";
			default:
				return "bg-gray-500";
		}
	};

	const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Game Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200 mb-6">
          {/* Status Badge */}
          <div className="flex justify-center mb-6">
            <div
              className={`${getStatusColor(
                game?.gameStatus || GameStatus.PENDING
              )} px-4 py-2 rounded-full text-white text-sm font-semibold uppercase tracking-wide`}
            >
              {game?.gameStatus || GameStatus.PENDING}
            </div>
          </div>

          {/* Teams and Score */}
          <div className="grid grid-cols-3 items-center gap-8 mb-8">
            {/* Team One */}
            <TeamInfo
              gameTeamInfo={game?.teamOne as GameTeamInfo}
              score={game?.teamOneScore as number}
              winner={game?.gameWinner as GameTeamInfo | null}
            />

            {/* VS */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600 mb-2">VS</div>
              <div className="w-16 h-1 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Team Two */}
            {/* <div
              className={`text-center transform transition-all duration-500 ${
                isAnimating ? "scale-110" : "scale-100"
              } ${
                isWinner(game?.teamTwo as GameTeamInfo)
                  ? "ring-4 ring-black rounded-2xl p-4"
                  : ""
              }`}
            >
              <div className="text-6xl mb-4">{game?.teamTwo.teamName}</div>
              <h2 className="text-2xl font-bold text-black mb-1">
                {game?.teamTwo.teamName}
              </h2>
              <h3 className="text-xl text-gray-600 mb-4">
                {game?.teamTwo.teamName}
              </h3>
              <div
                className={`text-5xl font-bold ${
                  isWinner(game?.teamTwo as GameTeamInfo)
                    ? "text-black"
                    : "text-gray-800"
                } transition-colors duration-300`}
              >
                {game?.teamTwoScore}
              </div>
              {isWinner(game?.teamTwo as GameTeamInfo) && (
                <div className="mt-2 text-black font-semibold">WINNER</div>
              )}
            </div> */}
            <TeamInfo
              gameTeamInfo={game?.teamTwo as GameTeamInfo}
              score={game?.teamTwoScore as number}
              winner={game?.gameWinner as GameTeamInfo | null}
            />
          </div>

          {/* Game Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-semibold">
                  {formatDate(game?.gameDate || "")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">Time</div>
                <div className="font-semibold">{game?.gameTime}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-sm text-gray-500">Venue</div>
                <div className="font-semibold">{game?.gameAddress}</div>
              </div>
            </div>
          </div>
          <div className=" flex flex-row justify-center items-center mt-6">
            <UpdateGame game={game as Game} />
          </div>
        </div>

        {/* Additional Stats Card */}
   
        {/* Action Buttons */}
        <div className=" mt-5 rounded-md w-full bg-white p-4 shadow-lg border-2 border-gray-200">
          <h1 className=" font-bold text-xl text-gray-800 mb-4">
            Player Information
          </h1>
          <h3>{game?.teamOne?.teamName}</h3>
          <PlayerScoreTable
            playerRecord={game?.teamOne?.playerRecord as GamePlayer[]}
            game={game as Game}
            gameId={game?.id as string}
            isTeamOne={true}
          />
          <h3>{game?.teamTwo?.teamName}</h3>
          <PlayerScoreTable
            playerRecord={game?.teamTwo?.playerRecord || []}
            game={game as Game}
            gameId={game?.id as string}
            isTeamOne={false}
          />
        </div>
      </div>
    </div>
  )
}
