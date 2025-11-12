import { List } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useTableOfContents } from "@/hooks/useTableOfContents";

export function TableOfContents() {
  const { open } = useSidebar();
  const { headings, activeId, scrollToHeading } = useTableOfContents();

  if (headings.length === 0) {
    return null;
  }

  return (
    <Sidebar className={open ? "w-64" : "w-14"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <List className="h-4 w-4" />
            {open && "Contents"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {headings.map((heading) => (
                <SidebarMenuItem key={heading.id}>
                  <SidebarMenuButton
                    onClick={() => scrollToHeading(heading.id)}
                    isActive={activeId === heading.id}
                    className={`cursor-pointer ${
                      heading.level === 3 ? "pl-6" : ""
                    }`}
                  >
                    {open && (
                      <span className="truncate text-sm">{heading.text}</span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
