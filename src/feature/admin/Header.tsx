"use client"

import { getSession } from "@/app/action";
import Image from "next/image";
import { useEffect } from "react";

export default function Header() {
    const getUser = async() => {
        const resp = await getSession();

        console.log(resp)   
    }
    
    useEffect(() => {
        getUser()
    },[])
    return (
      <div className=" w-full flex h-[100px]  text-neutral-100 fix top-0   ">
        <Image
          src={"/banner3.png"}
          objectFit="center"
          alt="Imager"
          width={1920} // original image width
          height={600} // original image height
          // cover the container
          className="w-full h-auto" // full width, keeps aspect ratio
          priority // optional: preloads image
        />
      </div>
    )
}