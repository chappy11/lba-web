"use client";
import {
	Game,
	GameStatus,
	GameTeamInfo,
} from "@/_lib/dto/Game.model";
import {
	CoachInfo,
	Team,
} from "@/_lib/dto/Team.model";
import { GameType } from "@/_lib/enums/GameTypeEnum";
import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import { insertGame } from "@/_lib/services/GameService.service";
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";
import Image from "next/image";

import {
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

export default function CreateGames() {
	const [data, setData] = useState<
		Array<Team>
	>([]);

	const [
		selectedTeam1,
		setSelectedTeam1,
	] = useState<string>("");
	const [
		selectedTeam2,
		setSelectedTeam2,
	] = useState("team2");

	const [date, setDate] =
		useState<string>("");
	const [time, setTime] =
		useState<string>("");

	const [address, setAddress] =
		useState<string>("");
	const sendRequest =
		useCallback(async () => {
			try {
				const resp =
					await getCurrentTeamFromThisSeason();

				setData(resp);
			} catch (error) {
				console.log(error);
			}
		}, []);

	useEffect(() => {
		sendRequest();
	}, []);

	const formatCoachName = (
		coachInfo: CoachInfo
	) => {
		const {
			firstname,
			middlename,
			lastname,
		} = coachInfo;
		return middlename
			? `${firstname} ${middlename} ${lastname}`
			: `${firstname} ${lastname}`;
	};

	// Helper function to format date

	const displayTeamOne = useMemo(() => {
		if (!selectedTeam1) {
			return <div>No data</div>;
		}

		const team1 = data.find(
			(val) => val.id === selectedTeam1
		);
		if (!team1) {
			return <div></div>;
		}

		return (
			<div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-blue-600">
				<div className="p-6">
					<div className="flex items-center space-x-4 mb-6">
						<img
							src={team1.teamLogo}
							alt={team1.teamName}
							className="w-16 h-16 rounded-full object-cover"
						/>
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-900">
								{team1.teamName}
							</h2>
							<p className="text-sm text-blue-600 font-medium flex items-center mt-1">
								<User className="h-4 w-4 mr-1" />
								Coach:{" "}
								{formatCoachName(
									team1.coachInfo
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}, [selectedTeam1]);

	const displayTeamTwo = useMemo(() => {
		if (!selectedTeam2) {
			return <div>No Data</div>;
		}

		const team2 = data.find(
			(val) => val.id === selectedTeam2
		);

		if (!team2) {
			return <div>No data</div>;
		}

		return (
			<div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-red-600">
				<div className="p-6">
					<div className="flex items-center space-x-4 mb-6">
						<img
							src={team2.teamLogo}
							alt={team2.teamName}
							className="w-16 h-16 rounded-full object-cover"
						/>
						<div className="flex-1">
							<h2 className="text-2xl font-bold text-gray-900">
								{team2.teamName}
							</h2>
							<p className="text-sm text-red-600 font-medium flex items-center mt-1">
								<User className="h-4 w-4 mr-1" />
								Coach:{" "}
								{formatCoachName(
									team2.coachInfo
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}, [selectedTeam2]);

	async function handleSubmit() {
		try {
			if (!date) {
				toast.error("Date is required");
				return;
			}

			if (!time) {
				toast.error("Time is required");
				return;
			}

			if (!address) {
				toast.error(
					"Address is required"
				);
			}

			if (!selectedTeam1) {
				toast.error(
					"Team one is required"
				);

				return;
			}

			if (!selectedTeam2) {
				toast.error(
					"Team two is required"
				);
				return;
			}

			const team1 = data.find(
				(val) =>
					val.id === selectedTeam1
			);

			const team2 = data.find(
				(val) =>
					val.id === selectedTeam2
			);
			if (!team1) {
				toast.error(
					"Team one is required"
				);

				return;
			}

			if (!team2) {
				toast.error(
					"Team two is required"
				);

				return;
			}

			const newTeam1: GameTeamInfo = {
				id: team1.id as string,
				teamName: team1.teamName,
				teamLogo: team1.teamLogo,
			};

			const newTeam2: GameTeamInfo = {
				id: team2.id as string,
				teamName: team2.teamName,
				teamLogo: team2.teamLogo,
			};

			const payload: Game = {
				seasonId: "",
				teamOne: newTeam1,
				teamTwo: newTeam2,
				teamOneScore: 0,
				teamTwoScore: 0,
				gameTime: time,
				gameDate: date,
				gameAddress: "",
				gameWinner: null,
				gameStatus: GameStatus.PENDING,
				gameType: GameType.BASKETBALL,
				updatedAt: new Date(),
			};

			const resp = await insertGame(
				payload
			);

			if (resp) {
				toast.success(
					"Succesfully Created"
				);

				setTime("");
				setDate("");
				setSelectedTeam1("");
				setSelectedTeam2("");
				setAddress("");
			}
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className=" w-full p-3">
			<h1 className=" font-semibold">
				Game Schedule
			</h1>
			<div className="grid grid-cols-1 mt-3 md:grid-cols-2 gap-8 mb-8">
				<TextInput
					type="date"
					label="Game Date"
					onChange={(e) =>
						setDate(e.target.value)
					}
					value={date}
				/>
				<TextInput
					type="time"
					label="Game Time"
					onChange={(e) =>
						setTime(e.target.value)
					}
					value={time}
				/>
			</div>
			<TextInput
				label="Address"
				onChange={(e) =>
					setAddress(e.target.value)
				}
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				<div className="bg-white rounded-lg shadow p-6">
					<Select
						onValueChange={(e) =>
							setSelectedTeam1(e)
						}
						value={selectedTeam1}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select position" />
						</SelectTrigger>
						<SelectContent>
							{data.map((val) => {
								return (
									<SelectItem
										key={val.id}
										value={
											val.id as string
										}
										disabled={
											val.id ===
											selectedTeam2
										}
									>
										<Image
											src={val.teamLogo}
											width={20}
											height={20}
											alt="team"
										/>
										{val.teamName}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>

				<div className="bg-white rounded-lg shadow p-6">
					<Select
						onValueChange={(e) =>
							setSelectedTeam2(e)
						}
						value={selectedTeam2}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select position" />
						</SelectTrigger>
						<SelectContent>
							{data.map((val) => {
								return (
									<SelectItem
										key={val.id}
										value={
											val.id as string
										}
										disabled={
											val.id ===
											selectedTeam1
										}
									>
										<Image
											src={val.teamLogo}
											width={20}
											height={20}
											alt="team"
										/>
										{val.teamName}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
				{/* Team 1 */}
				{displayTeamOne}
				{/* Team 2 */}
				{displayTeamTwo}
			</div>
			<div className=" w-full flex justify-end">
				<Button
					onClick={() => handleSubmit()}
				>
					Save
				</Button>
			</div>
		</div>
	);
}
