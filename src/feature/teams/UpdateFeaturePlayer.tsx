"use client"

import { Player } from "@/_lib/dto/Player.model"
import { getPlayerByTeams } from "@/_lib/server/player"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star } from "lucide-react"

import { useEffect, useState } from "react"



type Props = {
    teamId: string;
}

export default function UpdateFeaturePlayer(props:Props) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { teamId } = props;
    const [players, setPlayers] = useState<Player[]>([])
    const [imageUlr,setImage] = useState<string>('')

    async function fetchPlayer() {
        try {
            const resp = await getPlayerByTeams(teamId)

            setPlayers(resp)


        } catch (error) {
            console.log("Error fetching players", error)
        }
    }

    useEffect(() => {
        fetchPlayer();
    },[])
  
    return (
      <Dialog>
        <DialogTrigger> <Star color="orange"/></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Feature Player</DialogTitle>
            <DialogDescription>
             
            </DialogDescription>
            
                </DialogHeader>
                <div className=" flex flex-row flex-wrap gap-3">
                    <div>
                        
                    </div>
                </div>
        </DialogContent>
      </Dialog>
    )
}