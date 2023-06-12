import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import {
  changedBalanceChartPercentage,
  resetBalanceChartPercentage,
  selectBalanceChartPercentage,
} from 'rdx/params';

export const ChartPercentageSelector = ({ ...props }) => {
  const dispatch = useDispatch();
  const balanceChartPercentage = useSelector(selectBalanceChartPercentage);
  const onChangeBalanceChartPercentage = (val) => {
    dispatch(changedBalanceChartPercentage(val));
  };

  useEffect(() => {
    if (balanceChartPercentage !== true && balanceChartPercentage !== false) {
      dispatch(resetBalanceChartPercentage());
    }
  }, [balanceChartPercentage, dispatch]);

  return (
    <div className='text-center'>
      <Form.Check
        type='switch'
        className='d-inline-block'
        id='balance-chart-percentage-switch'
        checked={balanceChartPercentage}
        onChange={() => onChangeBalanceChartPercentage(!balanceChartPercentage)}
      />
      <span>Percentage</span>
    </div>
  );
};
