import MatchSchedule from "@/components/ui/matchSchedule";
import MvpOfTheGame from "@/components/ui/mvpOfTheGame";
import TopFiveTeam from "@/components/ui/topFiveTeam";

export default function BasketballSection() {
    const name = "Kobe Bryant";
    const jerseyNum = "11";
    const arrFooter = [
        "PTS: 32",
        "RBND: 5",
        "ASST: 20",
        "BLCK: 5"
    ]
    return (
    <section className="  px-3  py-3 md:w-[80%] lg:w[80%] mx-auto">
      <p className=" p-4 text-[24px] text-slate-300 font-[700]">BASKETBALL</p>
      <MatchSchedule
        teamOneLogo=""
        teamOneName="Golden State Warriors"
        teamTwoLogo=""
        teamTwoName="Lakers"
        scheduleDate="December 25,2025"
        scheduleTime="8:00 AM"
      />
      <div className=" mt-10 flex flex-1 gap-5 flex-col">
      <MvpOfTheGame footerItem={arrFooter} name={name} jerseyNumber={+jerseyNum}/>
      <TopFiveTeam/>
      </div>
    </section>
  );
}
