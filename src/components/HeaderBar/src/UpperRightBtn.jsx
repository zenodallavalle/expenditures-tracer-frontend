import { useDispatch, useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';
import graph16 from '@iconify/icons-octicon/graph-16';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';

import { changedPanel, selectPanel } from 'rdx/params';
import { AutoBlurButton } from 'utils';
import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';

export const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const dispatch = useDispatch();
  const panel = useSelector(selectPanel);
  const { isLoading, isSuccess } = useAutomaticUserTokenAuthQuery();

  const showCharts = () => {
    dispatch(changedPanel('charts'));
  };

  return (
    panel !== 'user' && (
      <AutoBlurButton
        variant='outline-primary'
        disabled={isLoading || !isSuccess}
        onClick={(e) => (panel === 'months' ? showCharts(e) : onAdd(e))}
      >
        <InlineIcon icon={panel === 'months' ? graph16 : plusCircle16} />
      </AutoBlurButton>
    )
  );
};
