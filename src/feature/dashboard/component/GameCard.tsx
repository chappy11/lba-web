import { Game } from "@/_lib/dto/Game.model";
import { DateFormatEnum } from "@/_lib/enums/DateFormatEnum.enum";
import { formatDate } from "@/_lib/utils/date.utils";
import Image from "next/image";

type Props = {
	data: Game;
};

export default function GameCard(
	props: Props
) {
	const {
		teamOne,
		gameDate,
		gameTime,
		teamTwo,
	} = props.data;
	return (
    <div className="  border border-gray-700 h-[150px] px-5 text-white rounded-lg flex flex-row">
      <div className=" flex flex-row gap-4 items-center flex-1">
        <Image
          src={teamOne.teamLogo}
          width={100}
          height={100}
          className=" rounded-full"
          alt={teamOne.teamName}
        />
        <h3 className=" text-xl font-semibold">{teamOne.teamName}</h3>
      </div>
      <div className=" flex flex-col justify-evenly flex-1  items-center">
        <h4 className=" bg-amber-800 text-white text-xs px-4 rounded-lg">
          Upcoming Games
        </h4>
        <h2 className=" text-xl font-semibold">VS</h2>
        <span className=" text-sm">
          {formatDate(gameDate, DateFormatEnum.FORMAT_USER)}
        </span>
      </div>
      <div className=" flex flex-row-reverse  justify-start gap-4  items-center flex-1">
        <Image
          src={teamTwo.teamLogo}
          width={100}
          height={100}
          className=" rounded-full"
          alt={teamTwo.teamName}
        />
        <h3 className=" text-xl font-semibold">{teamTwo.teamName}</h3>
      </div>
    </div>
  )
}
