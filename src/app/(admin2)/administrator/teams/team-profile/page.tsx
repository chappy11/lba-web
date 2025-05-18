// pages/posts/[id].tsx
"use client";

import { Team } from "@/_lib/dto/Team.model";
import { getTeamById } from "@/_lib/server/team";
import Header from "@/components/header";
import { TeamProfile } from "@/feature/teams/TeamProfile";
import { useSearchParams } from "next/navigation";
import {
	useCallback,
	useEffect,
	useState,
} from "react";

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

	if (!data) {
		return (
			<div className=" w-full h-full flex items-center justify-center">
				Loading...
			</div>
		);
	}
	return (
		<div className=" flex flex-1 flex-col">
			<div className=" w-[60%] mx-auto mt-10">
				<Header title="Team Info" />
				<TeamProfile data={data} />
			</div>
		</div>
	);
}
