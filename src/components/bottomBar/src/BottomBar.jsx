import { useDispatch, useSelector } from 'react-redux';

import { AutoBlurButton } from 'utils';

import { mixinSelectors } from 'rdx';
import { databaseSelectors } from 'rdx/database';
import { localInfoActions, localInfoSelectors } from 'rdx/localInfo';

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
  const isLoading = useSelector(mixinSelectors.isLoading());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());

  const setPanel = (to) => dispatch(localInfoActions.panelChanged(to));

  return (
    <footer className='footer fixed-bottom bg-white safe-fixed-x safe-fixed-bottom'>
      <div className='d-flex flex-row pt-1'>
        {buttons.map(({ name, displayedName }) => (
          <div key={`bottom_button_${name}`} className='flex-grow-1'>
            <AutoBlurButton
              variant={
                currentPanel === name ? 'secondary' : 'outline-secondary'
              }
              size='sm'
              className='w-100'
              onClick={() => setPanel(name)}
              disabled={isLoading || !workingDB}
            >
              {displayedName}
            </AutoBlurButton>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default BottomBar;
