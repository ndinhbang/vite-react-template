const pages = [
  {
    routeName: 'auth.login',
    title: 'Login',
    path: '/auth/login',
    meta: {
      requireAuth: false,
    },
  },
  {
    routeName: 'auth.register',
    title: 'Register',
    path: '/auth/register',
    meta: {
      requireAuth: false,
    },
  },
];

export { pages };
