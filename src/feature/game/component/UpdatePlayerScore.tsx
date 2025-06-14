"use client";

import {
	Game,
	UpdateGamePayload,
} from "@/_lib/dto/Game.model";
import { GamePlayer } from "@/_lib/dto/GamePlayer.model";
import { updateGameId } from "@/_lib/server/game";
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

type Props = GamePlayer & {
	gameId: string;
	isTeamOne: boolean;
	game: Game;
};

export default function UpdatePlayerScore(
	props: Props
) {
	const {
		playerId,
		firstname,
		middlename,
		lastname,
		points,
		rebound,
		assist,
		threepoints,
		isTeamOne,
		foul,
		game,
		gameId,
	} = props;

	const [
		currentPoints,
		setCurrentPoints,
	] = useState(points);
	const [
		currentRebound,
		setCurrentRebound,
	] = useState(rebound);
	const [
		currentAssist,
		setCurrentAssist,
	] = useState(assist);
	const [
		currentThreePoints,
		setCurrentThreePoints,
	] = useState(threepoints);
	const [currentFoul, setCurrentFoul] =
		useState(foul);

	async function handleSubmit() {
		try {
			if (isTeamOne) {
				const tempPlayerData =
					game.teamOne.playerRecord.filter(
						(val) =>
							val.playerId !== playerId
					);

				const newData: GamePlayer[] = [
					...tempPlayerData,
					{
						playerId,
						firstname,
						middlename,
						lastname,
						foul: currentFoul,
						rebound: currentRebound,
						threepoints: currentPoints,
						assist: currentAssist,
						points: currentPoints,
					},
				];

				const payload: UpdateGamePayload =
					{
						...game,
						teamOne: {
							...game.teamOne,
							playerRecord: newData,
						},
					};

				await updateData(payload);

				return;
			}

			const tempPlayerDataTwo =
				game.teamTwo.playerRecord.filter(
					(val) =>
						val.playerId !== playerId
				);

			const newPlayerDataTwo = [
				...tempPlayerDataTwo,
				{
					playerId,
					firstname,
					middlename,
					lastname,
					foul: currentFoul,
					rebound: currentRebound,
					threepoints: currentPoints,
					assist: currentAssist,
					points: currentPoints,
				},
			];

			const payload2: UpdateGamePayload =
				{
					...game,
					teamOne: {
						...game.teamOne,
						playerRecord:
							newPlayerDataTwo,
					},
				};

			await updateData(payload2);
		} catch (error) {
			console.log(error);
		}
	}

	async function updateData(
		payload: UpdateGamePayload
	) {
		try {
			const resp = await updateGameId(
				gameId,
				payload
			);

			if (resp) {
				toast.success(
					"Successfully Updated"
				);
			}
		} catch (error) {
			console.log(error)
			toast.error(
				"Something went wrong"
			);
		}
	}
	return (
		<Dialog>
			<DialogTrigger>
				Update
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className=" border-b-1 border-gray-300 p-3">
					<DialogTitle>
						Update Player Score
					</DialogTitle>
				</DialogHeader>
				<div>
					<h1>
						{firstname} {middlename}{" "}
						{lastname}
					</h1>
					<Label>Rebound</Label>
					<TextInput
						className=" text-right mt-2"
						value={currentRebound}
						type="number"
						onChange={(e) =>
							setCurrentRebound(
								Number(e.target.value)
							)
						}
					/>
					<Label>Assist</Label>
					<TextInput
						className=" text-right mt-2"
						value={currentAssist}
						type="number"
						onChange={(e) =>
							setCurrentAssist(
								Number(e.target.value)
							)
						}
					/>
					<Label>Three Points</Label>
					<TextInput
						className=" text-right mt-2"
						value={currentThreePoints}
						type="number"
						onChange={(e) =>
							setCurrentThreePoints(
								Number(e.target.value)
							)
						}
					/>

					<Label>Points</Label>
					<TextInput
						className=" text-right mt-5"
						value={currentPoints}
						type="number"
						onChange={(e) =>
							setCurrentPoints(
								Number(e.target.value)
							)
						}
					/>
					<Label>Foul</Label>
					<TextInput
						className=" text-right mt-5"
						value={currentFoul}
						type="number"
						onChange={(e) =>
							setCurrentFoul(
								Number(e.target.value)
							)
						}
					/>
				</div>
				<DialogFooter>
					<Button
						onClick={() =>
							handleSubmit()
						}
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
