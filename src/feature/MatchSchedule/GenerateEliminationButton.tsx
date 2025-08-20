"use client"

import { createEliminationMatchSchedule } from "@/_lib/server/matchSchedule";
import { Button } from "@/components/ui/button";

export default function GenerateEliminationButton() { 

    async function handleCraeteEliminationRound() {
        // Logic to create elimination round goes here
      try {
          const resp = await createEliminationMatchSchedule();
          console.log('Elimination Round Created', resp);
      } catch (error) {
        console.log('Error',error)
      }
    }

    return <Button onClick={()=>handleCraeteEliminationRound()}>Generate Elimation Round</Button>
}