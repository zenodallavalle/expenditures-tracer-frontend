import { useDispatch, useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';

import { changedPanel, selectPanel } from '/src/rdx/params';
import { AutoBlurButton } from '/src/utils';
import { useAutomaticUserTokenAuthQuery } from '/src/api/userApiSlice';

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
        variant="outline-primary"
        disabled={isLoading || !isSuccess}
        onClick={(e) => (panel === 'months' ? showCharts(e) : onAdd(e))}
      >
        <InlineIcon
          icon={
            panel === 'months' ? 'octicon:graph-16' : 'octicon:plus-circle-16'
          }
        />
      </AutoBlurButton>
    )
  );
};
