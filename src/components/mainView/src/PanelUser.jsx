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

const User = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userSelectors.isLoading());
  const error = useSelector(userSelectors.error());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const user = useSelector(userSelectors.user());

  const [instance, setInstance] = useState(emptyLogin);
  const [messages, setMessages] = useState({});
  const [resMessages, setResMessages] = useState({});

  const refUsername = useRef();
  const refPassword = useRef();

  const onChange = (e) => {
    setInstance((i) => ({ ...i, [e.target.name]: e.target.value }));
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

  const validate = () => {
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

  const onLogin = async () => {
    if (validate()) {
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
      ) : (
        //user not logged in
        <div>
          <h5>Please login</h5>

          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 80 }}>Username</div>
            <div className='flex-grow-1'>
              <FormControl
                name='username'
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
