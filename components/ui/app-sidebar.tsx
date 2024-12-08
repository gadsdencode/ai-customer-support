// /components/ui/app-sidebar.tsx

'use client'
import React, { useState } from "react"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import InfoModal from "@/app/components/InfoModal"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Button } from "./button"
// Menu items.
  

export function AppSidebar() {
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)

    // Function to handle opening the modal
    const handleOpenInfoModal = () => {
      setIsInfoModalOpen(true)
    }
  
    // Function to handle closing the modal
    const handleCloseInfoModal = () => {
      setIsInfoModalOpen(false)
    }

    const items = [
        {
            title: "FAQ",
            icon: () => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ),
            action: () => handleOpenInfoModal(),
          },
        {
          title: "N/A 1",
          url: "#",
          icon: Home,
        },
        {
          title: "N/A 2",
          url: "#",
          icon: Inbox,
        },
        {
          title: "N/A 3",
          url: "#",
          icon: Calendar,
        },
        {
          title: "N/A 4",
          url: "#",
          icon: Search,
        },
        {
          title: "N/A 5",
          url: "#",
          icon: Settings,
        },
      ]

  return (
    <Sidebar>
      <SidebarContent className='custom-scrollbar sidebar-content'>
        <SidebarGroup>
          <SidebarGroupLabel className={cn('text-black text-lg')}>Demo Guide</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.action ? (
                    <SidebarMenuButton onClick={item.action}>
                      {item.icon()}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Render the InfoModal */}
      <InfoModal
        className="text-white"
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
        title="How to use the Inteleos AI Assistant"
        footer={
          <Button onClick={handleCloseInfoModal}>Close</Button>
        }
      >
        <p className="text-white font-bold text-center">Inteleos customer support AI is capable of answering questions about Inteleos&apos; certifications, exams, and more.</p>
        <br />
        <p className="text-white font-bold text-center">Try, &quot;Research Inteleos POCUS certification and requirements.&quot;</p>
        <br />
        <p className="text-white font-bold text-center">You can also ask Inteleos AI to research the Inteleos&apos; mission, values, and more.</p>
      </InfoModal>
    </Sidebar>
  )
}
