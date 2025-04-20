"use"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSeason() {
  return (
    <Sheet>
      <SheetTrigger className=" bg-amber-800 text-white px-3 rounded-md py-2">
        Create New Season
      </SheetTrigger>
      <SheetContent className=" bg-neutral-800">
        <SheetHeader>
          <SheetTitle className=" text-neutral-100">Create Season</SheetTitle>
        </SheetHeader>
        <div className=" flex flex-col gap-5 px-3">
            <div className=" flex w-full items-center justify-center">
                <div className=" bg-neutral-700 h-[100px] w-[100px] rounded-full"></div>
            </div>
            <Input inputLabel="Upload Season Logo" type="file" className=" text-white"/>
            <Input inputLabel="Season Name" placeholder=" Enter the season name"/>
            <Textarea inputLabel="Season Motto"/>
            <Input type="date" inputLabel="Season Name" placeholder=" Enter the season name"/>
            <Input type="date" inputLabel="Season Name" placeholder=" Enter the season name"/>
        </div>
      </SheetContent>
    </Sheet>
  );
}
