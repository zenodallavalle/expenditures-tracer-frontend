import React from 'react';
import RefreshBtn from './upperBarComponents/refreshBtn';
import UserBtn from './upperBarComponents/userBtn';
import UpperRightBtn from './upperBarComponents/upperRightBtn';
// import BackBtn from './upperBarComponents/backBtn';

const UpperBar = ({ fetch = () => {}, onAdd = () => {}, ...props }) => {
  return (
    <div className='fixed-top bg-white safe-fixed-x safe-fixed-top'>
      <div className='row m-0 p-1'>
        <div className='col-9 text-left p-0'>
          <RefreshBtn fetch={fetch} />
          <UserBtn />
        </div>
        <div className='col-3 text-right p-0'>
          <UpperRightBtn onAdd={onAdd} />
        </div>
      </div>
    </div>
  );
};

export default UpperBar;
