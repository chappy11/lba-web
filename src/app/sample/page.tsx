"use client"

import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState } from "react"
const matches = [
  {
    id: "12344",
    done: false,
    matches: [
      {
        team2Score: 0,
        id: "8a070438-7871-469b-9f4c-7ba87ae409ae",
        winner: "TBA",
        team1Score: 0,
        team1Id: "IcNVix35nL4Z2F6cqjQi",
        team2: "Cleveland",
        address: "TBA",
        team1: "Nuggets",
        team2Id: "ziEb9zNe9LDQAkLRCofa",
      },
      {
        address: "TBA",
        winner: "TBA",
        team1Id: "VUNx0uKIC5NkvqMYm66G",
        team2Score: 0,
        team1: "Lakers",
        id: "8344f5e6-2e57-46f1-a5f2-8ce151b86422",
        team1Score: 0,
        team2: "Chicago Bulls",
        team2Id: "fnz5PrfJeOisrfrWE7OA",
      },
    ],
    round: 1,
  },
  {
    round: 2,
    matches: [
      {
        team2: "Cleveland",
        address: "TBA",
        team1: "Clippers",
        winner: "TBA",
        team1Id: "HsmCeT1jSd0TKy5hzLZf",
        team2Score: 0,
        team2Id: "ziEb9zNe9LDQAkLRCofa",
        id: "cdc4f20d-bafb-4535-98c3-a90d0d56e914",
        team1Score: 0,
      },
      {
        id: "4d34701a-963c-4f2c-bce5-62ee03edeb51",
        team2Score: 0,
        team1: "Nuggets",
        team1Score: 0,
        team2: "Lakers",
        team2Id: "VUNx0uKIC5NkvqMYm66G",
        address: "TBA",
        team1Id: "IcNVix35nL4Z2F6cqjQi",
        winner: "TBA",
      },
    ],
  },
  {
    round: 3,
    matches: [
      {
        team1Score: 0,
        address: "TBA",
        team2: "Chicago Bulls",
        team1: "Clippers",
        team2Id: "fnz5PrfJeOisrfrWE7OA",
        id: "fa75fe63-efa2-4495-8aa4-729401a9d2f6",
        winner: "TBA",
        team2Score: 0,
        team1Id: "HsmCeT1jSd0TKy5hzLZf",
      },
      {
        address: "TBA",
        winner: "TBA",
        team2: "Lakers",
        team2Score: 0,
        team1Id: "ziEb9zNe9LDQAkLRCofa",
        team1Score: 0,
        id: "c052577b-2042-48e7-a98a-01289b0e4833",
        team1: "Cleveland",
        team2Id: "VUNx0uKIC5NkvqMYm66G",
      },
    ],
  },
  {
    round: 4,
    matches: [
      {
        team1Id: "HsmCeT1jSd0TKy5hzLZf",
        winner: "TBA",
        team1: "Clippers",
        team2Id: "VUNx0uKIC5NkvqMYm66G",
        id: "a8d92693-219f-4823-8f04-01ea0dfff071",
        team2: "Lakers",
        address: "TBA",
        team2Score: 0,
        team1Score: 0,
      },
      {
        team1Score: 0,
        address: "TBA",
        team2Id: "IcNVix35nL4Z2F6cqjQi",
        team2Score: 0,
        team1: "Chicago Bulls",
        team2: "Nuggets",
        winner: "TBA",
        team1Id: "fnz5PrfJeOisrfrWE7OA",
        id: "e85913a1-6250-4ee2-a751-40be58d9d7f9",
      },
    ],
  },
  {
    matches: [
      {
        team1Id: "HsmCeT1jSd0TKy5hzLZf",
        team1: "Clippers",
        team2: "Nuggets",
        id: "89f55deb-09a0-4f2f-b8a2-9fcdfe5312dd",
        team2Id: "IcNVix35nL4Z2F6cqjQi",
        team1Score: 0,
        address: "TBA",
        team2Score: 0,
        winner: "TBA",
      },
      {
        team1Id: "fnz5PrfJeOisrfrWE7OA",
        team2Id: "ziEb9zNe9LDQAkLRCofa",
        team2: "Cleveland",
        winner: "TBA",
        team1: "Chicago Bulls",
        team2Score: 0,
        id: "23a612b2-9ec2-4e35-a8e0-caeccff8a5ab",
        address: "TBA",
        team1Score: 0,
      },
    ],
    round: 5,
  },
]

export default function Sample() {
  const [data, setData] = useState<any[]>(matches)

  const handleUpdate = useCallback(() => {
    const chooseRound = 2
    const matchUpdate = {
      team2Score: 28,
      id: "8a070438-7871-469b-9f4c-7ba87ae409ae",
      winner: "IcNVix35nL4Z2F6cqjQi",
      team1Score: 32,
      team1Id: "IcNVix35nL4Z2F6cqjQi",
      team2: "Cleveland",
      address: "TBA",
      team1: "Nuggets",
      team2Id: "ziEb9zNe9LDQAkLRCofa",
    }

    const findRoundIndex = data.findIndex(
      (round) => chooseRound === round.round
    )
    if (findRoundIndex !== -1) {
      const findMatchIndex = data[findRoundIndex].matches.findIndex(
        (match) => match.id === matchUpdate.id
      )

      if (findMatchIndex !== -1) {
        const updatedMatches = [...data]
        updatedMatches[findRoundIndex].matches[findMatchIndex] = matchUpdate
        setData(updatedMatches)
      } else {
        console.error("Match not found")
      }
    } else {
      console.error("Round not found")
    }
  }, [data])

  useEffect(() => {
    // Simulate fetching data from an API
    console.log("DATA", JSON.stringify(data, null, 2))
  }, [handleUpdate])

  return <Button onClick={() => handleUpdate()}>Update</Button>
}
