"use client";
import { Card } from "@/components/card";
import {
	Calendar,
	Trophy,
	Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
	{
		title: "Season",
		icon: <Trophy size={48} />,
		bgColor:
			"bg-gradient-to-br from-blue-500 to-blue-700",
		url: "/administrator/season",
	},
	{
		title: "Teams",
		icon: <Users size={48} />,
		url: "/administrator/teams",
		bgColor:
			"bg-gradient-to-br from-purple-500 to-purple-700",
	},
	{
		title: "Players",
		url: "/administrator/players",
		icon: (
			<Users
				size={48}
				strokeWidth={1.5}
			/>
		),
		bgColor:
			"bg-gradient-to-br from-red-500 to-red-700",
	},
	{
		title: "Game Schedule",
		url: "/administrator/game-schedule",
		icon: <Calendar size={48} />,
		bgColor:
			"bg-gradient-to-br from-green-500 to-green-700",
	},
];

export default function Page() {
	const navigation = useRouter();

	function onClick(url: string) {
		navigation.push(url);
	}
	return (
		<div className=" flex flex-1 flex-col h-screen ">
			<div className=" w-full md:w-[80%] lg:w-[70%] mx-auto mt-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{categories.map(
					(category, index) => (
						<Card
							key={index}
							title={category.title}
							icon={category.icon}
							bgColor={category.bgColor}
							onClick={() =>
								onClick(category.url)
							}
						/>
					)
				)}
			</div>
		</div>
	);
}
