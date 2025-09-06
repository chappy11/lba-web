"use client"

import { MatchResult } from "@/_lib/dto/MatchSchedule"
import { getMatchResuts } from "@/_lib/server/matchSchedule"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"

export default function DisplayMatchResult() {
  const [data, setData] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const sendRequest = useCallback(async () => {
    try {
      const resp = await getMatchResuts()

      setData(resp)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    sendRequest()
  }, [])

  const displayLoading = useMemo(() => {
    if (isLoading) {
      return <div>Loading</div>
    }

    return
  }, [isLoading])

  return (
    <div className=" flex flex-1 flex-col h-full overflow-y-scroll">
      {displayLoading}
      {data.map((val: MatchResult, index: number) => {
        return (
          <div
            className=" flex flex-col rounded-sm p-3 border border-gray-300 my-2"
            key={val.id}
          >
            <div className="  flex flex-row">
              <div className=" flex flex-row justify-between w-full items-center">
                <div className=" flex flex-row items-center gap-3">
                  <Image
                    src={val.team1Logo}
                    alt="team 1"
                    width={50}
                    height={50}
                  />
                  <h1
                    className={` ${
                      val.winner === val.team1Id
                        ? " text-lg font-bold"
                        : " text-md"
                    } `}
                  >
                    {val.team1}
                  </h1>
                </div>
                <div className=" flex flex-row items-center gap-3">
                  <p>{val.team1Score}</p>
                  <p className=" text-green-500">
                    {val.winner === val.team1Id ? "W" : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className=" flex flex-1 justify-center items-center my-2">
              <h1 className=" text-xl ">VS</h1>
            </div>
            <div className="  flex flex-row-reverse">
              <div className=" flex flex-row-reverse justify-between w-full items-center">
                <div className=" flex flex-row-reverse items-center gap-3">
                  <Image
                    src={val.team2Logo}
                    alt="team 1"
                    width={50}
                    height={50}
                  />
                  <h1
                    className={` ${
                      val.winner === val.team2Id
                        ? " text-lg font-bold"
                        : " text-md"
                    } `}
                  >
                    {val.team2}
                  </h1>
                </div>
                <div className=" flex flex-row items-center gap-3">
                  <p>{val.team2Score}</p>
                  <p className=" text-green-500">
                    {val.winner === val.team2Id ? "W" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
