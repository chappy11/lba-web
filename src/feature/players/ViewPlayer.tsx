"use client";

import { Player } from "@/_lib/dto/Player.model";
import { PlayerMvp } from "@/_lib/dto/PlayerMvp.model";
import { getPlayerMvpByPlayerId } from "@/_lib/server/playermvp";
import { PositionEnum } from "@/_lib/type/Position.enum";
import InfoCard from "@/components/info-card";
import Image from "next/image";
import { useEffect, useState } from "react";
import GetTeamInfo from "./GetTeamInfo";

type Props = {
  data: Player
}

export default function ViewPlayer(props: Props) {
    const { data } = props
    const [playerMvp, setPlayerMvp] = useState<PlayerMvp[]>([]);

    const fetchData = async () => { 
        try {
            const resp = await getPlayerMvpByPlayerId(data.id as string)
            setPlayerMvp(resp)
        } catch (error) {
            console.log("Error fetching player mvp", error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    

  return (
    <div className=" flex flex-row gap-5">
      <div className=" flex flex-col gap-2">
        <div className=" flex flex-row gap-5 items-center">
          {data?.playerImage && (
            <Image
              src={data.playerImage}
              alt="Player"
              width={200}
              height={200}
            />
          )}
          <div>
            <h1 className=" text-lg font-bold">
              {data.firstname.toUpperCase() +
                " " +
                data.middlename.toUpperCase() +
                " " +
                data.lastname.toUpperCase()}
            </h1>
                      <GetTeamInfo teamId={data.teamId}/>
          </div>
        </div>
        <div className=" mt-3 flex flex-col gap-1 bg-white p-3 rounded-md shadow-md">
          <h1 className=" text-lg font-semibold">Player Info:</h1>
          <div className=" w-[400px] flex flex-row gap-2">
            <div className=" flex flex-col gap-2 flex-1">
              <p>Position</p>
              <p>Jersey No. :</p>
              <p>Age :</p>
              <p>Height :</p>
              <p>Weight :</p>
            </div>
            <div className=" flex flex-col gap-2 flex-1">
              <p>{PositionEnum[data.position]}</p>
              <p>{data.jerseyNumber}</p>
              <p>{data.age}</p>
              <p>{data.height ?? "0"} cm</p>
              <p>{data.weight ?? "0"} kg</p>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex-1 flex flex-col">
        <div className=" h-[150px]" />
        <div>
                  <InfoCard title="No. MVP" value={playerMvp.length.toString()} />
        </div>
      </div>
    </div>
  )
}
