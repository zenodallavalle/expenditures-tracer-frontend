import { useDispatch, useSelector } from 'react-redux';

import { InlineIcon } from '@iconify/react';

import { useAutomaticUserTokenAuthQuery } from '/src/api/userApiSlice';
import { useAutomaticGetFullDBQuery } from '/src/api/dbApiSlice';
import { changedPanel, selectPanel } from '/src/rdx/params';
import { AutoBlurButton } from '/src/utils';

export const UserBtn = ({ ...props }) => {
  const dispatch = useDispatch();
  const panel = useSelector(selectPanel);

  const short = panel === 'search';

  const {
    data: user,
    isFetching: isFetchingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
  } = useAutomaticUserTokenAuthQuery();
  const {
    data: fullDB,
    isFetching: isFetchingDB,
    isSuccess: isSuccessDB,
    isError: isErrorDB,
  } = useAutomaticGetFullDBQuery({}, { skip: !isSuccessUser });

  const isFetching = isFetchingDB || isFetchingUser;
  const isSuccess = isSuccessDB && isSuccessUser;
  const isError = isErrorDB || isErrorUser;

  const onClick = () => dispatch(changedPanel('user'));

  const color = isError ? 'danger' : isSuccess ? 'primary' : 'warning';

  let btnVariant = '';
  if (panel !== 'user') {
    btnVariant = btnVariant + 'outline-';
  }

  btnVariant = btnVariant + color;

  return (
    <AutoBlurButton
      variant={btnVariant}
      className="px-1 mx-1"
      onClick={onClick}
      title={short ? '' : 'User'}
      disabled={isFetching || panel === 'user'}
    >
      <div className="d-flex flex-row">
        <div className="mx-1">
          <InlineIcon icon="octicon:person-16" />
        </div>
        {!short && (
          <div className="mx-1">
            {isSuccessUser ? user.username : 'Please login'}
          </div>
        )}

        {isSuccessUser && (
          <div className="mx-1">
            <InlineIcon icon="octicon:package-16" />
          </div>
        )}
        {isSuccessUser && !short && (
          <div className="mx-1">{fullDB?.name || 'Choose DB'}</div>
        )}
      </div>
    </AutoBlurButton>
  );
};
