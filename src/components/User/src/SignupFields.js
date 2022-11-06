import {
  notEmptyValidator,
  validEmailValidator,
  passwordRepeatedCorrectly,
} from 'utils/validators';

export const signupFields = [
  {
    label: 'Username',
    name: 'username',
    placeholder: 'Username',
    id: 'signup_username',
    defaultValue: '',
    validators: [notEmptyValidator],
  },
  {
    label: 'Email',
    name: 'email',
    placeholder: 'Email',
    id: 'signup_email',
    defaultValue: '',
    validators: [notEmptyValidator, validEmailValidator],
  },
  {
    label: 'Password',
    name: 'password',
    placeholder: 'Password',
    id: 'signup_password',
    type: 'password',
    defaultValue: '',
    validators: [notEmptyValidator],
  },
  {
    label: 'Repeat password',
    name: 'password2',
    placeholder: 'Repeat password',
    id: 'signup_password2_repeat',
    type: 'password',
    defaultValue: '',
    validators: [notEmptyValidator, passwordRepeatedCorrectly],
  },
];
