
type Props = {
    title: string;
    value: string;
}

export default function InfoCard(props: Props) {
    const { title, value } = props;
    return (
      <div className=" h-[150px] w-[200px] flex-col flex justify-center items-center shadow-md rounded-md">
            <h3 className=" text-[#fab56c] text-lg font-semibold">{title}</h3>
            <h1 className=" text-3xl font-bold">{value}</h1>
      </div>
    )
 }