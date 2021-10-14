import { useSelector, useDispatch } from 'react-redux';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import { formatMonth } from 'utils';
import { mixinSelectors } from 'rdx';
import { localInfoSelectors } from 'rdx/localInfo';

const Month = ({ month, ...props }) => {
  const { month: name, current_money, income, warn } = month;
  const workingMonth = useSelector(localInfoSelectors.getWorkingMonth());
  const isWorkingMonth = workingMonth === name;
  const dispatch = useDispatch();
  const isLoading = useSelector(mixinSelectors.isLoading());

  const onClick = (name) => {
    dispatch({ type: 'localInfo/setWorkingMonth', payload: name });
    dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
  };

  return (
    <div>
      <div className='d-flex align-items-center'>
        <div className='px-1'>
          <Button
            size='sm'
            variant={isWorkingMonth ? 'success' : 'primary'}
            className='px-2 py-1'
            style={{ width: 80 }}
            disabled={isLoading || isWorkingMonth}
            onClick={() => onClick(name)}
          >
            {isWorkingMonth ? 'selected' : 'select'}
          </Button>
        </div>
        <div className='flex-grow-1'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='px-auto'>{formatMonth(name)}</div>
            <div className='px-auto'>{income}</div>
            <div className='px-auto'>{current_money}</div>
          </div>
        </div>
      </div>
      {warn && (
        <Alert className='m-0 py-1 text-center ' variant='warning'>
          {warn}
        </Alert>
      )}
    </div>
  );
};

export default Month;
