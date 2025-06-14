import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import { CardOfNumber } from "@/feature/dashboard/component/CardOfNumber";

export default async function NumberOfTeam() {
    const resp = await getCurrentTeamFromThisSeason();

    const count = resp.length;
    return (
        <CardOfNumber count={count} title={"Teams"} description={"Active Teams"}/>
    );
}