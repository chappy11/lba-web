// pages/posts/[id].tsx
"use client";

import { Team } from "@/_lib/dto/Team.model";
import { getTeamById } from "@/_lib/server/team"
import { TeamProfile } from "@/feature/teams/TeamProfile";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react"

export default function Page() {
	const searchParams =
		useSearchParams();
	const id = searchParams.get("id");
	const [data, setData] =
		useState<Team | null>(null);

	const sendRequest =
		useCallback(async () => {
			try {
				const resp = await getTeamById(
					id as string
				);
				console.log(resp);
				setData(resp);
			} catch (error) {
				console.log(error);
			}
		}, [id]);

	useEffect(() => {
		sendRequest();
	}, [id]);


	return (
    <div className="flex flex-1 flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-7xl">
        {data && <TeamProfile data={data} />}
      </div>
    </div>
  )
}
