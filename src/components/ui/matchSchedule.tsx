type Props = {
    teamOneName:string;
    teamOneLogo:string;
    teamTwoName:string;
    teamTwoLogo:string;
    scheduleDate:string;
    scheduleTime:string;
}

export default function MatchSchedule(props:Props) {
const {teamOneName,teamTwoName,scheduleDate,scheduleTime} = props;
  return (
    <div className=" w-full  flex flex-row justify-between items-center">
      <div className=" flex flex-row gap-3 items-center flex-1 px-3">
        <div className=" w-[50px] h-[50px] rounded-full bg-gray-400" />
        <p className=" text-[12px] w-[50%] font-[700] text-neutral-100">
          {teamOneName}
        </p>
      </div>
      <div className=" flex items-center flex-col flex-1 bg-clip-text relative">
        <h1 className="absolute inset-0 text-[40px] font-bold text-gray-300 opacity-[20%] pointer-events-none select-none flex items-center justify-center">
          LIVE
        </h1>
        <p className=" text-[10px] font-[700] text-center text-white">{scheduleTime}</p>
        <p className=" text-[10px] font-[700] text-center text-white">{scheduleDate}</p>
      </div>
      <div className=" flex flex-row gap-2 justify-end  flex-1 items-center">
        <p className=" text-[12px] w-[50%] font-[700] text-neutral-100 text-end ">
            {teamTwoName}
        </p>
        <div className=" w-[50px] h-[50px] rounded-full bg-gray-400" />
      </div>
    </div>
  );
}
