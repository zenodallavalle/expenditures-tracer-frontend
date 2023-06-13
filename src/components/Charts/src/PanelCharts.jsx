import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { BalanceMultipleChartWrapper } from './BalanceMultipleChart';
import { MoneyCandlestickChartWrapper } from './MoneyCandlestickChart';
import { CategoriesExpendituresChartWrapper } from './CategoriesExpendituresChart';
import { resetBalanceChartType, selectBalanceChartType } from 'rdx/params';
import { getColumnWidth } from 'utils';

import { balanceChartTypes } from './ChartTypeSelector';

const PanelCharts = ({ ...props }) => {
  const dispatch = useDispatch();
  const balanceChartType = useSelector(selectBalanceChartType);

  useEffect(() => {
    if (!balanceChartTypes.includes(balanceChartType)) {
      dispatch(resetBalanceChartType());
    }
  }, [balanceChartType, dispatch]);

  console.log('PanelCharts', balanceChartType);

  return (
    <div
      className='mt-1 mb-3 mx-auto w-100'
      style={{ maxWidth: getColumnWidth() * 2 }}
    >
      <div className='mb-3'>
        {balanceChartType === 'multiple' ? (
          <BalanceMultipleChartWrapper />
        ) : balanceChartType === 'candlestick' ? (
          <MoneyCandlestickChartWrapper />
        ) : null}
      </div>
      <div className='mb-3'>
        <CategoriesExpendituresChartWrapper />
      </div>
    </div>
  );
};

export default PanelCharts;
