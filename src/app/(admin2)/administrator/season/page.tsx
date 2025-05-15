import { getSeasons } from "@/_lib/server/season";
import Header from "@/components/header";
import SeasonList from "@/feature/season/SeasonList";

export default async function Season() {
	const seasons = await getSeasons();

	return (
		<div className=" w-[60%] mx-auto mt-5">
			<Header
				title="Season list"
				createButtonName="Create"
				link="/administrator/season/create"
			/>
			<SeasonList data={seasons} />
		</div>
	);
}
