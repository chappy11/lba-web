"use client"

import { Player } from "@/_lib/dto/Player.model";
import { CreatePlayerPlayload, PlayerMvp } from "@/_lib/dto/PlayerMvp.model";
import { getPlayerByTeams } from "@/_lib/server/player";
import { addMvpPlayer, getGameMvp } from "@/_lib/server/playermvp";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

type Props = {
    teamId: string;
    selectedPlayer: Player | null;
  setSelectedPlayer?: (player: Player) => void;
  gameId: string;
}

export default function UpdateMvpOfTheGame(props:Props) {
    const {gameId,teamId,selectedPlayer,setSelectedPlayer}= props;
    const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mvpPlayer, setMvpPlayer] = useState<PlayerMvp | null>(null);
  const [buttonLoading,setButtonLoading] = useState<boolean>(false)
    


    const fetchPlayers = async () => {
        try {
          setIsLoading(true)
          
          const mvpResponse = await getGameMvp(gameId);

          if (!mvpResponse) {
             const response = await getPlayerByTeams(teamId)
    
             setPlayers(response)
            return;
          }

          setMvpPlayer(mvpResponse)

        } catch (error) {
            console.log("Error",error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPlayers();
    }, [])
    

    const displayData = useMemo(() => {
        if (isLoading) {
            return "Loading..."
        }
        if (!selectedPlayer) {
            return "Select MVP"
        }
        
        return selectedPlayer.jerseyNumber+ ' '+ selectedPlayer.firstname + " " + selectedPlayer.lastname
    }, [isLoading, selectedPlayer])
  
  const displayMvp = useMemo(() => {
    if(!mvpPlayer) {
      return
    }

    return (
      <div className=" w-full flex flex-col gap-5">
        <h1 className=" text-lg font-semibold">MVP of the Game</h1>
        <div className=" flex flex-row w-full gap-5">
          <div className=" ">
            <Image
              className=" rounded-[100%] w-[100px] h-[100px]"
              src={mvpPlayer.playerImage}
              width={100}
              height={100}
              alt="Player MVP"
            />
          </div>
          <div className=" flex flex-col flex flex-row items-center">
            <p>
              {mvpPlayer.firstname.toUpperCase() +
                " " +
                mvpPlayer.middlename.toUpperCase() +
                " " +
                mvpPlayer.lastname.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    )
  }, [mvpPlayer])
  
  async function handleSetMvp() {
    setButtonLoading(true)
    if (!selectedPlayer) {
      return
    }
    try {
       const payload: CreatePlayerPlayload = {
         ...selectedPlayer,
         gameId: gameId,
         playerId: selectedPlayer.id || "",
         teamId: teamId,
       }
      
      const resposne = await addMvpPlayer(payload)

      if (resposne) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'MVP has been set successfully.',
        }).then((result) => {
          window.location.reload()
        })
      }
    } catch (error) {
      console.log("Error", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to set MVP. Please try again.',
      })
    }
    finally {
      setButtonLoading(false)
    }
  
   
    // Call your API to set the MVP here
  
  
  }


    return (
      <div className=" w-full">
        {displayMvp}

        {!mvpPlayer && (
          <div className=" w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className=" w-full text-left px-3 py-2  border border-gray-200 rounded-md">
                {displayData}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {selectedPlayer &&
                    `${selectedPlayer.firstname} ${selectedPlayer.lastname}`.toUpperCase()}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {players.map((player) => (
                  <DropdownMenuItem
                    key={player.id}
                    onSelect={() => {
                      setSelectedPlayer?.(player)
                      console.log("Selected Player:", player)
                    }}
                  >
                    {player.jerseyNumber} {player.firstname} {player.lastname}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className=" h-3" />
            <Button disabled={buttonLoading} onClick={() => handleSetMvp()}>
              Set Mvp
            </Button>
          </div>
        )}
      </div>
    )
}