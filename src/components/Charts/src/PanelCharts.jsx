import { CategoriesBarChartWrapper } from './CategoriesBarChart';
import { getColumnWidth } from 'utils';

import BalanceChart from './BalanceChart';

const PanelCharts = ({ ...props }) => {
  return (
    <div
      className='mt-1 mb-3 mx-auto w-100'
      style={{ maxWidth: getColumnWidth() * 2 }}
    >
      <div className='mb-3'>
        <BalanceChart />
      </div>
      <div className='mb-3'>
        <CategoriesBarChartWrapper />
      </div>
    </div>
  );
};

export default PanelCharts;
