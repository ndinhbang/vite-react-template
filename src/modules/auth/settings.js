const pages = {
  'auth.login': {
    routeName: 'auth.login',
    title: 'Login',
    path: '/auth/login',
    meta: {
      requireAuth: false,
    },
  },
  'auth.register': {
    routeName: 'auth.register',
    title: 'Register',
    path: '/auth/register',
    meta: {
      requireAuth: false,
    },
  },
};

export { pages };
