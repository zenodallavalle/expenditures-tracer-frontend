import { useSelector } from 'react-redux';
import { selectBalanceChartType } from 'rdx/params';

import { BalanceComplexChartWrapper } from './BalanceComplexChart';
import { MoneyCandlestickChartWrapper } from './MoneyCandlestickChart';
import { CategoriesExpendituresChartWrapper } from './CategoriesExpendituresChart';

export const balanceChartTypes = ['complex', 'candlestick'];

const PanelCharts = ({ ...props }) => {
  const balanceChartType = useSelector(selectBalanceChartType);

  return (
    <div className='mt-1 mb-3 mx-auto w-100'>
      <div className='mb-3'>
        {balanceChartType === 'complex' ? (
          <BalanceComplexChartWrapper />
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
