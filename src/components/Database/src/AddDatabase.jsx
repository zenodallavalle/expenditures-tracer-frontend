import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormControl from 'react-bootstrap/FormControl';

import { useNewDBMutation } from 'api/dbApiSlice';
import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import { updatedWorkingDBId } from 'rdx/params';
import {
  capitalize,
  LoadingImg,
  AutoBlurButton,
  useCreateFormFields,
} from 'utils';

import { databaseFields } from './databaseFields';

export const AddDatabase = ({ ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: user, isFetching: isFetchingUser } =
    useAutomaticUserTokenAuthQuery();

  const [newDB, { isLoading: newDBIsLoading, error: newDBError }] =
    useNewDBMutation();
  const isFetching = isFetchingUser || newDBIsLoading;
  const dbsCount = user?.dbs.length;

  const [isAdding, setIsAdding] = useState(false);

  const onAdd = () => setIsAdding(true);

  const onCancel = () => {
    setIsAdding(false);
  };

  const onAdded = async () => {
    const response = await newDB({ name: instance.name });
    if (response.data) {
      resetFields();
      setIsAdding(false);
      if (dbsCount === 0) {
        dispatch(updatedWorkingDBId(response.data.id));
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.delete('month');
        urlSearchParams.set('panel', 'prospect');
        navigate(`/?${urlSearchParams.toString()}`);
      }
    } else if (response.error) {
      dispatch({
        type: 'alerts/added',
        payload: {
          variant: 'danger',
          message: 'Error while creating new DB.',
        },
      });
    }
  };

  const {
    instance,
    validationMessages,
    preparedFields,
    onSubmit,
    resetFields,
  } = useCreateFormFields({
    fields: databaseFields,
    onSubmitValidated: onAdded,
  });

  const firstFieldRef = preparedFields[0].current;

  useEffect(() => {
    if (isAdding) {
      firstFieldRef?.focus();
    }
  }, [isAdding, firstFieldRef]);

  return (
    <div className='py-1'>
      {isAdding ? (
        <div>
          <h5 className='text-center'>Create new database</h5>

          {preparedFields.map(({ label, name, ...props }) => (
            <div key={`signup_parent_field_${name}`}>
              <div className='d-flex align-items-baseline py-1'>
                <div className='me-1'>{capitalize(label)}</div>
                <div className='flex-grow-1'>
                  <FormControl
                    key={`signup_field_${name}`}
                    disabled={newDBIsLoading}
                    name={name}
                    {...props}
                  />
                </div>
              </div>
              {validationMessages[name].map((msg, idx) => (
                <div
                  className='text-danger'
                  key={`msg_login_validation_${name}_${idx}`}
                >
                  {msg}
                </div>
              ))}
              {newDBError?.data?.[name]?.map((msg, idx) => (
                <div
                  className='text-danger'
                  key={`msg_login_response_${name}_${idx}`}
                >
                  {msg}
                </div>
              ))}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-1'>
            <div className='pe-1 flex-grow-1'>
              <AutoBlurButton
                variant='danger'
                className='w-100'
                onClick={onCancel}
                disabled={isFetching}
              >
                Cancel
              </AutoBlurButton>
            </div>
            <div className='ps-1 flex-grow-1'>
              <AutoBlurButton
                variant='success'
                className='w-100'
                onClick={onSubmit}
                disabled={isFetching}
              >
                {newDBIsLoading ? <LoadingImg maxWidth={25} /> : 'Save'}
              </AutoBlurButton>
            </div>
          </div>
        </div>
      ) : (
        <AutoBlurButton className='w-100' onClick={onAdd} variant='success'>
          Create new database
        </AutoBlurButton>
      )}
    </div>
  );
};
