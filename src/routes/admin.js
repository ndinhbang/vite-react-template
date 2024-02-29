import { createElement } from 'react';
import DefaultLayout from '@/layouts/DefaultLayout.jsx';
import UserIndex from '@/pages/admin/user/Index.jsx';

export const routes = [
  {
    path: 'admin',
    element: createElement(DefaultLayout),
    children: [
      {
        path: 'user',
        element: createElement(UserIndex),
      },
    ],
  },
];
