import { PlayerWithTeam } from "@/_lib/dto/Player.model";
import { TableRow } from "@/components/ui/table";

type Props = {
	playerList: PlayerWithTeam[];
};

export default async function PlayerDashboard(
	props: Props
) {
	const { playerList } = props;
	return playerList.map(
		(
			val: PlayerWithTeam,
			index: number
		) => {
			return (
				<TableRow
					key={val?.id}
					className="group hover:bg-slate-800/50 transition-colors duration-200 border-b border-slate-700/50"
				>
					<td className=" text-white text-center w-[8%] py-3 ">
						<div className=" self-center flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
							{val.jerseyNumber}
						</div>
					</td>
					<td className=" text-white  text-left uppercase">
						{val?.firstname}{" "}
						{val?.middlename}{" "}
						{val?.lastname} {}
					</td>

					<td className=" text-center text-white">
						{val?.position}
					</td>
					<td className=" text-center text-white">
						{val?.age}
					</td>
					<td className=" text-center text-white">
						{val?.team?.teamName}
					</td>
				</TableRow>
			);
		}
	);
}
