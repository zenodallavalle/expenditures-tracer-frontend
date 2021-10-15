import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { InlineIcon } from '@iconify/react';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import { AutoBlurButton } from 'utils';

import { userSelectors } from 'rdx/user';
import { mixinSelectors } from 'rdx';
import { useCallback } from 'react';

const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const history = useHistory();
  const { panel = 'prospect' } = useParams();
  const isLoading = useSelector(mixinSelectors.isLoading());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());

  const resetWorkingMonth = useCallback(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    urlSearchParams.delete('month');
    history.push(
      history.location.pathname.replace('months', 'prospect') +
        `?${urlSearchParams.toString()}`
    );
  }, [history]);

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
