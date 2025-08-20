import EleminationRoundMatch from "./@EleminationRoundMatch/page"
import RoundRobinMatch from "./@RoundRobinMatch/page"

export default async function Page() {
  return (
    <div className=" mx-auto w-[69%] h-[90vh]">
      <RoundRobinMatch />
      <EleminationRoundMatch />
    </div>
  )
}
