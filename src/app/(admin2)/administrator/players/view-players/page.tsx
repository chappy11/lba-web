import { Player } from "@/_lib/dto/Player.model";
import { getPlayerById } from "@/_lib/services/PlayerService.service";
import { QueryParams } from "@/_lib/type/params.type";
import ViewPlayer from "@/feature/players/ViewPlayer";

export default async function Page(query: QueryParams) {
    const id = query.searchParams.id as string
    const resp = await getPlayerById(id) as Player;
    
    

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-7xl">
      <ViewPlayer data={resp} />
    </div>
  )
}
