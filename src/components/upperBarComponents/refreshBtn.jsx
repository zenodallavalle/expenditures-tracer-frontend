import { useCallback } from 'react';
import { InlineIcon } from '@iconify/react';
import sync16 from '@iconify/icons-octicon/sync-16';
import Button from 'react-bootstrap/Button';

import { userSelectors } from 'rdx/user';
import { databaseSelectors, databaseActions } from 'rdx/database';
import { expendituresSelectors, expendituresActions } from 'rdx/expenditures';

import { useSelector, useDispatch } from 'react-redux';

const RefreshBtn = ({ fetch = () => {}, ...props }) => {
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(userSelectors.isLoading());
  const isLoadingDatabase = useSelector(databaseSelectors.isLoading(false));
  const isLoadingExpenditures = useSelector(
    expendituresSelectors.isLoading(false)
  );
  const isLoading = isLoadingUser || isLoadingDatabase || isLoadingExpenditures;

  const onRefresh = useCallback(async () => {
    const fullDB = await fetch();
    if (fullDB) {
      dispatch(databaseActions.dataRetrieved(fullDB));
      dispatch(expendituresActions.dataRetrieved(fullDB));
    }
  }, [fetch, dispatch]);

  return (
    <Button
      variant='outline-primary'
      className='mirror mr-1'
      onClick={onRefresh}
      disabled={isLoading}
    >
      <InlineIcon icon={sync16} className={isLoading ? 'spin' : ''} />
    </Button>
  );
};
export default RefreshBtn;
