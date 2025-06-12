import { GamePlayer } from "@/_lib/dto/GamePlayer.model";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import UpdatePlayerScore from "./UpdatePlayerScore";
import { Game } from "@/_lib/dto/Game.model";

type Props = {
	game: Game;
	gameId: string;
	playerRecord: Array<GamePlayer>;
	isTeamOne: boolean;
};

export default function PlayerScoreTable(
	props: Props
) {
	const {
		playerRecord,
		gameId,
		isTeamOne,
		game,
	} = props;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						Player Name
					</TableHead>
					<TableHead>REB</TableHead>
					<TableHead>AST</TableHead>
					<TableHead>3-PTS</TableHead>
					<TableHead>FOUL</TableHead>
					<TableHead>PTS</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playerRecord?.map((player) => (
					<TableRow
						key={player.playerId}
					>
						<TableCell>
							{player.firstname}{" "}
							{player.middlename}{" "}
							{player.lastname}
						</TableCell>
						<TableCell>
							{player.rebound}
						</TableCell>
						<TableCell>
							{player.assist}
						</TableCell>
						<TableCell>
							{player.threepoints}
						</TableCell>
						<TableCell>
							{player.foul}
						</TableCell>
						<TableCell>
							{player.points}
						</TableCell>
						<TableCell>
							<UpdatePlayerScore
								{...player}
								gameId={gameId}
								isTeamOne={isTeamOne}
								game={game}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
