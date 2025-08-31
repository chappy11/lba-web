import { getGames } from "@/_lib/server/game"
import { CardOfNumber } from "@/feature/dashboard/component/CardOfNumber"

export default async function TotalNumberOfTeams() {
  const resp = await getGames()

  const count = resp.length

  if (!count) {
    return (
      <CardOfNumber count={0} title="Games" description="Total Games Played" />
    )
  }

  return (
    <CardOfNumber
      count={count}
      title="Games"
      description="Total Games Played"
    />
  )
}
