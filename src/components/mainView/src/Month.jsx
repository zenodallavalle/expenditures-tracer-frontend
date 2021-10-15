import { Fragment } from 'react';
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
    <Fragment>
      <tr>
        <td className='col-3'>
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
        </td>
        <td>{formatMonth(name)}</td>
        <td>{income}</td>
        <td>{current_money}</td>
      </tr>
      <tr>
        <td className='p-0' colSpan={4}>
          {warn && (
            <Alert className='mb-1 py-1 text-center ' variant='warning'>
              {warn}
            </Alert>
          )}
        </td>
      </tr>
    </Fragment>
  );
};

export default Month;
