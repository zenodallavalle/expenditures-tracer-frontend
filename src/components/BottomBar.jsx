import { useDispatch, useSelector } from 'react-redux';

import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import { changedPanel, selectPanel, selectWorkingDBId } from 'rdx/params';
import { AutoBlurButton } from 'utils';

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

export const BottomBar = (props) => {
  const dispatch = useDispatch();
  const panel = useSelector(selectPanel);
  const { isLoading: isLoadingUser, isSuccess: isSuccessUser } =
    useAutomaticUserTokenAuthQuery();
  const { isLoading: isLoadingDB } = useAutomaticGetFullDBQuery(
    {},
    { skip: !isSuccessUser }
  );
  const isLoading = isLoadingDB || isLoadingUser;
  const workingDBId = useSelector(selectWorkingDBId);

  const onChangePanel = (to) => dispatch(changedPanel(to));

  return (
    <footer className='footer fixed-bottom bg-white safe-fixed-x safe-fixed-bottom'>
      <div className='d-flex flex-row pt-1'>
        {buttons.map(({ name, displayedName }) => (
          <div key={`bottom_button_${name}`} className='flex-grow-1'>
            <AutoBlurButton
              variant={panel === name ? 'secondary' : 'outline-secondary'}
              size='sm'
              className='w-100'
              onClick={() => onChangePanel(name)}
              disabled={isLoading || !workingDBId}
            >
              {displayedName}
            </AutoBlurButton>
          </div>
        ))}
      </div>
    </footer>
  );
};
