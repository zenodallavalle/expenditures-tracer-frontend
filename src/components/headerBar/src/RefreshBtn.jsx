import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AutoBlurButton } from 'utils';
import { InlineIcon } from '@iconify/react';
import sync16 from '@iconify/icons-octicon/sync-16';

import { databaseActions, databaseSelectors } from 'rdx/database';
import { expendituresActions, expendituresSelectors } from 'rdx/expenditures';
import { userSelectors } from 'rdx/user';

const RefreshBtn = ({ fetch = () => {}, ...props }) => {
  const dispatch = useDispatch();
  const userIsLoading = useSelector(userSelectors.isLoading());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const databaseIsLoading = useSelector(databaseSelectors.isLoading());
  const expendituresAreLoading = useSelector(expendituresSelectors.isLoading());
  const isLoading = isAuthenticated
    ? userIsLoading || databaseIsLoading || expendituresAreLoading
    : userIsLoading;

  const onRefresh = useCallback(async () => {
    const fullDB = await fetch();
    if (fullDB) {
      dispatch(databaseActions.dataRetrieved(fullDB));
      dispatch(expendituresActions.dataRetrieved(fullDB));
    }
  }, [fetch, dispatch]);

  return (
    <AutoBlurButton
      variant='outline-primary'
      className='mirror'
      onClick={onRefresh}
      disabled={isLoading}
    >
      <InlineIcon icon={sync16} className={isLoading ? 'spin' : ''} />
    </AutoBlurButton>
  );
};
export default RefreshBtn;
