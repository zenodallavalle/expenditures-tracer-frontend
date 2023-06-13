import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {
  changedBalanceChartPeriod,
  resetBalanceChartPeriod,
  selectBalanceChartPeriod,
} from 'rdx/params';
import { AutoBlurButton } from 'utils';

export const balanceChartPeriods = ['6M', 'CY', '1Y', '3Y', '5Y', '10Y', 'YTD'];

const BalanceChartPeriod = ({ ...props }) => {
  const dispatch = useDispatch();
  const balanceChartPeriod = useSelector(selectBalanceChartPeriod);
  const onChangeBalanceChartPeriod = (period) => {
    dispatch(changedBalanceChartPeriod(period));
  };

  useEffect(() => {
    if (!balanceChartPeriods.includes(balanceChartPeriod)) {
      dispatch(resetBalanceChartPeriod());
    }
  }, [balanceChartPeriod, dispatch]);

  return (
    <div className='text-center'>
      <div className='text-center pb-1'>Chart Period</div>
      <ButtonGroup size='sm'>
        {balanceChartPeriods.map((period) => (
          <AutoBlurButton
            key={period}
            variant={
              period === balanceChartPeriod ? 'primary' : 'outline-secondary'
            }
            onClick={() => onChangeBalanceChartPeriod(period)}
          >
            {period}
          </AutoBlurButton>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default BalanceChartPeriod;
