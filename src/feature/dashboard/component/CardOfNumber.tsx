type Props = {
  count: number
  title: string
  description: string
}

export const CardOfNumber = (props: Props) => {
  const { count, title, description } = props
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-center flex flex-1 flex-col w-full ">
      <div className="text-3xl font-bold text-white mb-1">{count}</div>
      <div className="text-gray-400 text-sm">{title}</div>
      <div className="text-gray-500 text-xs mt-1">{description}</div>
    </div>
  )
}
