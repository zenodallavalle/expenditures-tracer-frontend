import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FormControl from 'react-bootstrap/FormControl';
import Alert from 'react-bootstrap/Alert';

import { userApi } from 'api';
import { AutoBlurButton, LoadingDiv, LoadingImg } from 'utils';
import { userSelectors } from 'rdx/user';

import Database, { AddDatabase } from './Database';

const emptyLogin = { username: '', password: '' };
const emptySignup = { username: '', email: '', password: '' };

const User = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userSelectors.isLoading());
  const error = useSelector(userSelectors.error());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const user = useSelector(userSelectors.user());

  const [showLogin, setShowLogin] = useState(true);
  const [instance, setInstance] = useState(emptyLogin);
  const [signupInstance, setSignupInstance] = useState(emptySignup);
  const [messages, setMessages] = useState({});
  const [signupMessages, setSignupMessages] = useState({});
  const [resMessages, setResMessages] = useState({});
  const [resSignupMessages, setResSignupMessages] = useState({});

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

  const onSignupKeyDown = (e) => {};

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
      setResMessages({});
      const action = await dispatch(userApi.signup({ ...signupInstance }));
      const json = action.payload;
      const { response } = action.meta;
      if (response) {
        if (response.ok) {
          setSignupInstance(emptySignup);
        } else {
          setResSignupMessages(json);
          if (json.non_field_errors) {
            dispatch({
              type: 'alerts/added',
              payload: {
                variant: 'danger',
                message: json.non_field_errors.join(', '),
              },
            });
          }
        }
      }
    }
  };

  const onLogin = async () => {
    if (validateLogin()) {
      setResMessages({});
      const action = await dispatch(userApi.login({ ...instance }));
      const json = action.payload;
      const { response } = action.meta;
      if (response) {
        if (response.ok) {
          setInstance(emptyLogin);
        } else {
          setResMessages(json);
          if (json.non_field_errors) {
            dispatch({
              type: 'alerts/added',
              payload: {
                variant: 'danger',
                message: json.non_field_errors.join(', '),
              },
            });
          }
        }
      }
    }
  };

  const onLogout = () => {
    dispatch(userApi.logout());
    dispatch({ type: 'database/dataErased' });
    dispatch({ type: 'expenditures/dataErased' });
    dispatch({
      type: 'alerts/added',
      payload: { variant: 'success', message: 'User logged out.' },
    });
  };

  return (
    <div>
      {error && <Alert variant='danger'>{error}</Alert>}
      {isAuthenticated ? (
        //user logged in
        <div>
          <h5 className='text-center'>Databases</h5>
          {!user?.dbs.length ? (
            isLoading ? (
              <LoadingDiv maxWidth={100} />
            ) : (
              <div className='text-center fst-italic'>
                No databases created yet
              </div>
            )
          ) : (
            user.dbs.map((db) => <Database key={`db_${db.id}`} id={db.id} />)
          )}

          <AddDatabase />
          <div className='w-100 pt-5'>
            <AutoBlurButton
              variant='primary'
              className='w-100'
              onClick={onLogout}
              disabled={isLoading}
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
          {resMessages?.username &&
            resMessages.username.map((msg, idx) => (
              <div className='text-danger' key={`msg_login_username_${idx}`}>
                {msg}{' '}
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
          {messages?.password && (
            <div className='text-danger'>{messages.password} </div>
          )}
          {resMessages?.password &&
            resMessages.password.map((msg, idx) => (
              <div className='text-danger' key={`msg_login_pwd_${idx}`}>
                {msg}{' '}
              </div>
            ))}

          <div className='w-100 pt-3'>
            <AutoBlurButton
              variant='success'
              className='w-100'
              onClick={onLogin}
              disabled={isLoading}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Login'}
            </AutoBlurButton>
          </div>

          <h5 className='mt-4'>Don't have an account?</h5>
          <div className='w-100 pt-3'>
            <AutoBlurButton
              className='w-100'
              onClick={() => setShowLogin(false)}
              disabled={isLoading}
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
          {resSignupMessages?.username &&
            resSignupMessages.username.map((msg, idx) => (
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
          {resSignupMessages?.email &&
            resSignupMessages.email.map((msg, idx) => (
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
          {resSignupMessages?.password &&
            resSignupMessages.password.map((msg, idx) => (
              <div className='text-danger' key={`msg_login_pwd_${idx}`}>
                {msg}
              </div>
            ))}

          <div className='w-100 pt-3'>
            <AutoBlurButton
              variant='success'
              className='w-100'
              onClick={onSignup}
              disabled={isLoading}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Signup'}
            </AutoBlurButton>
          </div>

          <h5 className='mt-4'>Already have an account?</h5>
          <div className='w-100 pt-3'>
            <AutoBlurButton
              className='w-100'
              onClick={() => setShowLogin(true)}
              disabled={isLoading}
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
