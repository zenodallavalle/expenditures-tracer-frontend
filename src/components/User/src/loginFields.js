import { notEmptyValidator } from 'utils/validators';

export const loginFields = [
  {
    label: 'Username',
    name: 'username',
    placeholder: 'Username',
    id: 'login_username',
    defaultValue: '',
    validators: [notEmptyValidator],
  },

  {
    label: 'Password',
    name: 'password',
    placeholder: 'Password',
    id: 'login_password',
    type: 'password',
    defaultValue: '',
    validators: [notEmptyValidator],
  },
];
