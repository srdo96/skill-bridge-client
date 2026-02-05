import { Route } from "../types";

export const adminRoutes: Route[] = [
    {
        title: "Dashboard",
        items: [{ title: "Dashboard", url: "/admin-dashboard" }],
    },
    {
        title: "User Management",
        items: [{ title: "Users", url: "/admin-dashboard/users-management" }],
    },
    {
        title: "Booking Management",
        items: [
            { title: "Bookings", url: "/admin-dashboard/bookings-management" },
        ],
    },
    {
        title: "Category Management",
        items: [
            {
                title: "Categories",
                url: "/admin-dashboard/categories-management",
            },
            {
                title: "Create Categories & Subjects",
                url: "/admin-dashboard/categories-management/create-categories-subjects",
            },
        ],
    },
];
