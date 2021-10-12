import { databaseSelectors } from 'rdx/database';
import { expendituresSelectors } from 'rdx/expenditures';
import { localInfoActions, localInfoSelectors } from 'rdx/localInfo';
import { userSelectors } from 'rdx/user';
import React from 'react';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const buttons = [
  {
    name: 'prospect',
    displayedName: 'Prospect',
  },
  {
    name: 'actual_expenditures',
    displayedName: 'Actual',
  },
  {
    name: 'expected_expenditures',
    displayedName: 'Expected',
  },
  {
    name: 'months',
    displayedName: 'Months',
  },
];

const BottomBar = (props) => {
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(userSelectors.isLoading());
  const isLoadingDatabase = useSelector(databaseSelectors.isLoading());
  const isLoadingExpenditures = useSelector(expendituresSelectors.isLoading());
  const isLoading = isLoadingUser || isLoadingDatabase || isLoadingExpenditures;
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  const setPanel = (localInfo) =>
    dispatch(localInfoActions.panelChanged(localInfo));

  return (
    <footer className='footer fixed-bottom bg-white safe-fixed-x safe-fixed-bottom'>
      <div className='row pt-1'>
        <div className='col pr-0' style={{ maxWidth: 2 }}></div>
        {buttons.map(({ name, displayedName }) => (
          <div
            key={`bottom_button_${name}`}
            className='col text-center pl-0 pr-0'
          >
            <Button
              variant={
                currentPanel === name ? 'secondary' : 'outline-secondary'
              }
              className='btn-sm w-100 '
              onClick={() => setPanel(name)}
              disabled={isLoading || !workingDB}
            >
              {displayedName}
            </Button>
          </div>
        ))}
        <div className='col pl-0' style={{ maxWidth: 2 }}></div>
      </div>
    </footer>
  );
};

export default BottomBar;
