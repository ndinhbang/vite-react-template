import MasterLayout from '@/layouts/MasterLayout.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import { createElement } from 'react';
import { routes as GuestRoutes } from '@/routes/guest.js';
import { routes as AdminRoutes } from '@/routes/admin.js';

const routes = [
  {
    path: '/',
    element: createElement(MasterLayout), // same as <MasterLayout />
    children: [
      {
        index: true,
        element: createElement(Dashboard),
      },
      ...GuestRoutes,
      ...AdminRoutes,
    ],
  },
];

export default routes;
