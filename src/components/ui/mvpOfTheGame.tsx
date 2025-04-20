
type Props = {
    footerItem:Array<string>;
    name:string;
    jerseyNumber:number
}

export default function MvpOfTheGame(props:Props){
    const {footerItem,name,jerseyNumber} = props;
    return(
        <div className=" w-full bg-neutral-900 p-3">
            <div className=" w-full p-3 bg-neutral-950 flex-col">
                <h3 className="text-center text-white font-[700]">MVP OF THE GAME</h3>
            </div>
            <h1  style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }} className=" text-[200px] font-[700] text-neutral-500  text-center leading-40">{jerseyNumber}</h1>
            <h2 className=" text-[40px] text-white text-center">{name}</h2>
            <div className=" w-full p-3 bg-neutral-950 flex flex-row justify-around mt-3">
                {footerItem.map((val,index)=>{
                    return    <div key={index+1}>
                    <p className=" text-white">{val}</p>
                </div>
                })}
             

            </div>
        </div>
    );
}