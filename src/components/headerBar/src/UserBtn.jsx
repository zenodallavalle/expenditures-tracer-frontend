import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AutoBlurButton, getCurrentPanel } from 'utils';
import { InlineIcon } from '@iconify/react';
import person16 from '@iconify/icons-octicon/person-16';
import package16 from '@iconify/icons-octicon/package-16';

import { mixinSelectors } from 'rdx';
import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';

const ShortUserBtn = (props) => {
  const navigate = useNavigate();
  const panel = getCurrentPanel();

  const isLoading = useSelector(mixinSelectors.isLoading());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  // const user = useSelector(userSelectors.user());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const onClick = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('panel', 'user');
    navigate(`/?${urlSearchParams.toString()}`);
  }, [navigate]);

  const color =
    !isAuthenticated && !workingDB
      ? 'danger'
      : isAuthenticated && !workingDB
      ? 'warning'
      : 'primary';
  let btnVariant = '';

  if (panel !== 'user') {
    btnVariant = btnVariant + 'outline-';
  }

  btnVariant = btnVariant + color;

  return (
    <AutoBlurButton
      variant={btnVariant}
      className='px-1 mx-1'
      onClick={onClick}
      disabled={isLoading || panel === 'user'}
    >
      <div className='d-flex flex-row'>
        <div className='mx-1'>
          <InlineIcon icon={person16} />
        </div>

        {isAuthenticated && (
          <div className='mx-1'>
            <InlineIcon icon={package16} />
          </div>
        )}
      </div>
    </AutoBlurButton>
  );
};

const LongUserBtn = (props) => {
  const navigate = useNavigate();
  const panel = getCurrentPanel();

  const isLoading = useSelector(mixinSelectors.isLoading());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const user = useSelector(userSelectors.user());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const onClick = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('panel', 'user');
    navigate(`/?${urlSearchParams.toString()}`);
  }, [navigate]);

  const color =
    !isAuthenticated && !workingDB
      ? 'danger'
      : isAuthenticated && !workingDB
      ? 'warning'
      : 'primary';
  let btnVariant = '';
  if (panel !== 'user') {
    btnVariant = btnVariant + 'outline-';
  }

  btnVariant = btnVariant + color;

  return (
    <AutoBlurButton
      variant={btnVariant}
      className='px-1 mx-1'
      onClick={onClick}
      disabled={isLoading || panel === 'user'}
    >
      <div className='d-flex flex-row'>
        <div className='mx-1'>
          <InlineIcon icon={person16} />
        </div>
        <div className='mx-1'>{user?.username || 'Please login'}</div>

        {isAuthenticated && (
          <div className='mx-1'>
            <InlineIcon icon={package16} />
          </div>
        )}
        {isAuthenticated && (
          <div className='mx-1'>{workingDB?.name || 'Choose DB'}</div>
        )}
      </div>
    </AutoBlurButton>
  );
};

const UserBtn = (props) => {
  const panel = getCurrentPanel();
  const makeItShort = panel === 'search';

  if (makeItShort) return <ShortUserBtn {...props} />;
  else return <LongUserBtn {...props} />;
};
export default UserBtn;
