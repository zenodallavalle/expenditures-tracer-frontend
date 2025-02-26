import { getApiVersion } from 'api/versionApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AutoBlurButton, LoadingDiv } from 'utils';

const Build = () => {
  const navigate = useNavigate();
  const backToApp = () => {
    navigate('/');
  };
  const [version, setVersion] = useState();
  useEffect(() => {
    async function getData() {
      setVersion(await getApiVersion());
    }
    getData();
  }, []);

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
      <div className='text-center mb-5'>
        <span className='me-1'>Build date:</span>
        <span>{new Date().toLocaleString()}</span>
      </div>
      <h5 className='text-center'>API version</h5>
      {version ? (
        <>
          <div className='text-center'>
            <span className='me-1'>API version:</span>
            <span>{version?.api_version}</span>
          </div>
          <div className='text-center mb-5'>
            <span className='me-1'>Build date:</span>
            <span>{version?.version}</span>
          </div>
        </>
      ) : (
        <LoadingDiv />
      )}
      <div>
        <AutoBlurButton className='w-100' onClick={backToApp}>
          Click here to get back to the app
        </AutoBlurButton>
      </div>
    </div>
  );
};

export default Build;
