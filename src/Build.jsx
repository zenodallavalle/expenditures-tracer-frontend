import { useHistory } from 'react-router-dom';

import { AutoBlurButton } from 'utils';

const Build = () => {
  const history = useHistory();
  const backToApp = () => {
    history.push('/');
  };
  return (
    <div>
      <h5 className='text-center'>{process.env.REACT_APP_NAME}</h5>
      <div className='text-center mb-1'>
        <span className='me-1'>Running mode:</span>
        <span>{process.env.NODE_ENV}</span>
      </div>
      <div className='text-center mb-1'>
        <span className='me-1'>Build version:</span>
        <span>{process.env.REACT_APP_VERSION}</span>
      </div>
      <div className='text-center mb-3'>
        <span className='me-1'>Build date:</span>
        <span>01-01-2022</span>
      </div>
      <div>
        <AutoBlurButton className='w-100' onClick={backToApp}>
          Click here to get back to the app
        </AutoBlurButton>
      </div>
    </div>
  );
};

export default Build;
