import { Game } from "@/_lib/dto/Game.model";
import Image from "next/image";

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
				className=" shadow p-3 w-full flex flex-row  rounded-md my-2"
			>
				<div className=" flex flex-1  gap-5">
					<div className=" flex justify-center items-center">
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

				<div className=" flex flex-1 flex-col justify-center items-center">
					<p className=" text-2xl text-center">
						VS
					</p>
					<p className=" text-center">
						{val.gameDate}{" "}
						{val.gameTime}
					</p>
					<p>{val.gameAddress}</p>
				</div>
				<div className="  flex items-center justify-center  ">
					<p className=" text-3xl font-bold">
						{val.teamTwoScore}
					</p>
				</div>

				<div className=" flex flex-row-reverse flex-1 gap-5 ">
					<div className=" flex  gap-3 justify-center items-center flex-row-reverse">
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
