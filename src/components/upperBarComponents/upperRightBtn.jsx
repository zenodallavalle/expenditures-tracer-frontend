import { InlineIcon } from '@iconify/react';
import plusCircle16 from '@iconify/icons-octicon/plus-circle-16';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import Button from 'react-bootstrap/Button';

import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';
import { expendituresSelectors } from 'rdx/expenditures';

import { useSelector, useDispatch } from 'react-redux';
import { localInfoSelectors } from 'rdx/localInfo';

const UpperRightBtn = ({ onAdd = () => {}, props }) => {
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(userSelectors.isLoading());
  const isLoadingDatabase = useSelector(databaseSelectors.isLoading(false));
  const isLoadingExpenditures = useSelector(
    expendituresSelectors.isLoading(false)
  );
  const isLoading = isLoadingUser || isLoadingDatabase || isLoadingExpenditures;
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());

  const onClick = () => {
    switch (currentPanel) {
      case 'months':
        return dispatch({ type: 'workingMonth/reset' });

      default:
        return onAdd();
    }
  };

  const getIcon = () => {
    switch (currentPanel) {
      case 'months':
        return <InlineIcon icon={calendar16} />;
      default:
        return <InlineIcon icon={plusCircle16} />;
    }
  };
  return (
    currentPanel !== 'user' && (
      <Button
        variant='outline-primary'
        disabled={isLoading || !isAuthenticated}
        onClick={onClick}
      >
        {getIcon()}
      </Button>
    )
  );
};

export default UpperRightBtn;
