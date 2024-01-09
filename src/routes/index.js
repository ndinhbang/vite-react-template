import MasterLayout from "@/layouts/MasterLayout.jsx";
import Dashboard from "@/pages/Dashboard.jsx";
import { createElement } from "react";
import { routes as guestRoutes } from "@/routes/guest";

const routes = [
    {
        path: "/",
        element: createElement(MasterLayout), // same as <MasterLayout />
        children: [
            {
                index: true,
                element: createElement(Dashboard),
            },
            ...guestRoutes
        ]
    },
]

export default routes;
