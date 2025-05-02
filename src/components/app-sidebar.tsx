import { ChevronRight } from "lucide-react"
import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Basketball",
      url: "/",
      items: [
        { title: "Basketball Dashboard", url: "/admin/basketball-dashboard" },
        {
          title: "Teams",
          url: "/admin/basketball-teams-management",
        },
        {
          title: "Games",
          url: "/admin/volleyball-games-management",
        },
      ],
    },
    {
      title: "Volleyball",
      url: "/admin/volleyball",
      items: [
        {
          title: "Teams",
          url: "/admin/teams-management",
        },
        {
          title: "Games",
          url: "/admin/games-management",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/season-dashboard",
      items: [
        {
          title: "seasons",
          url: "/admin/season-dashboard",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className=" bg-neutral-950">
      <SidebarHeader className=" bg-neutral-950">
        <h1 className=" text-lg font-[700] text-neutral-100">LBA</h1>
      </SidebarHeader>
      <SidebarContent className="gap-0 bg-neutral-950 text-neutral-100">
        {/* We create a collapsible SidebarGroup for each parent. */}
        <div className=" px-3 py-2">
          <h1>Current Season</h1>
        </div>

        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible text-neutral-200"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger className=" text-white">
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
