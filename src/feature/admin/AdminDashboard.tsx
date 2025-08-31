"use client"
import { Card } from "@/components/card"
import { Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"

const categories = [
 
  {
    title: "Teams",
        icon: <Users size={60} color="#fab56c" />,
    description: "Manage Teams",
    url: "/administrator/teams",
    bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
  },
  {
    title: "Players",
      url: "/administrator/players",
    description: "Manage Players",
    icon: <Users size={60} strokeWidth={1.5} color="#fab56c" />,
    bgColor: "bg-gradient-to-br from-red-500 to-red-700",
  },
  {
    title: "Games",
      url: "/administrator/match-schedule",
    description: "Manage Game",
    icon: <Calendar size={60} color="#fab56c" />,
    bgColor: "bg-gradient-to-br from-green-500 to-green-700",
  },
]


export default function AdminDashboard() {
  const navigation = useRouter()

  function onClick(url: string) {
    navigation.push(url)
  }
  return (
    <div className=" flex flex-1 flex-col h-screen w-full ">
      <div className=" w-full md:w-[80%] lg:w-[70%] mx-auto mt-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <Card
                key={index}
                description={category.description}
            title={category.title}
            icon={category.icon}
            bgColor={category.bgColor}
                onClick={() => onClick(category.url)}
                url={category.url}
          />
        ))}
      </div>
    </div>
  )
}
