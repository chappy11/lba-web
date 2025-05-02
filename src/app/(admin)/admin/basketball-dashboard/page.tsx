import { Season } from "@/_lib/dto/Season.model"
import { getCurrentSeason } from "@/_lib/server/season"
import Image from "next/image"
import Link from "next/link"

export default async function Pages() {
  const resp: Season = await getCurrentSeason()
  return (
    <div className=" text-neutral-100 flex-1">
      <p className=" font-[700]">Current Season</p>
      <div className=" flex mt-3 flex-row gap-3 items-center">
        <Image
          src={resp.seasonLogo}
          width={100}
          alt="alt logo"
          height={100}
          className=" rounded-full h-[100px] w-[100px]"
        />

        <p className=" text-neutral-100 text-2xl font-bold">
          {resp.seasonName}
        </p>
      </div>
      <div className=" w-full bg-neutral-950 mt-3 rounded-md p-3">
        <div className=" flex flex-row justify-between items-center">
          <p className=" font-bold">Teams</p>
          <Link
            href={"/admin/basketball-teams-management"}
            className=" px-3 py-2 bg-amber-600 rounded-md"
          >
            Manage Teams
          </Link>
        </div>
        <div className=" flex-row"></div>
      </div>
    </div>
  )
}
