import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import { AutoBlurButton, getCurrentPanel } from 'utils';

import { userSelectors } from 'rdx/user';
import { mixinSelectors } from 'rdx';
import { useCallback } from 'react';

const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const navigate = useNavigate();
  const panel = getCurrentPanel();
  const isLoading = useSelector(mixinSelectors.isLoading());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());

  const resetWorkingMonth = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.delete('month');
    urlSearchParams.set('panel', 'prospect');
    navigate(`/?${urlSearchParams.toString()}`);
  }, [navigate]);

  return (
    panel !== 'user' && (
      <AutoBlurButton
        variant='outline-primary'
        disabled={isLoading || !isAuthenticated}
        onClick={(e) => (panel === 'months' ? resetWorkingMonth(e) : onAdd(e))}
      >
        <InlineIcon icon={panel === 'months' ? calendar16 : plusCircle16} />
      </AutoBlurButton>
    )
  );
};

export default UpperRightBtn;
