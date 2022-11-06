import { useDispatch } from 'react-redux';

import { InlineIcon } from '@iconify/react';
import sync16 from '@iconify/icons-octicon/sync-16';

import { userApiSlice, useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { AutoBlurButton } from 'utils';

export const RefreshBtn = ({ ...props }) => {
  const dispatch = useDispatch();
  const { isFetching: isFetchingUser, isSuccess: isSuccessUser } =
    useAutomaticUserTokenAuthQuery();
  const { isFetching: isFetchingDB } = useAutomaticGetFullDBQuery(
    {},
    { skip: !isSuccessUser }
  );

  const isFetching = isFetchingUser || isFetchingDB;

  const onRefreshData = () => dispatch(userApiSlice.util.resetApiState());

  return (
    <AutoBlurButton
      variant='outline-primary'
      className='mirror'
      onClick={onRefreshData}
      disabled={isFetching}
    >
      <InlineIcon icon={sync16} className={isFetching ? 'spin' : ''} />
    </AutoBlurButton>
  );
};
