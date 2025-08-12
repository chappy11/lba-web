"use client";

import {
	MatchTeam,
	SeasonGames,
} from "@/_lib/dto/MatchSchedule";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import TextInput from "./textinput";
import { Button } from "./ui/button";
import { updateMatchSchedule } from "@/_lib/server/matchSchedule";

type Props = {
	data: MatchTeam;
	id: string;
	games: SeasonGames;
};

export default function MatchCard(
	props: Props
) {
	const {
		data,
		games,
		id: firebaseId,
	} = props;
	const {
		team1,
		team2,
		team1Score,
		team2Score,
		id,
		address,
		team1Id,
		team2Id,
		gameDate,
		gameTime,
	} = data;
	const { matchSchedule } = games;
	const team1ScoreText =
		team1Score > 0
			? team1Score.toString()
			: "TBA";
	const team2ScoreText =
		team2Score > 0
			? team2Score.toString()
			: "TBA";
	const [
		teamOneScore,
		setTeamOneScore,
	] = useState<string>(
		team1Score.toString()
	);
	const [
		teamTwoScore,
		setTeamTwoScore,
	] = useState<string>(
		team2Score.toString()
	);

	const [isLoading, setIsLoading] =
		useState<boolean>(false);
	const [matchDate, setMatchDate] =
		useState<string>(gameDate || "TBA");
	const [matchTime, setMatchTime] =
		useState<string>(gameTime || "TBA");
	const [gameAddress, setGameAddress] =
		useState<string>(address);

	// async function handleUpdate(round: number) {
	//   const chooseRound = 2
	//   const matchUpdate = {
	//     team2Score: 28,
	//     id: "8a070438-7871-469b-9f4c-7ba87ae409ae",
	//     winner: "IcNVix35nL4Z2F6cqjQi",
	//     team1Score: 32,
	//     team1Id: "IcNVix35nL4Z2F6cqjQi",
	//     team2: "Cleveland",
	//     address: "TBA",
	//     team1: "Nuggets",
	//     team2Id: "ziEb9zNe9LDQAkLRCofa",
	//   }

	//   const findRoundIndex = data.findIndex(
	//     (round) => chooseRound === round.round
	//   )
	//   if (findRoundIndex !== -1) {
	//     const findMatchIndex = data[findRoundIndex].matches.findIndex(
	//       (match) => match.id === matchUpdate.id
	//     )

	//     if (findMatchIndex !== -1) {
	//       const updatedMatches = [...data]
	//       updatedMatches[findRoundIndex].matches[findMatchIndex] = matchUpdate
	//       setData(updatedMatches)
	//     } else {
	//       console.error("Match not found")
	//     }
	//   } else {
	//     console.error("Round not found")
	//   }
	// }

	async function updateMatch() {
		const updatedMatch: MatchTeam = {
			...data,
			team1Score: parseInt(
				teamOneScore,
				10
			),
			team2Score: parseInt(
				teamTwoScore,
				10
			),
			address: gameAddress,
			winner:
				parseInt(teamOneScore, 10) >
				parseInt(teamTwoScore, 10)
					? team1Id
					: team2Id,
			gameDate: matchDate,
			gameTime: matchTime,
		};
		const updatedData = {
			...games,
			matchSchedule:
				games.matchSchedule.map(
					(round) => ({
						...round,
						matches: round.matches.map(
							(match) =>
								match.id === id
									? updatedMatch
									: match
						),
					})
				),
		};

		return updatedData;
	}

	async function handleUpdate() {
		try {
			const updatedData =
				await updateMatch();

			const resp =
				await updateMatchSchedule(
					updatedData
				);

			return resp.data;
		} catch (error) { 
			console.error(
				"Error updating match:",
				error
			);
		}
	}
	return (
		<Sheet>
			<SheetTrigger>
				<div
					className=" border border-gray-200  rounded-md flex flex-col w-[200px] hover:cursor-pointer"
					onClick={() =>
						console.log(
							JSON.stringify(
								props,
								null,
								2
							)
						)
					}
				>
					<div className="flex items-center p-2 flex-row justify-between">
						<p>{team1}</p>
						<p>{team1ScoreText}</p>
					</div>
					<div className=" border border-gray-200 w-full" />
					<div className="flex items-center p-2 flex-row justify-between">
						<p>{team2}</p>
						<p>{team2ScoreText}</p>
					</div>
				</div>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>
						Match Details
					</SheetTitle>
					<SheetDescription>
						{team1} VS {team2}
					</SheetDescription>
				</SheetHeader>
				<div className=" p-2">
					<TextInput
						label="Game Address"
						type="text"
						value={gameAddress}
						onChange={(e) =>
							setGameAddress(
								e.target.value
							)
						}
					/>
					<TextInput
						label="Game Date"
						type="date"
						value={matchDate}
						onChange={(e) =>
							setMatchDate(
								e.target.value
							)
						}
					/>
					<TextInput
						label="Game Time"
						type="time"
						value={matchTime}
						onChange={(e) =>
							setMatchTime(
								e.target.value
							)
						}
					/>
					<TextInput
						label={team1 + " Score"}
						type="number"
						value={teamOneScore}
						onChange={(e) =>
							setTeamOneScore(
								e.target.value
							)
						}
					/>
					<TextInput
						label={team2 + " Score"}
						type="number"
						value={teamTwoScore}
						onChange={(e) =>
							setTeamTwoScore(
								e.target.value
							)
						}
					/>
					<Button
						onClick={() =>
							handleUpdate()
						}
					>
						{isLoading ? (
							<span>Loading...</span>
						) : (
							"Update"
						)}
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
