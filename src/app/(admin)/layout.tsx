import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"


export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
 
    return (
        <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className=" sticky top-0 flex h-16 shrink-0 items-center gap-2  px-4 bg-neutral-950 text-neutral-100">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p>League Ball Association</p>
          </header>
          <div className="flex flex-1 p-3 bg-neutral-900">
          {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
      )
}
