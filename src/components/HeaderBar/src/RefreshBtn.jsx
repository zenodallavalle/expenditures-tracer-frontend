import { useDispatch } from 'react-redux';

import { InlineIcon } from '@iconify/react';

import {
  userApiSlice,
  useAutomaticUserTokenAuthQuery,
} from '/src/api/userApiSlice';
import { useAutomaticGetFullDBQuery } from '/src/api/dbApiSlice';
import { AutoBlurButton } from '/src/utils';

export const RefreshBtn = ({ ...props }) => {
  const dispatch = useDispatch();
  const { isFetching: isFetchingUser, isSuccess: isSuccessUser } =
    useAutomaticUserTokenAuthQuery();
  const { isFetching: isFetchingDB } = useAutomaticGetFullDBQuery(
    {},
    { skip: !isSuccessUser },
  );

  const isFetching = isFetchingUser || isFetchingDB;

  const onRefreshData = () => dispatch(userApiSlice.util.resetApiState());

  return (
    <AutoBlurButton
      variant="outline-primary"
      className="mirror"
      onClick={onRefreshData}
      disabled={isFetching}
    >
      <InlineIcon icon="octicon:sync-16" className={isFetching ? 'spin' : ''} />
    </AutoBlurButton>
  );
};
