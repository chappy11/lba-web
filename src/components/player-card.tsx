import { Player, PlayerWithTeam } from "@/_lib/dto/Player.model";
import UpdateFeaturePlayer from "@/feature/teams/UpdateFeaturePlayer"
import Image from "next/image";

type Props = {
    player:Player | PlayerWithTeam
}

export default function PlayerCard(props:Props) {
    const { player } = props;
    
    const displayTeam = () => {
        const team = (player as PlayerWithTeam).team;

        if (team) {
            return <p className=" text-sm">{team.teamName}</p>;
        }

        return <></>;
    }
   
  
    return (
      <div className=" w-[250px] bg-white shadow-md rounded-md relative">
        <div className=" absolute top-15 right-2 text-xs p-2 rounded-full bg-orange-200">
          {player.position}
        </div>
        <div className=" absolute top-2 right-2 text-xs p-2 rounded-full bg-orange-200">
          {player.jerseyNumber}
        </div>
        <div className=" h-[300px]">
          <Image
            src={player.playerImage}
            width={300}
            height={300}
            alt="player"
            className=" rounded-md"
          />
        </div>

        <div className=" mt-3 p-3 flex flex-row justify-between items-center">
          <p>
            {player.firstname.toUpperCase() +
              " " +
              player.lastname.toUpperCase()}
          </p>

          <UpdateFeaturePlayer teamId={player.teamId} />
        </div>
      </div>
    )
}