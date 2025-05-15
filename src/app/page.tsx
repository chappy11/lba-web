import BasketballSection from "@/feature/dashboard/BasketballSection";
import Header from "@/feature/dashboard/Header";
import VolleballSection from "@/feature/dashboard/VolleballSection";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function Home() {
	return (
		<div className=" flex-1">
			<nav className=" fixed p-3 flex flex-row justify-between w-full items-center bg-neutral-950 z-50">
				<Image
					src={"/lba-mobile.png"}
					alt={"icon"}
					height={60}
					width={131}
					className="bg-[#223974] p-2 rounded-md"
				/>
				<Menu
					className=""
					color="white"
					height={30}
					width={30}
				/>
			</nav>
			<Header />
			<div className=" flex flex-1 flex-col justify-around bg-neutral-950">
				<BasketballSection />
				<VolleballSection />
			</div>
		</div>
	);
}
