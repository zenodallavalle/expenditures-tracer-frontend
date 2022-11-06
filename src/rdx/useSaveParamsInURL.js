const { useEffect } = require('react');
const { useSelector } = require('react-redux');
const { useNavigate } = require('react-router-dom');
const { selectParamsToSaveInURL } = require('./params');
const {
  readFromURLParams,
  readFromURLParamsDefault,
} = require('./paramsReadFromURL');

export const useSaveParamsInURL = () => {
  const navigate = useNavigate();
  const params = useSelector(selectParamsToSaveInURL);

  useEffect(() => {
    const url = new URL(window.location);
    readFromURLParams.forEach((param) => {
      if (params[param] !== undefined && params[param] !== null) {
        if (params[param] === readFromURLParamsDefault[param])
          url.searchParams.delete(param);
        else url.searchParams.set(param, params[param]);
      }
    });
    const destinationURLString = url.searchParams.toString();
    if (!destinationURLString) navigate('');
    else navigate(`?${destinationURLString}`);
  }, [params, navigate]);
};
