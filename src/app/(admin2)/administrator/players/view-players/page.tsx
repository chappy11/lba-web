import { Player } from "@/_lib/dto/Player.model";
import { getPlayerById } from "@/_lib/services/PlayerService.service";
import { QueryParams } from "@/_lib/type/params.type";
import ViewPlayer from "@/feature/players/ViewPlayer";

export default async function Page(query: QueryParams) {
    const id = query.searchParams.id as string
    const resp = await getPlayerById(id) as Player;
    
    

  return (
    <div className=" mx-auto w-[80%] mt-5">
        <ViewPlayer data={resp}/>
    </div>
  )
}
