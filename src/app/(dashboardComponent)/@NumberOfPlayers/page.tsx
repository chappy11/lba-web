import { getAllPlayers } from "@/_lib/server/player";
import { CardOfNumber } from "@/feature/dashboard/component/CardOfNumber";


export default async function NumberOfPlayerComponent() {
    const resp = await getAllPlayers();

    const count = resp.length;
  return (
  <CardOfNumber count={count}
    title="Players"
    description="Active Roster"/>
  )
}