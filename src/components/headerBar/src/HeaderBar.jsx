import RefreshBtn from './RefreshBtn';
import UserBtn from './UserBtn';
import AddBtn from './AddBtn';
// import BackBtn from './upperBarComponents/backBtn';

const UpperBar = ({ fetch = () => {}, onAdd = () => {}, ...props }) => {
  return (
    <div className='fixed-top bg-white safe-fixed-x safe-fixed-top'>
      <div className='d-flex m-1'>
        <div className='flex-grow-1'>
          <div className='d-flex'>
            <div>
              <RefreshBtn fetch={fetch} />
            </div>
            <div>
              <UserBtn />
            </div>
          </div>
        </div>
        <div>
          <AddBtn onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
};

export default UpperBar;
