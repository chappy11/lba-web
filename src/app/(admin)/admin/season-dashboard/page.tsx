import { Season } from "@/_lib/dto/Season.model"
import { getSeasons } from "@/_lib/server/season"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CreateSeason from "@/feature/adminDashboard/CreateSeason/page"
import Image from "next/image"

export default async function SeasonDashboard() {
  const seasonList: Array<Season> = await getSeasons()

  return (
    <div className=" flex-1">
      <div className=" w-full flex flex-row justify-between px-3">
        <h1 className=" text-neutral-100 text-xl font-[700]">
          Season Dashboard
        </h1>
        <CreateSeason />
      </div>
      <Table className="  mt-3 text-neutral-100 border-separate border-spacing-y-3">
        <TableHeader className=" text-neutral-100 bg-neutral-900 ">
          <TableRow className=" text-neutral-100 bg-neutral-950 ">
            <TableHead className=" text-neutral-100 px-3">
              Season Name
            </TableHead>
            <TableHead className="text-neutral-100">Season Start</TableHead>
            <TableHead className="text-neutral-100">Season End</TableHead>
            <TableHead className=" text-neutral-100">Status</TableHead>
            <TableHead className="text-right text-neutral-100">
              Game Type
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" mt-3">
          {seasonList.map((data, index) => {
            const isEven = index % 2

            const background = isEven ? "bg-neutral-950" : "bg-neutral-800"
            return (
              <TableRow className={` ${background}`} key={data.id}>
                <TableCell className=" py-3 px-3">
                  <div className=" flex flex-row items-center gap-2">
                    <Image
                      src={data.seasonLogo}
                      className=" rounded-full h-[100px]  w-[100px]"
                      alt="season logo"
                      width={100}
                      height={100}
                    />
                    <p className=" font-medium">{data.seasonName}</p>
                  </div>
                </TableCell>
                <TableCell className=" py-3">{data.seasonStartDate}</TableCell>
                <TableCell className=" py-3">{data.seasonEndDate}</TableCell>
                <TableCell className=" py-3">
                  {data.isActiveSeason == 1 ? "Active" : "Done"}
                </TableCell>
                <TableCell className="text-right py-3 px-3">
                  {data.gameType}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
