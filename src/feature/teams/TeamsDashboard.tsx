import { Team } from "@/_lib/dto/Team.model";
import Image from "next/image";

type Props = {
	teamList: Team[];
};

export default function TeamDashboard(
	props: Props
) {
	const { teamList } = props;

	return teamList.map((team: Team) => (
    <div
      className=" flex-col w-[200px] bg-white p-4 shadow rounded flex justify-center items-center"
      key={team?.id}
    >
      <Image
        src={team?.teamLogo}
        alt={team?.teamName}
        width={200}
        height={200}
      />
      <h3 className="text-lg text-slate-900 uppercase font-semibold mt-2">
        {team?.teamName}
      </h3>
    </div>
  ))
}
