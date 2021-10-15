import { Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import { getWorkingMonth, formatMonth, getCurrentMonth } from 'utils';
import { mixinSelectors } from 'rdx';

const Month = ({ month, ...props }) => {
  const { month: name, current_money, income, warn } = month;

  const history = useHistory();

  const workingMonth = getWorkingMonth();
  const isWorkingMonth = workingMonth === name;

  const isLoading = useSelector(mixinSelectors.isLoading());

  const onClick = useCallback(
    (name) => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      if (name === getCurrentMonth()) {
        urlSearchParams.delete('month');
      } else {
        urlSearchParams.set('month', name);
      }
      urlSearchParams.set('panel', 'prospect');
      history.push(`/?${urlSearchParams.toString()}`);
    },
    [history]
  );

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
