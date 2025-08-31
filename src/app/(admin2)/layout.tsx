import Header from "@/feature/admin/Header"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen w-full flex-col bg-gray-50">
      <Header />
      {children}
    </div>
  )
}
