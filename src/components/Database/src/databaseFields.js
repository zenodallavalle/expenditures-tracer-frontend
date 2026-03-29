import { notEmptyValidator } from '/src/utils/validators';

export const databaseFields = [
  {
    label: 'Name',
    name: 'name',
    placeholder: 'Name',
    id: 'database_name',
    defaultValue: '',
    validators: [notEmptyValidator],
  },
];
