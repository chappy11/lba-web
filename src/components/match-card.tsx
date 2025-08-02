import { MatchTeam } from "@/_lib/dto/MatchSchedule";

type Props = MatchTeam

export default function MatchCard(props:Props) {
    const { team1, team2, team1Score, team2Score } = props;
    const team1ScoreText = team1Score > 0 ? team1Score.toString() : "TBA";
    const team2ScoreText = team2Score > 0 ? team2Score.toString() : "TBA"
    return (
      <div className=" border border-gray-200  rounded-md flex flex-col w-[200px]">
        <div className="flex items-center p-2 flex-row justify-between">
          <p>{team1}</p>
          <span>{team1ScoreText}</span>
        </div>
        <div className=" border border-gray-200 w-full" />
        <div className="flex items-center p-2 flex-row justify-between">
          <p>{team2}</p>
          <span>{team2ScoreText}</span>
        </div>
      </div>
    )
}