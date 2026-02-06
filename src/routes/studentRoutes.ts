import { Route } from "../types";

export const studentRoute: Route[] = [
    {
        title: "Dashboard",
        items: [{ title: "Dashboard", url: "/dashboard" }],
    },
    {
        title: "Booking Management",
        items: [{ title: "My Bookings", url: "/dashboard/bookings" }],
    },
    {
        title: "Profile Management",
        items: [{ title: "Profile", url: "/dashboard/profile" }],
    },
];
