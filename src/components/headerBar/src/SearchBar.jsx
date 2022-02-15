import { useReducer, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import FormControl from 'react-bootstrap/FormControl';

import { getCurrentPanel } from 'utils';
import { userSelectors } from 'rdx/user';
import { searchSelectors, searchActions } from 'rdx/search';
import { useDispatch, useSelector } from 'react-redux';

const SearchBar = ({ ...props }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isInitial = useReducer(userSelectors.isInitial());
  const currentPanel = getCurrentPanel();

  const setPanel = useCallback(
    (to) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.set('panel', to);
      history.push(`/?${urlSearchParams.toString()}`);
    },
    [history]
  );

  const queryString = useSelector(searchSelectors.getQueryString());
  const onQueryStringChange = (e) =>
    dispatch(searchActions.parametersChanged({ queryString: e.target.value }));

  const startSearch = () => {
    if (currentPanel !== 'search') {
      setPanel('search');
    }
  };

  return (
    <div className='me-1'>
      <FormControl
        type='search'
        placeholder='Search'
        value={queryString}
        onChange={onQueryStringChange}
        onClick={startSearch}
        disabled={!isInitial}
        className='me-1'
      />
    </div>
  );
};

export default SearchBar;
