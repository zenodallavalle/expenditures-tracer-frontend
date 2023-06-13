import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import {
  convertBootstrapColorToRGBA,
  filterDataForBalanceChart,
  formatMonthCustomFormat,
} from 'utils';

import { useSelector } from 'react-redux';
import {
  selectBalanceChartPercentage,
  selectBalanceChartPeriod,
} from 'rdx/params';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Title,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import BalanceChartPeriod from './BalanceChartPeriod';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ChartPercentageSelector } from './ChartPercentageSelector';
import { useMemo } from 'react';
import ChartWrapper from './ChartWrapper';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Title,
  Tooltip,
  LineController,
  BarController
);

const filterAndSortData = (months, balanceChartPeriod) => {
  return months?.length > 0 && balanceChartPeriod
    ? filterDataForBalanceChart(months, balanceChartPeriod)
    : [];
};

const getIndexForPercentageBaseRef = (filteredMonths) => {
  for (let i = 0; i < filteredMonths?.length; i++) {
    if (filteredMonths[i]?.previous_month_actual_money) {
      return i;
    }
  }
};

const prepareData = (filteredMonths) => {
  return {
    labels:
      filteredMonths?.map(({ month }) =>
        formatMonthCustomFormat(month, 'mmm-yy')
      ) || [],
    datasets: [
      {
        type: 'bar',
        label: 'Money',
        data:
          filteredMonths?.map(
            ({ previous_month_actual_money, current_money }) => [
              previous_month_actual_money,
              current_money,
            ]
          ) || [],
        backgroundColor: filteredMonths?.map(
          ({ previous_month_actual_money, current_money }) =>
            convertBootstrapColorToRGBA(
              current_money > previous_month_actual_money
                ? 'success'
                : 'danger',
              0.5
            )
        ),
        borderColor: filteredMonths?.map(
          ({ previous_month_actual_money, current_money }) =>
            convertBootstrapColorToRGBA(
              current_money > previous_month_actual_money
                ? 'success'
                : 'danger',
              1
            )
        ),
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };
};

const preparePercentageData = (filteredMonths, percentageBaseRefIndex) => {
  const percentageBaseRef =
    filteredMonths?.[percentageBaseRefIndex]?.previous_month_actual_money;
  const monthsToUse = [...filteredMonths];
  monthsToUse.splice(0, percentageBaseRefIndex);
  return {
    labels:
      monthsToUse?.map(({ month }) =>
        formatMonthCustomFormat(month, 'mmm-yy')
      ) || [],
    datasets: [
      {
        type: 'bar',
        label: 'Money',
        data:
          monthsToUse?.map(({ previous_month_actual_money, current_money }) => [
            Math.round((previous_month_actual_money / percentageBaseRef) * 100),
            Math.round((current_money / percentageBaseRef) * 100),
          ]) || [],
        backgroundColor: monthsToUse?.map(
          ({ previous_month_actual_money, current_money }) =>
            convertBootstrapColorToRGBA(
              current_money > previous_month_actual_money
                ? 'success'
                : 'danger',
              0.5
            )
        ),
        borderColor: monthsToUse?.map(
          ({ previous_month_actual_money, current_money }) =>
            convertBootstrapColorToRGBA(
              current_money > previous_month_actual_money
                ? 'success'
                : 'danger',
              1
            )
        ),
        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };
};

export const MoneyCandlestickChartCore = ({
  balanceChartPeriod,
  balanceChartPercentage,
  ...props
}) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const months = fullDB?.months_list;

  let filteredMonths = useMemo(
    () => filterAndSortData(months, balanceChartPeriod),
    [months, balanceChartPeriod]
  );
  const data = useMemo(() => prepareData(filteredMonths), [filteredMonths]);

  const percentageBaseRefIndex = useMemo(
    () => getIndexForPercentageBaseRef(filteredMonths),
    [filteredMonths]
  );

  const percentageData = useMemo(
    () => preparePercentageData(filteredMonths, percentageBaseRefIndex),
    [filteredMonths, percentageBaseRefIndex]
  );

  const options = {
    ...(props?.options || {}),
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        position: 'left',
        ticks: {
          callback: (value) => (balanceChartPercentage ? `${value}%` : value),
        },
        beginAtZero: false,
      },
    },
  };
  if (isLoading) return null;

  return (
    <Bar
      data={balanceChartPercentage ? percentageData : data}
      options={options}
    />
  );
};

export const MoneyCandlestickChartWrapper = ({ ...props }) => {
  const { isLoading } = useAutomaticGetFullDBQuery();

  const balanceChartPeriod = useSelector(selectBalanceChartPeriod);
  const balanceChartPercentage = useSelector(selectBalanceChartPercentage);

  const options = {
    plugins: {
      title: {
        display: true,
        text: balanceChartPercentage
          ? 'Money variation by month (%)'
          : 'Money by month',
        font: { size: 20 },
      },
    },
  };

  return (
    <ChartWrapper
      isLoading={isLoading}
      ChildrenRenderer={({ options: _options, ...childrenProps }) => (
        <MoneyCandlestickChartCore
          balanceChartPeriod={balanceChartPeriod}
          balanceChartPercentage={balanceChartPercentage}
          options={{ ...options, ..._options }}
          {...childrenProps}
        />
      )}
    >
      <div className='d-md-flex justify-content-between align-items-end'>
        <ChartTypeSelector />
        <ChartPercentageSelector />
        <BalanceChartPeriod />
      </div>
    </ChartWrapper>
  );
};

export default MoneyCandlestickChartWrapper;
