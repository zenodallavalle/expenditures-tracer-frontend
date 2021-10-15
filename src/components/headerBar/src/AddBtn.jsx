import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import { AutoBlurButton, getCurrentMonth } from 'utils';

import { userSelectors } from 'rdx/user';
import { mixinSelectors } from 'rdx';
import { useCallback } from 'react';

const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { panel = 'prospect' } = useParams();
  const isLoading = useSelector(mixinSelectors.isLoading());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const currentMonth = getCurrentMonth();

  const resetWorkingMonth = useCallback(() => {
    dispatch({ type: 'localInfo/setWorkingMonth', payload: currentMonth });
    history.push(history.location.pathname.replace(`${panel}`, 'prospect'));
  }, [dispatch, history, panel]);

  return (
    panel !== 'user' && (
      <AutoBlurButton
        variant='outline-primary'
        disabled={isLoading || !isAuthenticated}
        onClick={panel === 'months' ? resetWorkingMonth : onAdd}
      >
        <InlineIcon icon={panel === 'months' ? calendar16 : plusCircle16} />
      </AutoBlurButton>
    )
  );
};

export default UpperRightBtn;
