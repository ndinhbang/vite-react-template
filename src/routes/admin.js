import { createElement } from 'react';
import HasSidebarLayout from "@/layouts/HasSidebarLayout.jsx";
import UserIndex from "@/pages/admin/user/Index.jsx";

export const routes = [
    {
        path: 'admin',
        element: createElement(HasSidebarLayout),
        children: [
            {
                path: 'user',
                element: createElement(UserIndex),
            },
        ],
    },
];
