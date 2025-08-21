import {
	MatchType,
	Round,
	SeasonGames,
} from "@/_lib/dto/MatchSchedule";
import MatchCard from "@/components/match-card";

type Props = {
	data: SeasonGames;
};

export default function DisplayEliminationMatchSchedule(
	props: Props
) {
	const { data } = props;
	const games =
		data?.matchSchedule as Array<Round>;

	if (games?.length < 1) {
		return;
	}

	const filterSemifinal =
		games[0].matches.filter(
			(val) =>
				val.matchType ===
				MatchType.SEMIFINAL.toString()
		);

	const final = games[0].matches.filter(
		(val) =>
			val.matchType ===
			MatchType.FINAL.toString()
	);
	console.log(final);
	return (
		<div className=" mx-auto w-full">
			<h1 className="text-2xl font-bold mb-4">
				Elimination Round Matches
			</h1>
			<p className="text-gray-600 mb-6">
				All matches have been completed.
			</p>
			<div className=" flex flex-row w-full h-[400px] mt-12">
				<div className=" flex flex-1 flex-col relative border-t-1 border-t-black border-r-1 border-r-black border-b-1 border-b-black border-r-1 border-r-black ">
					<div className="   absolute -bottom-7 ">
						<MatchCard
							isElimination
							isUseMatchScore={true}
							data={filterSemifinal[0]}
							id={filterSemifinal[0].id}
							games={data}
						/>
					</div>
					<div className="   absolute -top-10">
						<MatchCard
							isElimination
							isUseMatchScore={true}
							data={filterSemifinal[1]}
							id={filterSemifinal[1].id}
							games={data}
						/>
					</div>
				</div>
				<div className=" flex  flex-1 justify-center items-center flex flex-row">
					<div className=" flex flex-1 justify-center">
						<div className=" h-1 border-t-1 border-dashed border-black w-full " />
					</div>
					<div className="   ">
						<MatchCard
							isElimination
							isUseMatchScore={true}
							data={final[0]}
							id={final[0].id}
							games={data}
						/>
					</div>
					<div className=" flex flex-1 justify-center">
						<div className=" h-1 border-t-1 border-black w-full " />
					</div>
				</div>
				<div className=" flex  flex-1 justify-center items-center flex flex-row">
					<div className=" flex flex-1 justify-start">
						<div className=" h-[50px] w-[100px] bg-blue-500  "></div>
					</div>
				</div>
			</div>
			<div className=" h-[50px]" />
		</div>
	);
}
