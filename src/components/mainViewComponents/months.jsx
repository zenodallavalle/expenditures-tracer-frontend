import { databaseSelectors } from 'rdx/database';
import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux';
import { userSelectors } from 'rdx/user';
import { expendituresSelectors } from 'rdx/expenditures';
import { formatMonth } from '../uniformDate';
import { localInfoSelectors } from 'rdx/localInfo';

const MonthCell = ({ month, ...props }) => {
  const { month: name, current_money, income, warn } = month;
  const workingMonth = useSelector(localInfoSelectors.getWorkingMonth());
  const isWorkingMonth = workingMonth === name;
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(userSelectors.isLoading());
  const isLoadingDatabase = useSelector(databaseSelectors.isLoading(false));
  const isLoadingExpenditures = useSelector(
    expendituresSelectors.isLoading(false)
  );
  const isLoading = isLoadingUser || isLoadingDatabase || isLoadingExpenditures;

  const onClick = (name) => {
    dispatch({ type: 'localInfo/setWorkingMonth', payload: name });
    dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
  };

  return (
    <li className='list-group-item p-3'>
      <div className='row'>
        <div className='col-auto px-1'>
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
        <div className='col px-1'>{formatMonth(name)}</div>
        <div className='col px-1'>{income}</div>
        <div className='col px-1'>{current_money}</div>
      </div>
      {warn && (
        <Alert className='m-0 py-1 text-center ' variant='warning'>
          {warn}
        </Alert>
      )}
    </li>
  );
};

const Months = ({ ...props }) => {
  const months = useSelector(databaseSelectors.getMonths());
  const [showExplanation, setShowExaplanation] = useState(false);
  return (
    <div>
      {months.length === 0 ? (
        <p className='text-center'>
          <em>No months to show.</em>
        </p>
      ) : (
        <ul className='list-group'>
          {months.map((month) => (
            <MonthCell key={`month_${month.month}`} month={month} />
          ))}
        </ul>
      )}
      <p className='text-center'>
        <em>
          {showExplanation && (
            <div>
              Months will appear here if they have at least one expenditure or
              an income registered.
            </div>
          )}
          <a
            href='#help'
            onClick={(e) => {
              e.preventDefault();
              setShowExaplanation((s) => !s);
            }}
          >
            {showExplanation ? 'Hide explaination' : 'How do I add months?'}
          </a>
        </em>
      </p>
    </div>
  );
};

export default Months;
