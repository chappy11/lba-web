import { Season } from "@/_lib/dto/Season.model"
import { getSeasons } from "@/_lib/server/season"
import AdminDashboard from "@/feature/admin/AdminDashboard"
import Image from "next/image"
import Link from "next/link"

export default async function Page() {
  const seasons = (await getSeasons()) as Season[]
  if (seasons.length < 1) {
    return (
      <div className=" h-[50px] w-full flex flex-col justify-center items-center">
        <p> No season found, please create a season first.</p>
        <Link href={"/administrator/season"}>Create New Season</Link>
      </div>
    )
  }

  const findActiveSeason = seasons.find((season) => season.isActiveSeason == 1)

  if (!findActiveSeason) {
    return (
      <div className=" h-[50px] w-full flex flex-col justify-center items-center">
        <p> No active season found, please set an active season first.</p>
        <Link href={"/administrator/season"}>Set Active Season</Link>
      </div>
    )
  }
  return (
    <div className=" w-full h-screen flex flex-col justify-center items-center ">
      <div className=" flex flex-row  mx-auto  gap-20 justify-center items-center">
        <div className=" flex  justify-end items-center">
          <Image
            src={findActiveSeason.seasonLogo}
            width={100}
            height={100}
            alt="Season logo"
            className=" rounded-full"
          />
        </div>
        <div className=" flex  justify-start  flex-col">
          <h1 className=" text-2xl font-semibold">
            {findActiveSeason.seasonName}
          </h1>
          <h2>{findActiveSeason.seasonMotto}</h2>
        </div>
      </div>

      <div className=" mt-5">
        <Link
          href={"/administrator/season"}
          className=" bg-blue-500 text-white px-3 py-2 rounded-md"
        >
          Manage Seasons
        </Link>
      </div>
      <AdminDashboard />
    </div>
  )
}
