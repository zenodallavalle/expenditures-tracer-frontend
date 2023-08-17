import { useSelector } from 'react-redux';
import { CategoriesBarChartWrapper } from './CategoriesBarChart';
import { selectBalanceChartPercentage } from 'rdx/params';

const CategoriesChart = ({ ...props }) => {
  const balanceChartPercentage = useSelector(selectBalanceChartPercentage);
  if (balanceChartPercentage) return <CategoriesDonutChartWrapper />;
  else return <CategoriesBarChartWrapper />;
};

export default CategoriesChart;
