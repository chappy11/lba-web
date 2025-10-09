"use client"

import { getSession } from "@/app/action"
import { ChevronLeft } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const displayName = (path: string) => {
  if (path === "/dashboardv2") return "Dashboard"
  if (path === "/administrator") return "Administrator"
  if (path === "/administrator/teams") return "Teams"
  if (path === "/administrator/players") return "Players"
  if (path === "/administrator/match-schedule") return "Match Schedule"
  if (path === "/administrator/player-standing") return "Player Standing"
  if (path === "/administrator/season") return "Season"
  if (path === "/administrator/settings") return "Settings"
  if (path === "/administrator/players/view-players") return "Player Info"
  return ""
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const getUser = async () => {
    const resp = await getSession()

    console.log(resp)
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className=" w-full flex h-[100px]  text-neutral-100 fix top-0  relative ">
      <div className=" w-full absolute h-full ">
        <div className="w-[80%] h-full flex items-center mx-auto gap-5">
          <div onClick={() => router.back()} className=" cursor-pointer">
            <ChevronLeft color="white" size={30} />
          </div>
          <p className=" text-xl font-semibold">{displayName(pathname)}</p>
        </div>
      </div>

      <Image
        src={"/banner3.png"}
        objectFit="center"
        alt="Imager"
        width={1920} // original image width
        height={600} // original image height
        // cover the container
        className="w-full h-auto " // full width, keeps aspect ratio
        priority // optional: preloads image
      />
    </div>
  )
}
