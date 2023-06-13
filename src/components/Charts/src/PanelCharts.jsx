import { useSelector } from 'react-redux';
import { selectBalanceChartType } from 'rdx/params';

import { BalanceMultipleChartWrapper } from './BalanceMultipleChart';
import { MoneyCandlestickChartWrapper } from './MoneyCandlestickChart';
import { CategoriesExpendituresChartWrapper } from './CategoriesExpendituresChart';
import { getColumnWidth } from 'utils';

export const balanceChartTypes = ['complex', 'candlestick'];

const PanelCharts = ({ ...props }) => {
  const balanceChartType = useSelector(selectBalanceChartType);

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
