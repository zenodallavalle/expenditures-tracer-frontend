import { useCallback } from 'react';
import { InlineIcon } from '@iconify/react';
import person16 from '@iconify/icons-octicon/person-16';
import package16 from '@iconify/icons-octicon/package-16';
import Button from 'react-bootstrap/Button';

import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';
import { expendituresSelectors } from 'rdx/expenditures';

import { useSelector, useDispatch } from 'react-redux';
import { localInfoActions, localInfoSelectors } from 'rdx/localInfo';

const UserBtn = (props) => {
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(userSelectors.isLoading());
  const isLoadingDatabase = useSelector(databaseSelectors.isLoading(false));
  const isLoadingExpenditures = useSelector(
    expendituresSelectors.isLoading(false)
  );
  const isLoading = isLoadingUser || isLoadingDatabase || isLoadingExpenditures;
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const user = useSelector(userSelectors.user());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const onClick = useCallback(
    () => dispatch(localInfoActions.panelChanged('user')),
    [dispatch]
  );
  return (
    <Button
      variant={
        'outline-' + (isAuthenticated && workingDB ? 'primary' : 'danger')
      }
      className='mr-1'
      onClick={onClick}
      disabled={isLoading || currentPanel === 'user'}
    >
      <>
        <InlineIcon icon={person16} />
        {isAuthenticated ? (
          <>
            <span className='mx-1'>{user.username}</span>
            <InlineIcon icon={package16} />
            {workingDB ? (
              <span className='ml-1'>{workingDB.name}</span>
            ) : (
              <span className='ml-1'>{'Choose DB'}</span>
            )}
          </>
        ) : (
          <span className='ml-1'>{'Please login'}</span>
        )}
      </>
    </Button>
  );
};
export default UserBtn;
