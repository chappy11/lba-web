import { AppSidebar } from "@/components/app-sidebar";
import { SearchForm } from "@/components/search-form";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarRail, SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { VersionSwitcher } from "@/components/version-switcher";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "@radix-ui/react-separator";
import { Sidebar, ChevronRight } from "lucide-react";


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
