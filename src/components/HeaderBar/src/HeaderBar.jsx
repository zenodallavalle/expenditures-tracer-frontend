import { useSelector } from 'react-redux';

import { selectPanel } from 'rdx/params';

import { RefreshBtn } from './RefreshBtn';
import { UserBtn } from './UserBtn';
import { UpperRightBtn } from './UpperRightBtn';
import { SearchBar } from './SearchBar';

export const HeaderBar = ({ onAdd = () => {}, ...props }) => {
  const currentPanel = useSelector(selectPanel);
  const showSearchBar = !['user', 'months'].includes(currentPanel);

  return (
    <div className='fixed-top bg-white safe-fixed-x safe-fixed-top'>
      <div className='d-flex m-1'>
        <div className={!showSearchBar ? 'flex-grow-1' : ''}>
          <div className='d-flex'>
            <div>
              <RefreshBtn />
            </div>
            <div className='text-nowrap'>
              <UserBtn />
            </div>
          </div>
        </div>
        {showSearchBar && (
          <div className='flex-grow-1'>
            <SearchBar />
          </div>
        )}
        <div>
          <UpperRightBtn onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
};
