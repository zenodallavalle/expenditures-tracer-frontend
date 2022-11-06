import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  useAutomaticUserTokenAuthQuery,
  useLogoutMutation,
} from 'api/userApiSlice';
import { Databases } from 'components/Database';
import { AutoBlurButton, getColumnWidth, LoadingImg } from 'utils';

import { Login } from './Login';
import { Signup } from './Signup';

export const PanelUser = ({ ...props }) => {
  const {
    isLoading,
    isFetching,
    isSuccess: isAuthenticated,
  } = useAutomaticUserTokenAuthQuery();

  const [showLogin, setShowLogin] = useState(true);

  const onToggleShowLogin = () => setShowLogin((s) => !s);

  const dispatch = useDispatch();

  const [logout] = useLogoutMutation();

  const onLogout = () => {
    logout();
    dispatch({
      type: 'alerts/added',
      payload: { variant: 'success', message: 'User logged out.' },
    });
  };

  return (
    <div>
      <div className='mx-auto' style={{ maxWidth: getColumnWidth() }}>
        {isAuthenticated ? (
          //user logged in
          <div>
            <h5 className='text-center'>Databases</h5>

            <Databases />

            <AutoBlurButton
              variant='primary'
              className='w-100 mt-3'
              onClick={onLogout}
              disabled={isFetching}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Logout'}
            </AutoBlurButton>
          </div>
        ) : (
          //user not logged in
          <div>
            {showLogin ? <Login /> : <Signup />}
            <AutoBlurButton
              variant='link'
              className='mt-3 w-100'
              onClick={onToggleShowLogin}
            >
              {showLogin
                ? "Don't have an account? Signup for free now!"
                : 'Already have an account? Login!'}
            </AutoBlurButton>
          </div>
        )}
      </div>
      <div className='text-center mt-5'>
        <Link to='/build/'>More info about this version...</Link>
      </div>
    </div>
  );
};
