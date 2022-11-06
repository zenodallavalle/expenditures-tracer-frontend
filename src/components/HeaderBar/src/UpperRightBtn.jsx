import { useDispatch, useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';
import calendar16 from '@iconify/icons-octicon/calendar-16';

import { changedPanel, selectPanel, updatedWorkingMonth } from 'rdx/params';
import { AutoBlurButton, getCurrentMonth } from 'utils';
import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';

export const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const dispatch = useDispatch();
  const panel = useSelector(selectPanel);
  const { isLoading, isSuccess } = useAutomaticUserTokenAuthQuery();

  const resetWorkingMonth = () => {
    dispatch(updatedWorkingMonth(getCurrentMonth()));
    dispatch(changedPanel('prospect'));
  };

  return (
    panel !== 'user' && (
      <AutoBlurButton
        variant='outline-primary'
        disabled={isLoading || !isSuccess}
        onClick={(e) => (panel === 'months' ? resetWorkingMonth(e) : onAdd(e))}
      >
        <InlineIcon icon={panel === 'months' ? calendar16 : plusCircle16} />
      </AutoBlurButton>
    )
  );
};
