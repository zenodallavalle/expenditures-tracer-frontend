import { useCallback } from 'react';
import { InlineIcon } from '@iconify/react';
import arrowLeft16 from '@iconify/icons-octicon/arrow-left-16';
import Button from 'react-bootstrap/Button';

import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';
import { expendituresSelectors } from 'rdx/expenditures';

import { useSelector, useDispatch } from 'react-redux';
import { panelActions, panelSelectors } from 'rdx/localInfo';

const BackBtn = (props) => {
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(userSelectors.isLoading());
  const isLoadingDatabase = useSelector(databaseSelectors.isLoading(false));
  const isLoadingExpenditures = useSelector(
    expendituresSelectors.isLoading(false)
  );
  const isLoading = isLoadingUser || isLoadingDatabase || isLoadingExpenditures;
  const previousPanel = useSelector(panelSelectors.getPreviousPanel());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const onBack = useCallback(
    () => dispatch(panelActions.changed(previousPanel)),
    [dispatch, previousPanel]
  );
  return previousPanel && isAuthenticated && previousPanel !== 'loading' ? (
    <Button
      variant='outline-primary'
      onClick={onBack}
      disabled={
        isLoading ||
        !previousPanel ||
        previousPanel === 'loading' ||
        !isAuthenticated
      }
    >
      <InlineIcon icon={arrowLeft16} />
    </Button>
  ) : null;
};

export default BackBtn;
