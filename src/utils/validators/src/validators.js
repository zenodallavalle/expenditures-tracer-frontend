export const notEmptyValidator = (instance, fieldName) => {
  const v = instance[fieldName];
  if (!v || !v.trim()) return [false, 'This field may not be empty.'];
  return [true, ''];
};

export const validEmailValidator = (instance, fieldName) => {
  const v = instance[fieldName];

  if (
    !String(v)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  )
    return [false, 'Invalid email format.'];
  return [true, ''];
};

export const passwordRepeatedCorrectly = (instance, fieldName) => {
  const { password } = instance;
  const v = instance[fieldName];
  if (password !== v)
    return [false, 'The repeated password does not match the first one.'];
  return [true, ''];
};
