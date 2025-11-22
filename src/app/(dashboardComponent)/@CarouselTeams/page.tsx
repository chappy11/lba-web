import { Team } from "@/_lib/dto/MatchSchedule";
import { getCurrentTeamFromThisSeason } from "@/_lib/server/team";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

export default async function CarouselTeam() {
       const resp = await getCurrentTeamFromThisSeason();
  return (
    <Carousel
      className=" w-[400px] h-[300px] mx-auto"
      opts={{
        loop: true,
        duration: 1000,
        autoplay: true,
        autoplayInterval: 3000,
        perView: 3,
        gap: 20,
      }}
    >
      <CarouselContent className="-ml-4">
        {resp.map((team: Team, index: number) => (
          <CarouselItem
            key={index.toString() + team.teamName}
            className=" l-1 md:basis-1/2 lg:basis-1/3 flex flex-col justify-center items-center gap-2"
          >
            {team.teamLogo ? (
              <Image
                src={team.teamLogo}
                width={100}
                height={200}
                alt="team logo"
              />
            ) : (
              <Image
                src={"/NoTeam.png"}
                width={100}
                height={200}
                alt="team logo"
              />
            )}

            <h3 className="text-xl font-semibold">{team.teamName}</h3>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
