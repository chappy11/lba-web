"use client";

import Header from "@/components/header";
import CreateGames from "@/feature/game/CreateGames";

export default function Page() {
	return (
		<div className=" flex flex-1 flex-col">
			<div className=" w-[60%] mx-auto shadow-xl rounded-md">
				<Header title="New Schedule" />
				<CreateGames />
			</div>
		</div>
	);
}
