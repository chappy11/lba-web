import { Player } from "@/_lib/dto/Player.model";
import { Team } from "@/_lib/dto/Team.model";
import { getPlayerByTeams } from "@/_lib/server/player";
import PlayerCard from "@/components/player-card"
import Image from "next/image";
import {
	useEffect,
	useState,
} from "react";
import { CreatePlayer } from "../players/CreatePlayer";

type Props = {
	data: Team;
};

export const TeamProfile = (
	props: Props
) => {
	const {
		teamLogo,
		teamName,
		coachInfo,
		id,
	} = props.data;
	const {
		firstname,
		middlename,
		lastname,
	} = coachInfo;
	const [data, setData] = useState<
		Array<Player>
	>([]);

	const sendRequest = async () => {
		try {
			const resp =
				await getPlayerByTeams(
					id as string
				);

			setData(resp);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		sendRequest();
	}, []);

	return (
    <div className=" flex-1">
      <div className=" w-full mx-auto ">
        <div className=" p-3 w-full flex  flex-row items-center flex-col bg-slate-100 gap-5">
          <Image
            className=" rounded-full"
            src={teamLogo}
            width={100}
            height={100}
            alt="Team Logo"
          />
          <div className=" flex flex-col">
            <h1 className=" font-bold text-[24px]">{teamName}</h1>
            <h3>
              Coach: {firstname} {middlename} {lastname}
            </h3>
          </div>
        </div>
        <div className=" w-full px-3 py-2 flex flex-row itesm-center justify-between ">
          <h1 className=" font-bold text-[18px]">Players</h1>
          <CreatePlayer teamId={id as string} />
          
        </div>
        <div className=" flex flex-row flex-wrap gap-2 mt-3">
          {data.map((item: Player) => {
            return (
              // <div
              // 	key={item.id}
              // 	className=" flex items-center rounded-md p-3 shadow-lg bg-white flex-row gap-3"
              // >
              // 	<div className=" p-2 rounded-full bg-amber-500 text-white w-[50px] h-[50px] flex items-center justify-center">
              // 		<p>
              // 			{item.jerseyNumber}
              // 		</p>
              // 	</div>
              // 	<div>
              // 		<p className="  text-[16px]">
              // 			{item.firstname}{" "}
              // 			{item.middlename}{" "}
              // 			{item.lastname}
              // 		</p>
              // 		<p className=" text-[14px] text-gray-600">
              // 			{item.position}
              // 		</p>
              // 	</div>
              // </div>
              <PlayerCard player={item} key={item.id as string} />

            )
          })}
        </div>
      </div>
    </div>
  )
};
