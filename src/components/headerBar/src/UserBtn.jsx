import { useNavigate } from 'react-router-dom';

import { AutoBlurButton, getCurrentPanel } from 'utils';
import { InlineIcon } from '@iconify/react';
import person16 from '@iconify/icons-octicon/person-16';
import package16 from '@iconify/icons-octicon/package-16';

import { useUserTokenAuthQuery } from 'api/userApiSlice';
import { useAutomaticGetDBQuery } from 'api/dbsApiSlice';

const UserBtn = ({ ...props }) => {
  const navigate = useNavigate();
  const panel = getCurrentPanel();

  const short = panel === 'search';

  const {
    data: user,
    isFetching: isFetchingUser,
    isSuccess: isSuccessUser,
    isError: isErrorUser,
  } = useUserTokenAuthQuery();
  const {
    data: workingDB,
    isFetching: isFetchingDB,
    isSuccess: isSuccessDB,
    isError: isErrorDB,
  } = useAutomaticGetDBQuery({}, { skip: !isSuccessUser });

  const isFetching = isFetchingDB || isFetchingUser;
  const isSuccess = isSuccessDB && isSuccessUser;
  const isError = isErrorDB || isErrorUser;

  const onClick = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.set('panel', 'user');
    navigate(`/?${urlSearchParams.toString()}`);
  };

  const color = isError ? 'danger' : isSuccess ? 'primary' : 'warning';

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
      disabled={isFetching || panel === 'user'}
    >
      <div className='d-flex flex-row'>
        <div className='mx-1'>
          <InlineIcon icon={person16} />
        </div>
        {!short && (
          <div className='mx-1'>{user?.username || 'Please login'}</div>
        )}

        {isSuccessUser && (
          <div className='mx-1'>
            <InlineIcon icon={package16} />
          </div>
        )}
        {isSuccessUser && !short && (
          <div className='mx-1'>{workingDB?.name || 'Choose DB'}</div>
        )}
      </div>
    </AutoBlurButton>
  );
};

export default UserBtn;
