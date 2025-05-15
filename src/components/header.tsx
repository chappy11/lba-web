"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "./ui/button";

type Props = {
	title: string;
	createButtonName?: string;
	link?: string;
};

export default function Header(
	props: Props
) {
	const {
		title,
		createButtonName,
		link,
	} = props;
	const navigation = useRouter();

	const displayCreateButton =
		useMemo(() => {
			if (!createButtonName || !link) {
				return;
			}

			return (
				<Button
					className=" w-[150px]"
					onClick={() =>
						navigation.push(link)
					}
				>
					{createButtonName}
				</Button>
			);
		}, [link, createButtonName]);
	return (
		<div className=" h-[50px] px-3 w-full bg-slate-200 flex justify-between items-center gap-3">
			<div className=" flex flex-row gap-3">
				<ArrowLeft
					size={24}
					color="black"
					onClick={() =>
						navigation.back()
					}
				/>
				<p className=" text-[18px]">
					{title}
				</p>
			</div>
			{displayCreateButton}
		</div>
	);
}
