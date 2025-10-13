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

	const displayCreateButton = useMemo(() => {
    if (!createButtonName || !link) {
      return
    }

    return (
      <Button className=" w-[150px]" onClick={() => navigation.push(link)}>
        {createButtonName}
      </Button>
    )
  }, [link, createButtonName, navigation])
	return (
    <div className="h-16 px-6 w-full bg-gradient-to-r from-purple-600 to-indigo-700 flex justify-between text-white items-center shadow-lg">
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={() => navigation.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <ArrowLeft size={24} color="white" />
        </button>
        <div className="h-8 w-px bg-white/20" />
        <h1 className="text-lg font-bold tracking-wide">{title}</h1>
      </div>
      {displayCreateButton}
    </div>
  )
}
