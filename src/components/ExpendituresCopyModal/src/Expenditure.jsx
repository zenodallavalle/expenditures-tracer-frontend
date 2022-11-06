import ListGroupItem from 'react-bootstrap/ListGroupItem';
import FormControl from 'react-bootstrap/FormControl';

import { useGetExpenditureQuery } from 'api/expenditureApiSlice';
import {
  CheckButton,
  dateToLocaleISOString,
  adaptDateForMonth,
  formatDateTime,
  getCurrentMonth,
} from 'utils';

import { useCallback, useContext } from 'react';

export const Expenditure = ({ id, context, ...props }) => {
  const { selected, setSelected, newExpendituresAreLoading } =
    useContext(context);

  const generateExpenditure = useCallback(
    ({ name, value, date, category, is_expected, ...expenditure }) => ({
      name,
      value,
      category,
      is_expected,
      date: adaptDateForMonth(new Date(date), getCurrentMonth()),
      previousMonthId: id,
    }),
    [id]
  );
  const { data: expenditure, isLoading } = useGetExpenditureQuery(
    { id },
    { skip: !id }
  );

  const instance = selected.find(
    ({ previousMonthId }) => previousMonthId === id
  );

  const checked = instance !== undefined;

  const onToggleSelect = () => {
    if (checked) {
      setSelected((s) =>
        s.filter(({ previousMonthId }) => previousMonthId !== id)
      );
    } else {
      setSelected((s) => [...s, generateExpenditure(expenditure)]);
    }
  };

  const onChange = (e) => {
    setSelected((s) => {
      const ret = s.map(({ previousMonthId, ...expenditure }) =>
        previousMonthId === id
          ? { ...expenditure, previousMonthId, [e.target.name]: e.target.value }
          : { ...expenditure, previousMonthId }
      );
      return ret;
    });
  };

  if (isLoading) return null;
  return (
    <ListGroupItem>
      <div className='d-flex'>
        <CheckButton
          id={id}
          checked={checked}
          onChange={onToggleSelect}
          disabled={isLoading || newExpendituresAreLoading}
        />
        <div className='w-100'>
          <div className='pb-1'>
            {checked ? (
              <FormControl
                value={instance?.name || ''}
                name='name'
                onChange={onChange}
                disabled={newExpendituresAreLoading}
              />
            ) : (
              expenditure?.name || ''
            )}
          </div>
          <div className='pb-1'>
            {checked ? (
              <FormControl
                type='number'
                step={1}
                value={instance?.value || 0}
                name='value'
                onChange={onChange}
                disabled={newExpendituresAreLoading}
              />
            ) : (
              expenditure?.value || ''
            )}
          </div>
          <div className='pb-1'>
            {checked ? (
              <FormControl
                type='datetime-local'
                step={1}
                value={dateToLocaleISOString(new Date(instance?.date))}
                name='date'
                onChange={onChange}
                disabled={newExpendituresAreLoading}
              />
            ) : (
              formatDateTime(expenditure?.date) || ''
            )}
          </div>
        </div>
      </div>
    </ListGroupItem>
  );
};
