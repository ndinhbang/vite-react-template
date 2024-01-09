import AuthLayout from '@/layouts/AuthLayout.jsx';
import Login from '@/pages/auth/Login.jsx';
import Register from '@/pages/auth/Register.jsx';
import { createElement } from 'react';

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
