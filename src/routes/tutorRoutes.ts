import { Route } from "../types";

export const tutorRoutes: Route[] = [
    {
        title: "Dashboard",
        items: [{ title: "Dashboard", url: "/tutor-dashboard" }],
    },
    {
        title: "Profile Management",
        items: [
            { title: "Tutor Account", url: "/tutor-dashboard/tutor-account" },
            { title: "Tutor Profile", url: "/tutor-dashboard/tutor-profile" },
        ],
    },
    {
        title: "Subject and Availability Management",
        items: [
            { title: "Subjects", url: "/tutor-dashboard/tutor-subjects" },
            {
                title: "Availability",
                url: "/tutor-dashboard/tutor-availability",
            },
        ],
    },
];
