import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AutoBlurButton, getCurrentPanel } from 'utils';

import { mixinSelectors } from 'rdx';
import { databaseSelectors } from 'rdx/database';

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
  const navigate = useNavigate();
  const panel = getCurrentPanel();
  const isLoading = useSelector(mixinSelectors.isLoading());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const setPanel = useCallback(
    (to) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.set('panel', to);
      navigate(`/?${urlSearchParams.toString()}`);
    },
    [navigate]
  );

  return (
    <footer className='footer fixed-bottom bg-white safe-fixed-x safe-fixed-bottom'>
      <div className='d-flex flex-row pt-1'>
        {buttons.map(({ name, displayedName }) => (
          <div key={`bottom_button_${name}`} className='flex-grow-1'>
            <AutoBlurButton
              variant={panel === name ? 'secondary' : 'outline-secondary'}
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
