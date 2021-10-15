import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AutoBlurButton } from 'utils';
import { InlineIcon } from '@iconify/react';
import sync16 from '@iconify/icons-octicon/sync-16';

import { mixinSelectors } from 'rdx';
import { databaseActions } from 'rdx/database';
import { expendituresActions } from 'rdx/expenditures';

const RefreshBtn = ({ fetch = () => {}, ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(mixinSelectors.isLoading());

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
