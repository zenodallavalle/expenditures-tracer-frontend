import { useState, useRef, useEffect } from 'react';
import FormControl from 'react-bootstrap/FormControl';

import { useNewCategoryMutation } from 'api/categoryApiSlice';
import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { AutoBlurButton, LoadingImg } from 'utils';

export const AddCategory = ({ ...props }) => {
  const [isAdding, setIsAdding] = useState();

  const onCancel = () => setIsAdding();

  const onAdd = () => setIsAdding(true);

  const { isFetching: categoriesAreFetching } = useAutomaticGetFullDBQuery();

  const [createCategory, { isLoading, isSuccess, isError, error }] =
    useNewCategoryMutation();

  const [instance, setInstance] = useState({ name: '' });
  const [messages, setMessages] = useState({});

  const ref = useRef();

  const onChange = (e) =>
    setInstance({
      ...instance,
      [e.target.name]: e.target.value,
    });

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAdded();
    }
  };

  const validate = () => {
    let isValid = true;
    const messages = {};
    if (!instance.name || !instance.name.trim()) {
      messages.name = ['This field may not be blank.'];
      isValid = false;
    }
    return { isValid, messages };
  };

  const onAdded = async () => {
    const { isValid, messages } = validate();

    if (!isValid) return setMessages(messages);

    createCategory(instance);
  };

  useEffect(() => {
    // handle success and error responses
    if (isError) {
    }
    if (isSuccess) {
      setIsAdding();
    }
  }, [isError, isSuccess]);

  useEffect(() => ref.current?.focus(), []); // force focus on name form

  return (
    <div>
      {isAdding ? (
        <div>
          <div className='d-flex align-items-center'>
            <div className='d-flex flex-grow-1 align-items-baseline'>
              <div>Name</div>
              <div className='flex-grow-1 mx-2'>
                <FormControl
                  name='name'
                  value={instance.name}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  ref={ref}
                  disabled={isLoading}
                />
                {messages.name?.map((msg, idx) => (
                  <div
                    key={`NewCategory_name_msg_validation_${idx}`}
                    className='text-danger'
                  >
                    {msg}
                  </div>
                ))}
                {error?.data?.name?.map((msg, idx) => (
                  <div
                    key={`NewCategory_name_msg_response_${idx}`}
                    className='text-danger'
                  >
                    {msg}
                  </div>
                ))}
              </div>
            </div>

            <div className='d-flex align-items-baseline py-1'>
              <div className='pe-1 flex-grow-1'>
                <AutoBlurButton
                  variant='danger'
                  className='w-100'
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancel
                </AutoBlurButton>
              </div>
              <div className='ps-1 flex-grow-1'>
                <AutoBlurButton
                  variant='success'
                  className='w-100'
                  onClick={onAdded}
                  disabled={categoriesAreFetching || isLoading}
                >
                  {isLoading ? <LoadingImg maxWidth={25} /> : 'Save'}
                </AutoBlurButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AutoBlurButton className='w-100' onClick={onAdd} variant='success'>
          Add new category
        </AutoBlurButton>
      )}
    </div>
  );
};
