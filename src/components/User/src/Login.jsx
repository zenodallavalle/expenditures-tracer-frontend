import { useDispatch } from 'react-redux';
import FormControl from 'react-bootstrap/FormControl';

import {
  useAutomaticUserTokenAuthQuery,
  useLoginMutation,
} from 'api/userApiSlice';
import { changedPanel, updatedWorkingDBId } from 'rdx/params';
import {
  AutoBlurButton,
  capitalize,
  LoadingImg,
  useCreateFormFields,
} from 'utils';

import { loginFields } from './loginFields';

export const Login = ({ ...props }) => {
  const { isFetching: userIsFetching } = useAutomaticUserTokenAuthQuery();

  const [login, { isLoading: loginIsLoading, error: loginError }] =
    useLoginMutation();

  const dispatch = useDispatch();

  const disabledFields = userIsFetching || loginIsLoading;

  const onLogin = async () => {
    const response = await login(instance);
    if (response.data) {
      if (response.data?.dbs?.length === 1) {
        dispatch(updatedWorkingDBId(response.data.dbs[0]));
        return dispatch(changedPanel('prospect'));
      }
    }
    if (response.error) {
      if (response.error.data?.non_field_errors) {
        return dispatch({
          type: 'alerts/added',
          payload: {
            variant: 'danger',
            message: response.error.data.non_field_errors.join(', '),
          },
        });
      }
    }
  };

  const { instance, validationMessages, preparedFields, onSubmit } =
    useCreateFormFields({
      fields: loginFields,
      onSubmitValidated: onLogin,
    });

  return (
    <div>
      <h5 className='text-center'>Login</h5>

      {preparedFields.map(({ label, name, ...props }) => (
        <div key={`signup_parent_field_${name}`}>
          <div className='d-flex align-items-baseline py-1'>
            <div className='me-1'>{capitalize(label)}</div>
            <div className='flex-grow-1'>
              <FormControl
                key={`signup_field_${name}`}
                disabled={disabledFields}
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
          {loginError?.data?.[name]?.map((msg, idx) => (
            <div
              className='text-danger'
              key={`msg_login_response_${name}_${idx}`}
            >
              {msg}
            </div>
          ))}
        </div>
      ))}

      <AutoBlurButton
        variant='success'
        className='w-100 mt-3'
        onClick={onSubmit}
        disabled={disabledFields}
      >
        {loginIsLoading ? <LoadingImg maxWidth={25} /> : 'Login'}
      </AutoBlurButton>
    </div>
  );
};
