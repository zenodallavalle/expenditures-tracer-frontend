import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';

import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import {
  changedPanel,
  changedSearchParams,
  selectPanel,
  selectSearchParams,
} from 'rdx/params';

export const SearchBar = ({ ...props }) => {
  const dispatch = useDispatch();

  const { queryString = '' } = useSelector(selectSearchParams);

  const currentPanel = useSelector(selectPanel);

  const previousPanelRef = useRef(currentPanel);

  const { isError: userNotAuthenticated } = useAutomaticUserTokenAuthQuery();

  const changePanel = (to) => dispatch(changedPanel(to));

  const ref = useRef();

  const updatePanel = () => {
    const query = ref.current.value;
    if (query === '' && currentPanel === 'search') {
      changePanel(previousPanelRef.current);
    } else if (query !== '' && currentPanel !== 'search') {
      previousPanelRef.current = currentPanel;
      changePanel('search');
    }
  };

  const updateSearchQuery = () => {
    const queryString = ref.current?.value?.trim() || undefined;
    dispatch(changedSearchParams({ queryString }));
  };

  const onFocus = () => {
    previousPanelRef.current = currentPanel;
    changePanel('search');
  };

  const onChange = () => {
    const query = ref.current.value.trim();
    updatePanel();
    updateSearchQuery();
    if (query === '') {
      ref.current.blur();
    }
  };

  return (
    <div className='me-1'>
      <FormControl
        defaultValue={queryString}
        type='search'
        placeholder='Search'
        ref={ref}
        onChange={onChange}
        onFocus={onFocus}
        disabled={userNotAuthenticated}
        className='me-1'
      />
    </div>
  );
};
