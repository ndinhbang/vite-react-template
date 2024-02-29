import { fieldAtom, formAtom } from 'form-atoms';

const usernameFieldAtom = fieldAtom({ value: '' });
const passwordFieldAtom = fieldAtom({ value: '' });

export const loginFormAtom = formAtom({
  username: usernameFieldAtom,
  password: passwordFieldAtom,
});
