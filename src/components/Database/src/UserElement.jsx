import {
  useAutomaticUserTokenAuthQuery,
  useGetUserQuery,
} from 'api/userApiSlice';

import ListGroupItem from 'react-bootstrap/ListGroupItem';

import { InlineIcon } from '@iconify/react';
import xCircle16 from '@iconify/icons-octicon/x-circle-16';

import { AutoBlurTransparentButton } from 'utils';
import { UserElementLoading } from './UserElementLoading';

export const UserElement = ({ id, onExclude, ...props }) => {
  const { data: mainUser, isFetching: mainUserIsLoading } =
    useAutomaticUserTokenAuthQuery();

  const isMainUser = mainUser === undefined || id === mainUser?.id;

  const { data: user, isLoading: userIsLoading } = useGetUserQuery(
    { id },
    { skip: isMainUser }
  );

  return (
    <ListGroupItem>
      {!isMainUser && userIsLoading ? (
        <UserElementLoading />
      ) : (
        <div className='d-flex align-items-baseline'>
          <div className='flex-grow-1'>
            {(isMainUser ? mainUser?.username : user?.username) ||
              `user with id=${id}`}
          </div>
          {isMainUser ? (
            <div className='text-nowrap small fst-italic'>
              You cannot exclude yourself
            </div>
          ) : (
            <div>
              <AutoBlurTransparentButton
                onClick={() => onExclude(user.id)}
                disabled={mainUserIsLoading || userIsLoading}
              >
                <InlineIcon icon={xCircle16} />
              </AutoBlurTransparentButton>
            </div>
          )}
        </div>
      )}
    </ListGroupItem>
  );
};
