import { useDispatch } from 'react-redux';
import FormControl from 'react-bootstrap/FormControl';

import {
  useAutomaticUserTokenAuthQuery,
  useSignupMutation,
} from 'api/userApiSlice';

import {
  AutoBlurButton,
  capitalize,
  LoadingImg,
  useCreateFormFields,
} from 'utils';

import { signupFields } from './SignupFields';

export const Signup = ({ ...props }) => {
  const { isFetching: userIsFetching } = useAutomaticUserTokenAuthQuery();

  const [signup, { isLoading: signupIsLoading, error: signupError }] =
    useSignupMutation();

  const dispatch = useDispatch();

  const disabledFields = userIsFetching || signupIsLoading;

  const onSignup = async () => {
    const response = await signup(instance);
    if (response.error) {
      if (response.error.data?.non_field_errors) {
        dispatch({
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
    useCreateFormFields({ fields: signupFields, onSubmitValidated: onSignup });

  return (
    <div>
      <h5 className='text-center'>Signup</h5>
      {preparedFields.map(({ label, name, ...props }, idx) => (
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
              key={`msg_signup_validation_${name}_${idx}`}
            >
              {msg}
            </div>
          ))}
          {signupError?.data?.[name]?.map((msg, idx) => (
            <div
              className='text-danger'
              key={`msg_signup_response_${name}_${idx}`}
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
        {signupIsLoading ? <LoadingImg maxWidth={25} /> : 'Signup'}
      </AutoBlurButton>
    </div>
  );
};
