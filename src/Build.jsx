import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getApiVersion } from '/src/api/versionApi';
import { AutoBlurButton, LoadingDiv } from '/src/utils';

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
      <h5 className="text-center">expenditures-tracer-frontend</h5>
      <div className="text-center mb-1">
        <span className="me-1">Running mode:</span>
        <span>{import.meta.env.NODE_ENV}</span>
      </div>
      <h5 className="text-center">API version</h5>
      {version ? (
        <>
          <div className="text-center">
            <span className="me-1">API version:</span>
            <span>{version?.api_version}</span>
          </div>
          <div className="text-center mb-5">
            <span className="me-1">Build date:</span>
            <span>{version?.version}</span>
          </div>
        </>
      ) : (
        <LoadingDiv />
      )}
      <div>
        <AutoBlurButton className="w-100" onClick={backToApp}>
          Click here to get back to the app
        </AutoBlurButton>
      </div>
    </div>
  );
};

export default Build;
