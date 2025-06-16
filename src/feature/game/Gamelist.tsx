import { Game } from "@/_lib/dto/Game.model";
import { DateFormatEnum } from "@/_lib/enums/DateFormatEnum.enum";
import {
	formatDate,
	isDateBefore,
} from "@/_lib/utils/date.utils";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
	data: Array<Game>;
};

export default function GameList(
	props: Props
) {
	const { data } = props;

	return data.map((val: Game) => {
		return (
			<div
				key={val.id}
				className=" shadow-md p-3 w-full flex flex-row  rounded-md my-5"
			>
				<div className=" flex flex-1  gap-5">
					<div className=" flex justify-center items-center relative">
						{val.gameWinner?.id ===
							val.teamOne.id && (
							<div className=" absolute right-3 top-0 flex flex-row bg-orange-400 px-3 rounded-4xl py-1">
								<Crown
									color="yellow"
									fill="orange"
									size={20}
								/>
								<p className=" text-sm text-white">
									Winner
								</p>
							</div>
						)}
						<Image
							src={val.teamOne.teamLogo}
							width={100}
							height={100}
							alt="team logo"
						/>
						<p className=" text-xl font-semibold">
							{val.teamOne.teamName}
						</p>
					</div>
				</div>
				<div className="  flex items-center justify-center  ">
					<p className=" text-3xl font-bold">
						{val.teamOneScore}
					</p>
				</div>

				<div className=" flex flex-1 flex-col gap-3 justify-center items-center">
					{!isDateBefore(
						val.gameDate
					) && (
						<p className=" text-xs py-1 px-3 rounded-xl bg-amber-300">
							This game should be done
						</p>
					)}

					<p className=" text-center text-sm text-gray-600">
						{formatDate(
							val.gameDate,
							DateFormatEnum.FORMAT_USER
						)}{" "}
						{val.gameTime}
					</p>
					<p className=" text-xl text-slate-700 text-center font-semibold">
						VS
					</p>
					<Link
						href={`/administrator/game-schedule/update?id=${val.id}`}
						className=" text-blue-500 text-sm"
					>
						View Details
					</Link>
				</div>
				<div className="  flex items-center justify-center  ">
					<p className=" text-3xl font-bold">
						{val.teamTwoScore}
					</p>
				</div>

				<div className=" flex flex-row-reverse flex-1 gap-5 ">
					<div className=" flex  gap-3 justify-center items-center flex-row-reverse relative">
						{val.gameWinner?.id ===
							val.teamTwo.id && (
							<div className=" absolute left-3 top-0 flex flex-row bg-orange-400 px-3 rounded-4xl py-1">
								<Crown
									color="yellow"
									fill="orange"
									size={20}
								/>
								<p className=" text-sm text-white">
									Winner
								</p>
							</div>
						)}
						<Image
							src={val.teamTwo.teamLogo}
							width={100}
							height={100}
							alt="team logo"
						/>
						<p className=" text-xl font-semibold">
							{val.teamTwo.teamName}
						</p>
					</div>
				</div>
			</div>
		);
	});
}
