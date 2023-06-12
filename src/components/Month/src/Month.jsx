import { useDispatch, useSelector } from 'react-redux';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import { useAutomaticUserTokenAuthQuery } from 'api/userApiSlice';
import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import {
  changedPanel,
  selectWorkingMonth,
  updatedWorkingMonth,
} from 'rdx/params';
import { formatMonth } from 'utils';

export const Month = ({
  month: { month: name, current_money, expenditure, income, warn },
  ...props
}) => {
  const dispatch = useDispatch();
  const workingMonth = useSelector(selectWorkingMonth);
  const isWorkingMonth = workingMonth === name;

  const { isFetching: isFetchingUser } = useAutomaticUserTokenAuthQuery();
  const { isFetching: isFetchingDB } = useAutomaticGetFullDBQuery();

  const isFetching = isFetchingUser || isFetchingDB;

  const onSelectMonth = () => {
    dispatch(updatedWorkingMonth(name));
    dispatch(changedPanel('prospect'));
  };

  return (
    <>
      <tr>
        <td className='col-3'>
          <Button
            size='sm'
            variant={isWorkingMonth ? 'success' : 'primary'}
            className='px-2 py-1'
            style={{ width: 80 }}
            disabled={isFetching || isWorkingMonth}
            onClick={onSelectMonth}
          >
            {isWorkingMonth ? 'selected' : 'select'}
          </Button>
        </td>
        <td>{formatMonth(name)}</td>
        <td>{Math.round(income)}</td>
        <td>{Math.round(expenditure)}</td>
        <td>{Math.round(current_money)}</td>
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
    </>
  );
};
