import RefreshBtn from './RefreshBtn';
import UserBtn from './UserBtn';
import AddBtn from './AddBtn';
import SearchBar from './SearchBar';
import { getCurrentPanel } from 'utils';
// import BackBtn from './upperBarComponents/backBtn';

const UpperBar = ({ fetch = () => {}, onAdd = () => {}, ...props }) => {
  const currentPanel = getCurrentPanel();
  const showSearchBar = !['user', 'months'].includes(currentPanel);
  return (
    <div className='fixed-top bg-white safe-fixed-x safe-fixed-top'>
      <div className='d-flex m-1'>
        <div className={!showSearchBar ? 'flex-grow-1' : ''}>
          <div className='d-flex'>
            <div>
              <RefreshBtn
              // fetch={fetch}
              />
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
          <AddBtn onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
};

export default UpperBar;
