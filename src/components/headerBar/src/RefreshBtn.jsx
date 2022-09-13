import { InlineIcon } from '@iconify/react';
import sync16 from '@iconify/icons-octicon/sync-16';

import { useUserTokenAuthQuery } from 'api/userApiSlice';
import { useAutomaticGetDBQuery } from 'api/dbsApiSlice';
import { AutoBlurButton } from 'utils';

const RefreshBtn = ({ fetch = () => {}, ...props }) => {
  const { isFetching: isFetchingUser, isSuccess: isSuccessUser } =
    useUserTokenAuthQuery();
  const { isFetching: isFetchingDB } = useAutomaticGetDBQuery(
    {},
    { skip: !isSuccessUser }
  );

  const isFetching = isFetchingUser || isFetchingDB;

  return (
    <AutoBlurButton
      variant='outline-primary'
      className='mirror'
      // onClick={onRefresh}
      disabled={isFetching}
    >
      <InlineIcon icon={sync16} className={isFetching ? 'spin' : ''} />
    </AutoBlurButton>
  );
};
export default RefreshBtn;
