"use client"

import Player from "lottie-react"
import animationData from "../../public/basketball-loading.json"
export default function LoadingScreen() {
  return (
    <div className=" absolute top-0 left-0 h-screen w-screen flex-col  inset-0 bg-black/50 flex justify-center items-center z-50">
      <Player
        autoplay
        loop
        // put your JSON file in public/animations
        style={{ height: "300px", width: "300px" }}
        animationData={animationData}
      />
      <h1 className="text-white text-2xl font-bold ">Loading...</h1>
    </div>
  )
}
