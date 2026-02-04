import { AppSidebar } from "@/components/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { Roles } from "../../constants/roles";
import { userService } from "../../services/user.service";

export default async function DashboardLayout({
    admin,
    student,
    tutor,
}: {
    admin: React.ReactNode;
    student: React.ReactNode;
    tutor: React.ReactNode;
}) {
    const { data } = await userService.getSession();
    const userInfo = data?.user;

    return (
        <SidebarProvider>
            <AppSidebar user={userInfo} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <div className="flex-1 flex flex-col gap-4 p-4">
                    {userInfo?.role === Roles.student
                        ? student
                        : userInfo?.role === Roles.tutor
                          ? tutor
                          : admin}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
