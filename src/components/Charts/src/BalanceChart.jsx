import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { BalanceMultipleChartWrapper } from './BalanceMultipleChart';
import { MoneyCandlestickChartWrapper } from './MoneyCandlestickChart';
import { resetBalanceChartType, selectBalanceChartType } from 'rdx/params';

import { balanceChartTypes } from './ChartTypeSelector';

const BalanceChart = ({ ...props }) => {
  const dispatch = useDispatch();
  const balanceChartType = useSelector(selectBalanceChartType);

  useEffect(() => {
    if (!balanceChartTypes.includes(balanceChartType)) {
      dispatch(resetBalanceChartType());
    }
  }, [balanceChartType, dispatch]);

  if (balanceChartType === 'multiple') return <BalanceMultipleChartWrapper />;
  else if (balanceChartType === 'candlestick')
    return <MoneyCandlestickChartWrapper />;
  return null;
};

export default BalanceChart;
