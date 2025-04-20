import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VerticalText from "./verticalText";
const gameStandings = [
  { teamName: "Thunder Wolves", win: 8, lose: 2 },
  { teamName: "Crimson Hawks", win: 6, lose: 4 },
  { teamName: "Iron Titans", win: 7, lose: 3 },
  { teamName: "Shadow Serpents", win: 5, lose: 5 },
  { teamName: "Blazing Phoenix", win: 9, lose: 1 },
];

export default function TopFiveTeam() {
  return (
    <div className=" flex flex-row bg-neutral-800 ">
      <VerticalText />
      <div className=" p-3 flex-1">
        <Table className=" w-full border-separate border-spacing-y-3">
          <TableHeader className=" border-0 w-full bg-neutral-950">
            <TableRow className=" h-full">
              <TableHead className=" w-[100%] text-center text-white">
                Team
              </TableHead>
              <TableHead className="  bg-opacity-[26%] mr-3 h-full text-[#00DB28] text-center bg-[#D9D9D942]">
                WIN
              </TableHead>
              <TableHead className="  bg-opacity-[26%] ml-10 h-full text-red-500 text-center bg-[#D9D9D942]">
                LOSE
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className=" gap-3">
            {gameStandings.map((val,index) => {
              const isEven = index % 2;

              const background = isEven ? 'bg-neutral-950' : 'bg-neutral-900'
              return (
              
                <TableRow className={` ${background} mb-3 text-center`} key={index+1}>
                  <TableCell className=" text-neutral-300 ">
                    {val.teamName}
                  </TableCell>

                  <TableCell className=" text-center text-white">{val.win}</TableCell>
                  <TableCell className="text-center text-white">{val.lose}</TableCell>
                </TableRow>
              
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
