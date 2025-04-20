import MatchSchedule from "@/components/ui/matchSchedule";
import MvpOfTheGame from "@/components/ui/mvpOfTheGame";
import TopFiveTeam from "@/components/ui/topFiveTeam";

export default function VolleballSection() {

    const name ="Alysa Valdez";
    const jersey = '02';
    const arrFooter = ["ATK: 8","BLOCK: 12","SERVE: 12","SET: 1"]
    return (
    <section className="  px-3  py-3 md:w-[80%] lg:w[80%] mx-auto">
      <p className=" p-4 text-[24px] text-slate-300 font-[700]">Volleyball</p>
      <MatchSchedule
        teamOneLogo=""
        teamOneName="Tamaraw Warrios"
        teamTwoLogo=""
        teamTwoName="UC Webmaster"
        scheduleDate="December 25,2025"
        scheduleTime="8:00 AM"
      />
      <div className=" mt-10 flex flex-1 gap-5 flex-col">
        <MvpOfTheGame footerItem={arrFooter} name={name} jerseyNumber={+jersey} />
        <TopFiveTeam />
      </div>
    </section>
  );
}
