import { Game } from "@/_lib/dto/Game.model";
import { getUpcomingGames } from "@/_lib/server/game";
import GameCard from "@/feature/dashboard/component/GameCard";

type Props = {
	numberOfItemsDisplay?: number;
};
export default async function UpcomingGames(
	props: Props
) {
	const resp =
		(await getUpcomingGames()) as Game[];

	const item = resp[resp.length - 1];

	if (!item) {
    return (
      <div className=" text-white text-center">
        No upcoming games available.
      </div>
    )
  }
	return <GameCard data={item} />;
}
