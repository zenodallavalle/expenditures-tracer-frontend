import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AutoBlurButton } from 'utils';
import { InlineIcon } from '@iconify/react';
import person16 from '@iconify/icons-octicon/person-16';
import package16 from '@iconify/icons-octicon/package-16';

import { mixinSelectors } from 'rdx';
import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';
import { localInfoActions, localInfoSelectors } from 'rdx/localInfo';

const UserBtn = (props) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(mixinSelectors.isLoading());
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const user = useSelector(userSelectors.user());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const onClick = useCallback(
    () => dispatch(localInfoActions.panelChanged('user')),
    [dispatch]
  );

  const color =
    !isAuthenticated && !workingDB
      ? 'danger'
      : isAuthenticated && !workingDB
      ? 'warning'
      : 'primary';
  let btnVariant = '';
  if (currentPanel !== 'user') {
    btnVariant = btnVariant + 'outline-';
  }

  btnVariant = btnVariant + color;

  return (
    <AutoBlurButton
      variant={btnVariant}
      className='px-1 mx-1'
      onClick={onClick}
      disabled={isLoading || currentPanel === 'user'}
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
export default UserBtn;
