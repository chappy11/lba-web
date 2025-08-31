import { TeamsStanding } from "@/_lib/dto/Team.model";
import { TableRow } from "@/components/ui/table";
import Image from "next/image";

type Props = {
	teamStanding: Array<TeamsStanding>;
};

export default async function TeamStanding(
	props: Props
) {
	const { teamStanding } = props;
	return teamStanding.map((standing: TeamsStanding, index: number) => (
    <TableRow
      key={standing?.id}
      className="group hover:bg-slate-800/50 transition-colors duration-200 border-b border-slate-700/50"
    >
      {/* Team Name */}
      <td className="py-4 px-6 text-left">
        <div className="flex items-center space-x-3">
          {/* <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center  font-bold text-sm">
							{index + 1}
						</div> */}
          <p className="  mr-5 text-lg">{index + 1}</p>
          <Image
            src={standing.teamLogo}
            alt={standing.teamName}
            width={32}
            className="rounded-full"
            height={32}
          />
          <span className=" uppercase font-medium text-lg group-hover:text-blue-300 transition-colors">
            {standing.teamName}
          </span>
        </div>
      </td>

      {/* Wins */}
      <td className="py-4 px-4 text-center">
        <div className="inline-flex flex-col items-center space-y-1">
          <span className="text-2xl font-bold text-green-600">
            {standing.win}
          </span>
          <span className="text-xs text-green-500/80 uppercase tracking-wide">
            Wins
          </span>
        </div>
      </td>

      {/* Losses */}
      <td className="py-4 px-4 text-center">
        <div className="inline-flex flex-col items-center space-y-1">
          <span className="text-2xl font-bold text-red-600">
            {standing.lose}
          </span>
          <span className="text-xs text-red-500/80 uppercase tracking-wide">
            Losses
          </span>
        </div>
      </td>

      {/* Total Games */}
      <td className="py-4 px-4 text-center">
        <div className="inline-flex flex-col items-center space-y-1">
          <span className="text-2xl font-bold text-blue-400">
            {standing.games}
          </span>
          <span className="text-xs text-blue-300/70 uppercase tracking-wide">
            Games
          </span>
        </div>
      </td>

      {/* Win Percentage (Optional Enhancement) */}
      <td className="py-4 px-6 text-center">
        <div className="inline-flex flex-col items-center space-y-2">
          <span className="text-lg font-semibold text-yellow-400">
            {standing.games > 0
              ? ((standing.win / standing.games) * 100).toFixed(1) + "%"
              : "0%"}
          </span>
          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300"
              style={{
                width:
                  standing.games > 0
                    ? `${(standing.win / standing.games) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </td>
    </TableRow>
  ))
}
