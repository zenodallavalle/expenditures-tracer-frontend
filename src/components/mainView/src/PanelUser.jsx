import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import { userApi } from 'api';
import { AutoBlurButton, LoadingDiv, LoadingImg } from 'utils';
import { userSelectors } from 'rdx/user';

import Database, { AddDatabase } from './Database';
import { usersSelectors } from 'rdx/users';
import {
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUserTokenAuthQuery,
} from 'api/userApiSlice';
import { changedPanel, updatedWorkingDBId } from 'rdx/params';

let columnWidth = parseInt(process.env.REACT_APP_COL_WIDTH);
if (isNaN(columnWidth)) {
  columnWidth = 500;
}

const emptyLogin = { username: '', password: '' };
const emptySignup = { username: '', email: '', password: '' };

const User = ({ ...props }) => {
  const {
    data: user,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useUserTokenAuthQuery();

  const [login, { error: errorLogin }] = useLoginMutation();
  const [logout, _] = useLogoutMutation();
  const [signup, { error: errorSignup }] = useSignupMutation();

  const dispatch = useDispatch();
  // const isLoading = useSelector(userSelectors.isLoading());
  // const error = useSelector(userSelectors.error());
  // const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  // const user = useSelector(userSelectors.user());

  const [showLogin, setShowLogin] = useState(true);
  const [instance, setInstance] = useState(emptyLogin);
  const [signupInstance, setSignupInstance] = useState(emptySignup);
  const [messages, setMessages] = useState({});
  const [signupMessages, setSignupMessages] = useState({});

  const refUsername = useRef();
  const refPassword = useRef();

  const refSignupUsername = useRef();
  const refSignupEmail = useRef();
  const refSignupPassword = useRef();

  const onChange = (e) => {
    setInstance((i) => ({ ...i, [e.target.name]: e.target.value }));
  };

  const onSignupChange = (e) => {
    setSignupInstance((i) => ({ ...i, [e.target.name]: e.target.value }));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'username') {
        refPassword.current?.focus();
      } else {
        onLogin();
      }
    }
  };

  const onSignupKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'username') {
        refSignupEmail.current?.focus();
      } else if (e.target.name === 'email') {
        refSignupPassword.current?.focus();
      } else {
        onSignup();
      }
    }
  };

  const validateLogin = () => {
    let isValid = true;
    let messages = {};
    Object.entries(instance).forEach(([k, v]) => {
      if (!v || !v.trim()) {
        messages[k] = 'This field is required';
        isValid = false;
      }
    });
    setMessages(messages);
    return isValid;
  };

  const validateSignup = () => {
    let isValid = true;
    let messages = {};
    Object.entries(signupInstance).forEach(([k, v]) => {
      if (!v || !v.trim()) {
        messages[k] = 'This field is required';
        isValid = false;
      } else if (k === 'email') {
        if (
          !v
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
          messages[k] = 'Invalid email';
          isValid = false;
        }
      }
    });
    setSignupMessages(messages);
    return isValid;
  };

  const onSignup = async () => {
    if (validateSignup()) {
      const response = await signup(signupInstance);
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
    }
  };

  const onLogin = async () => {
    if (validateLogin()) {
      const response = await login(instance);
      if (response.data) {
        if (response.data.dbs.length === 1) {
          dispatch(updatedWorkingDBId(response.data.dbs[0]));
          dispatch(changedPanel('prospect'));
        }
      }
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
    }
  };

  const onLogout = () => {
    // dispatch(userApi.logout());
    // dispatch({ type: 'database/dataErased' });
    // dispatch({ type: 'expenditures/dataErased' });
    // dispatch({ type: 'users/dataErased' });
    logout();
    dispatch({
      type: 'alerts/added',
      payload: { variant: 'success', message: 'User logged out.' },
    });
  };

  const retrieveUserData = useCallback(
    async (ids) => ids.length > 0 && dispatch(userApi.getByIds({ ids })),
    [dispatch]
  );

  const usersToLoadIds = useMemo(
    () => [
      ...new Set(
        user
          ? user.dbs
              .map((db) => db.users)
              .reduce((acc, users) => [...acc, ...users], [])
          : []
      ),
    ],
    [user]
  );

  const loadedUsersIds = useSelector(usersSelectors.getIds());

  useEffect(
    () =>
      retrieveUserData(
        usersToLoadIds.filter((id) => loadedUsersIds.indexOf(id) === -1)
      ),
    [usersToLoadIds, loadedUsersIds, retrieveUserData]
  );

  return (
    <div className='mx-auto' style={{ maxWidth: columnWidth }}>
      {isLoading ? (
        <LoadingDiv maxWidth={100} />
      ) : isSuccess ? (
        //user logged in
        <div>
          <h5 className='text-center'>Databases</h5>
          {user?.dbs.length > 0 ? (
            user.dbs.map((db) => <Database key={`db_${db.id}`} id={db.id} />)
          ) : (
            <div className='text-center fst-italic'>
              No databases created yet
            </div>
          )}

          <AddDatabase />
          <div className='w-100 pt-5'>
            <AutoBlurButton
              variant='primary'
              className='w-100'
              onClick={onLogout}
              disabled={isFetching}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Logout'}
            </AutoBlurButton>
          </div>
        </div>
      ) : //user not logged in
      showLogin ? (
        <div>
          <h5>Login</h5>
          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 80 }}>Username</div>
            <div className='flex-grow-1'>
              <FormControl
                name='username'
                id='login_username'
                value={instance.username}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refUsername}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages?.username && (
            <div className='text-danger'>{messages.username} </div>
          )}
          {errorLogin?.data?.username?.map((msg, idx) => (
            <div className='text-danger' key={`msg_login_username_${idx}`}>
              {msg}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 80 }}>Password</div>
            <div className='flex-grow-1'>
              <FormControl
                type='password'
                name='password'
                id='login_password'
                value={instance.password}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refPassword}
                disabled={isLoading}
              />
            </div>
          </div>

          {errorLogin?.data?.password?.map((msg, idx) => (
            <div className='text-danger' key={`msg_login_password_${idx}`}>
              {msg}
            </div>
          ))}

          <div className='w-100 pt-3'>
            <AutoBlurButton
              variant='success'
              className='w-100'
              onClick={onLogin}
              disabled={isFetching}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Login'}
            </AutoBlurButton>
          </div>

          <h5 className='mt-4'>Don't have an account?</h5>
          <div className='w-100 pt-3'>
            <AutoBlurButton
              className='w-100'
              onClick={() => setShowLogin(false)}
              disabled={isFetching}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Signup for free now'}
            </AutoBlurButton>
          </div>
        </div>
      ) : (
        <div>
          <h5>Signup</h5>
          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 80 }}>Username</div>
            <div className='flex-grow-1'>
              <FormControl
                name='username'
                id='signup_username'
                value={signupInstance.username}
                onChange={onSignupChange}
                onKeyDown={onSignupKeyDown}
                ref={refSignupUsername}
                disabled={isLoading}
              />
            </div>
          </div>
          {signupMessages?.username && (
            <div className='text-danger'>{signupMessages.username} </div>
          )}
          {errorSignup?.data?.username?.map((msg, idx) => (
            <div className='text-danger' key={`msg_login_username_${idx}`}>
              {msg}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 80 }}>Email</div>
            <div className='flex-grow-1'>
              <FormControl
                name='email'
                id='signup_email'
                value={signupInstance.email}
                onChange={onSignupChange}
                onKeyDown={onSignupKeyDown}
                ref={refSignupEmail}
                disabled={isLoading}
              />
            </div>
          </div>
          {signupMessages?.email && (
            <div className='text-danger'>{signupMessages.email} </div>
          )}
          {errorSignup?.data?.email?.map((msg, idx) => (
            <div className='text-danger' key={`msg_login_email_${idx}`}>
              {msg}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 80 }}>Password</div>
            <div className='flex-grow-1'>
              <FormControl
                type='password'
                name='password'
                id='signup_password'
                value={signupInstance.password}
                onChange={onSignupChange}
                onKeyDown={onSignupKeyDown}
                ref={refSignupPassword}
                disabled={isLoading}
              />
            </div>
          </div>
          {signupMessages?.password && (
            <div className='text-danger'>{signupMessages.password} </div>
          )}
          {errorSignup?.data?.password?.map((msg, idx) => (
            <div className='text-danger' key={`msg_login_password_${idx}`}>
              {msg}
            </div>
          ))}

          <div className='w-100 pt-3'>
            <AutoBlurButton
              variant='success'
              className='w-100'
              onClick={onSignup}
              disabled={isFetching}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Signup'}
            </AutoBlurButton>
          </div>

          <h5 className='mt-4'>Already have an account?</h5>
          <div className='w-100 pt-3'>
            <AutoBlurButton
              className='w-100'
              onClick={() => setShowLogin(true)}
              disabled={isFetching}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Login'}
            </AutoBlurButton>
          </div>
        </div>
      )}
      <div>
        <div className='text-center mt-4'>
          <Link to='/build/'>More info about this version...</Link>
        </div>
      </div>
    </div>
  );
};

export default User;
