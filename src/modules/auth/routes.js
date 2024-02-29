import AuthLayout from '@/layouts/AuthLayout.jsx';
import Login from '@/modules/auth/pages/Login.jsx';
import Register from '@/modules/auth/pages/Register.jsx';
import { createElement, lazy } from 'react';

export const routes = [
  {
    path: 'auth',
    element: createElement(AuthLayout),
    children: [
      {
        path: 'login',
        element: createElement(Login),
      },
      {
        path: 'register',
        element: createElement(Register),
      },
    ],
  },
];
