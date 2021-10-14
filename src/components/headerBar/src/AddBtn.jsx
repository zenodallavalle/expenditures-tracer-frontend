import { InlineIcon } from '@iconify/react';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import { AutoBlurButton, getCurrentMonth } from 'utils';

import { userSelectors } from 'rdx/user';

import { useSelector, useDispatch } from 'react-redux';
import { localInfoSelectors } from 'rdx/localInfo';
import { mixinSelectors } from 'rdx';

const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(mixinSelectors.isLoading());
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const currentMonth = getCurrentMonth();

  const resetWorkingMonth = () => {
    dispatch({ type: 'localInfo/setWorkingMonth', payload: currentMonth });
    dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
  };

  return (
    currentPanel !== 'user' && (
      <AutoBlurButton
        variant='outline-primary'
        disabled={isLoading || !isAuthenticated}
        onClick={currentPanel === 'months' ? resetWorkingMonth : onAdd}
      >
        <InlineIcon
          icon={currentPanel === 'months' ? calendar16 : plusCircle16}
        />
      </AutoBlurButton>
    )
  );
};

export default UpperRightBtn;
