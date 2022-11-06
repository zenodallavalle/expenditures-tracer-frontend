import { createRef, useCallback, useMemo, useState } from 'react';

export const useCreateFormFields = ({
  fields,
  onSubmitValidated = () => {},
  additionalValidators = {},
} = {}) => {
  const emptyMessages = Object.fromEntries(
    fields.map(({ name }) => [name, []])
  );

  const emptyInstance = Object.fromEntries(
    fields.map(({ name, defaultValue }) => [name, defaultValue])
  );

  const [instance, setInstance] = useState(emptyInstance);
  const [validationMessages, setMessages] = useState(emptyMessages);

  const validate = useCallback(() => {
    let isValid = true;
    let messages = { ...emptyMessages };

    fields.forEach(({ name, ...field }) => {
      const validators = [...field.validators];
      if (additionalValidators[name])
        validators.push(additionalValidators[name]);

      validators.forEach((validator) => {
        const [esit, message] = validator(instance, name);
        if (!esit) {
          messages[name].push(message);
          isValid = false;
        }
      });
    });
    setMessages(messages);
    return isValid;
  }, [additionalValidators, emptyMessages, fields, instance]);

  const onChange = useCallback(
    (e) => {
      setInstance((i) => ({ ...i, [e.target.name]: e.target.value }));
    },
    [setInstance]
  );

  const onSubmit = useCallback(() => {
    if (!validate()) return;

    onSubmitValidated();
  }, [validate, onSubmitValidated]);

  const preparedFields = useMemo(
    () =>
      fields.map((field, idx) => ({
        type: 'text',
        ...field,
        ref: createRef(),
        onChange,
        onKeyDown: (e) => {
          if (e.key === 'Enter') {
            if (idx + 1 < preparedFields.length)
              return preparedFields[idx + 1].ref.current?.focus();
            else return onSubmit();
          }
        },
      })),
    [onChange, fields, onSubmit]
  );

  const resetFields = () => {
    setMessages(emptyMessages);
    setInstance(emptyInstance);
  };

  return {
    instance,
    setInstance,
    validationMessages,
    setMessages,
    onChange,
    onSubmit,
    preparedFields,
    resetFields,
  };
};
