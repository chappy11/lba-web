"use client";

import { Game, GameStatus, GameTeamInfo } from "@/_lib/dto/Game.model";
import { GameType } from "@/_lib/enums/GameTypeEnum";
import { getGamesById } from "@/_lib/server/game";
import { Calendar, Clock, MapPin, Star, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";


type Props = {
    gameId: string;
}

export default function UpdateGames(props:Props) {
    const { gameId } = props;
    const [game,setGame] = useState<Game | null>(null)
 const [isAnimating, setIsAnimating] = useState(false)
    const sendRequest = async () => { 
        try {
            const resp = await getGamesById(gameId as string)

            setGame(resp as Game)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        sendRequest();
    },[gameId])
   
   useEffect(() => {
     setIsAnimating(true)
     const timer = setTimeout(() => setIsAnimating(false), 1000)
     return () => clearTimeout(timer)
   }, [])

   const getStatusColor = (status: GameStatus) => {
     switch (status) {
       case GameStatus.PENDING:
         return "bg-black animate-pulse"
       case GameStatus.DONE:
         return "bg-gray-800"
       case GameStatus.PENDING:
         return "bg-gray-600"
       case GameStatus.DONE:
         return "bg-gray-400"
       default:
         return "bg-gray-500"
     }
   }

   const getGameTypeIcon = (type: GameType) => {
     switch (type) {
       case GameType.BASKETBALL:
         return <Trophy className="w-5 h-5 text-black" />
       case GameType.BASKETBALL:
         return <Star className="w-5 h-5 text-gray-700" />
       default:
         return <Users className="w-5 h-5 text-gray-600" />
     }
   }

   const formatDate = (dateStr: string) => {
     return new Date(dateStr).toLocaleDateString("en-US", {
       weekday: "long",
       year: "numeric",
       month: "long",
       day: "numeric",
     })
   }

   const isWinner = (team: GameTeamInfo) => {
     return game?.gameWinner === team?.id as string
   }

   return (
     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-6">
       <div className="max-w-4xl mx-auto">
         {/* Header */}
         <div className="text-center mb-8">
           <h1 className="text-4xl font-bold text-black mb-2">
             Basketball Game Center
           </h1>
           <div className="flex items-center justify-center gap-2 text-gray-600">
             {getGameTypeIcon(game?.gameType || GameType.BASKETBALL)}
             <span className="capitalize">{game?.gameType} Game</span>
           </div>
         </div>

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
             <div
               className={`text-center transform transition-all duration-500 ${
                 isAnimating ? "scale-110" : "scale-100"
               } ${
                 isWinner(game?.teamOne as GameTeamInfo)
                   ? "ring-4 ring-black rounded-2xl p-4"
                   : ""
               }`}
             >
               <div className="text-6xl mb-4">{game?.teamOne?.teamName}</div>
               <h2 className="text-2xl font-bold text-black mb-1">
                 {game?.teamOne.teamName}
               </h2>
               <h3 className="text-xl text-gray-600 mb-4">
                 {game?.teamOne.teamName}
               </h3>
               <div
                 className={`text-5xl font-bold ${
                   isWinner(game?.teamOne as GameTeamInfo) ? "text-black" : "text-gray-800"
                 } transition-colors duration-300`}
               >
                 {game?.teamOneScore}
               </div>
               {isWinner(game?.teamOne as GameTeamInfo) && (
                 <div className="mt-2 text-black font-semibold">WINNER</div>
               )}
             </div>

             {/* VS */}
             <div className="text-center">
               <div className="text-3xl font-bold text-gray-600 mb-2">VS</div>
               <div className="w-16 h-1 bg-black mx-auto rounded-full"></div>
             </div>

             {/* Team Two */}
             <div
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
                   isWinner(game?.teamTwo as GameTeamInfo) ? "text-black" : "text-gray-800"
                 } transition-colors duration-300`}
               >
                 {game?.teamTwoScore}
               </div>
               {isWinner(game?.teamTwo as GameTeamInfo) && (
                 <div className="mt-2 text-black font-semibold">WINNER</div>
               )}
             </div>
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
         </div>

         {/* Additional Stats Card */}
         <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-200">
           <h3 className="text-xl font-bold text-black mb-4">
             Game Information
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
             <div>
               <span className="text-gray-500">Season:</span> {game?.seasonId}
             </div>
             <div>
               <span className="text-gray-500">Game Type:</span> {game?.gameType}
             </div>
             <div>
               <span className="text-gray-500">Last Updated:</span>{" "}
               {game?.updatedAt.toLocaleString()}
             </div>
             <div>
               <span className="text-gray-500">Game ID:</span> {game?.id}
             </div>
           </div>
         </div>

         {/* Action Buttons */}
         <div className="flex justify-center gap-4 mt-8">
           <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
             View Details
           </button>
           <button className="bg-white border-2 border-black text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105">
             Share Game
           </button>
         </div>
       </div>
     </div>
   )
}