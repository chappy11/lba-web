import { Team } from "@/_lib/dto/Team.model";
import { GameType } from "@/_lib/enums/GameTypeEnum";
import { getCurrentSeason } from "@/_lib/server/season";
import { getCurrentFromThisSeason } from "@/_lib/server/team";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CreateTeam from "@/feature/TeamManagement/CreateTeam/page";

import Image from "next/image";

export default async function Page() {
    const season = await getCurrentSeason();
    const teams: Array<Team> = await getCurrentFromThisSeason(GameType.BASKETBALL);
    console.log("TEAMS", teams);
    return (
      <div className=" flex flex-col flex-1 text-neutral-100 w-full">
        <div className=" flex flex-row justify-between w-full h-fit">
          <h1 className=" text-lg">Basketball Teams</h1>
          <CreateTeam
            seasonId={season.id as string}
            gameType={GameType.BASKETBALL}
          />
        </div>
        <Table className="  mt-3 text-neutral-100 border-separate border-spacing-y-3">
          <TableHeader className=" text-neutral-100 bg-neutral-900 ">
            <TableRow className=" text-neutral-100 bg-neutral-950 ">
              <TableHead className=" text-neutral-100 px-3">
                Team Name
              </TableHead>
              <TableHead className="text-neutral-100">Coach</TableHead>
              <TableHead className="text-neutral-100">Season End</TableHead>
              <TableHead className=" text-neutral-100">Status</TableHead>
              <TableHead className="text-right text-neutral-100">
                Game Type
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=" mt-3">
            {teams.map((data, index) => {
              const isEven = index % 2

              const background = isEven ? "bg-neutral-950" : "bg-neutral-800"
              return (
                <TableRow className={` ${background}`} key={data.id}>
                  <TableCell className=" py-3 px-3">
                    <div className=" flex flex-row items-center gap-2">
                      <Image
                        src={data.teamLogo}
                        className=" rounded-full h-[100px]  w-[100px]"
                        alt="season logo"
                        width={100}
                        height={100}
                      />
                      <p className=" font-medium">{data.teamName}</p>
                    </div>
                  </TableCell>
                  <TableCell className=" py-3">
                    {data.coachInfo.firstname} {data.coachInfo.middlename}{" "}
                    {data.coachInfo.lastname}
                  </TableCell>
                  <TableCell className=" py-3">{data.teamName}</TableCell>
                  <TableCell className=" py-3">{data.seasonId}</TableCell>
                  <TableCell className="text-right py-3 px-3">
                    {data.seasonId}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )

}