import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import { LoadingDiv } from 'utils';

import { AddDatabase } from './AddDatabase';
import { Database } from './Database';

export const Databases = ({ ...props }) => {
  const { data: user, isLoading } = useAutomaticUserTokenAuthQuery();

  return (
    <div>
      {isLoading ? (
        <LoadingDiv />
      ) : (
        <div>
          <div>
            {user?.dbs.map((DBId) => (
              <Database key={`database_${DBId}`} id={DBId} />
            )) || (
              <div className='text-center fst-italic'>
                No databases created yet.
              </div>
            )}
          </div>
          <AddDatabase />
        </div>
      )}
    </div>
  );
};
