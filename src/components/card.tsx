type Props = {
  title: string
  icon: React.ReactNode
  bgColor: string
  onClick: () => void
  description: string
  url: string
}

export const Card = (props: Props) => {
  const { title, description, icon, url } = props
  return (
    <div
      onClick={() => props.onClick()}
      className={`rounded-xl bg-white shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden `}
    >
      <div className="p-6 flex gap-5 flex-row items-center text-white">
        <div className="mb-4">{icon}</div>
        <div>
          <h3 className="text-2xl font-bold  text-gray-500">{title}</h3>
          <h2 className=" text-gray-500">{description}</h2>
        </div>
        <div className=" flex flex-1 justify-end items-end"></div>
      </div>
    </div>
  )
}
