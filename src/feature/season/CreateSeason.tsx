"use client";
import { SeasonInsertPayload } from "@/_lib/dto/Season.model";
import { GameType } from "@/_lib/enums/GameTypeEnum";
import { createSeason } from "@/_lib/server/season";
import { uploadImage } from "@/_lib/server/upload";
import Header from "@/components/header";
import TextInput from "@/components/textinput";
import { Button } from "@/components/ui/button";
import {
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";

export default function CreateSeason() {
	const [image, setImage] =
		useState<File | null>(null);
	const [seasonName, setSeasonName] =
		useState<string>("");
	const [seasonMotto, setSeasonMotto] =
		useState<string>("");
	const [
		seasonStartDate,
		setSeasonStartDate,
	] = useState<string>("");
	const [
		seasonEndDate,
		setSeasonEndDate,
	] = useState<string>("");
	const [gameType, setGameType] =
		useState<string>("");

	const displayImage = useMemo(() => {
		if (!image) {
			return (
				<div className=" h-[100px] w-[100px] bg-gray-500 rounded-full" />
			);
		}
		const imagePath =
			URL.createObjectURL(image);

		return (
			<img
				src={imagePath}
				height={100}
				width={100}
				alt="season photo"
			/>
		);
	}, [image]);

	async function handleSubmit() {
		try {
			if (!image) {
				toast.error(
					"Please upload a season logo"
				);
				return;
			}

			if (!seasonName) {
				toast.error(
					"Please enter a season name"
				);
				return;
			}
			if (!seasonMotto) {
				toast.error(
					"Please enter a season motto"
				);
				return;
			}
			if (!seasonStartDate) {
				toast.error(
					"Please enter a season start date"
				);
				return;
			}
			if (!seasonEndDate) {
				toast.error(
					"Please enter a season end date"
				);
				return;
			}

			if (
				new Date(seasonStartDate) >
				new Date(seasonEndDate)
			) {
				toast.error(
					"Season start date cannot be after end date"
				);
				return;
			}
			const formData = new FormData();
			formData.append("file", image);

			const responseImage =
				await uploadImage(formData);

			const imagePath =
				responseImage?.url;
			if (!imagePath) {
				toast.error(
					"Failed to upload image"
				);
				return;
			}

			const payload: SeasonInsertPayload =
				{
					seasonName: seasonName,
					isActiveSeason: 1,
					seasonStartDate,
					seasonEndDate,
					dateCreated:
						new Date().toISOString(),
					gameType: GameType.BASKETBALL,
					seasonLogo: imagePath,
					gameWinner: null,
					mvpOfTheSeason: null,
					seasonMotto,
				};

			const resp = await createSeason(
				payload
			);

			if (resp) {
				toast.success(
					"Season created successfully"
				);
				setImage(null);
				setSeasonName("");
				setSeasonMotto("");
				setSeasonStartDate("");
				setSeasonEndDate("");
				setGameType("");
				return;
			}

			toast.error(
				"Failed to create season"
			);
		} catch (error) {
			console.log("test", error);
			toast.error(
				"Failed to create season"
			);
		}
	}

	return (
		<div className=" w-[50%] mt-10 mx-auto shadow-xl rounded-md">
			<Header title="Create Season" />
			<div className=" flex flex-1 flex-row mt-5 px-3 pb-3">
				<div className="  w-[300px] flex flex-col mt-3   items-center gap-2">
					{displayImage}
					<TextInput
						type="file"
						className=" mx-auto w-[50%]"
						onChange={(e) =>
							setImage(
								e?.target
									?.files?.[0] as File
							)
						}
					/>
				</div>
				<div className=" flex flex-1 flex-col gap-2 px-3">
					<TextInput
						label="Season Name"
						placeholder="Enter season name..."
						onChange={(e) =>
							setSeasonName(
								e.target.value
							)
						}
					/>
					<TextInput
						label="Description"
						placeholder="Enter short description..."
						onChange={(e) =>
							setSeasonMotto(
								e.target.value
							)
						}
					/>
					<TextInput
						type="date"
						label="Season Start Date"
						value={seasonStartDate}
						onChange={(e) =>
							setSeasonStartDate(
								e.target.value
							)
						}
						placeholder=" Enter the season name"
					/>
					<TextInput
						type="date"
						label="Season Season End Date"
						value={seasonEndDate}
						onChange={(e) =>
							setSeasonEndDate(
								e.target.value
							)
						}
						placeholder=" Enter the season name"
					/>
					<div className=" w-full flex flex-row justify-end">
						<Button
							className=" w-[150px]"
							onClick={() =>
								handleSubmit()
							}
						>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
