import { Button } from "@/components/ui/button";

export default function Header(){
 return (
    <header className=" bg-slate-900 h-screen justify shadow-md shadow-black">
    <div className=" h-full w-full flex flex-1 justify-center items-center">
      <div className=" w-[90%] flex flex-col items-center justify-center">
        <p className=" text-[40px] font-serif text-white font-[700] text-center ">BECOMING ONE WITH THE GAME</p>
        <Button className="  bg-red-600 mt-[24px] w-[177px] h-[44px]">TextHere</Button>
      </div>
    </div>
  </header>
 )   
}