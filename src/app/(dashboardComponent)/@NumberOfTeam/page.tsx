import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import { CardOfNumber } from "@/feature/dashboard/component/CardOfNumber";

export default async function NumberOfTeam() {
    const resp = await getCurrentTeamFromThisSeason();

    console.log("test", resp)
    if (!resp) {
      return (
        <CardOfNumber count={0} title={"Teams"} description={"Active Teams"} />
      )
    }
    const count = resp.length

    if (!count) {
      return (
        <CardOfNumber count={0} title={"Teams"} description={"Active Teams"} />
      )
    }
    return (
        <CardOfNumber count={count} title={"Teams"} description={"Active Teams"}/>
    );
}