import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import {
  LoadingDiv,
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
import { Chart } from 'react-chartjs-2';

import BalanceChartPeriod from './BalanceChartPeriod';
import { ChartTypeSelector } from './ChartTypeSelector';
import { ChartPercentageSelector } from './ChartPercentageSelector';
import { useMemo } from 'react';

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
    if (filteredMonths[i]?.current_money) {
      return i;
    }
  }
};

const prepareData = (filteredMonths, hideLine) => {
  return {
    labels:
      filteredMonths?.map(({ month }) =>
        formatMonthCustomFormat(month, 'mmm-yy')
      ) || [],
    datasets: [
      {
        type: 'bar',
        label: 'Incomes',
        data: filteredMonths?.map(({ income }) => income),
        backgroundColor: convertBootstrapColorToRGBA('success', 0.5),
        borderColor: convertBootstrapColorToRGBA('success', 1),
        borderWidth: 1,
        borderRadius: 5,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Expenditures',
        data: filteredMonths?.map(({ expenditure }) => expenditure),
        backgroundColor: convertBootstrapColorToRGBA('danger', 0.5),
        borderColor: convertBootstrapColorToRGBA('danger', 1),
        borderWidth: 1,
        borderRadius: 5,
        yAxisID: 'y',
      },
      ...(hideLine
        ? []
        : [
            {
              type: 'line',
              label: 'Money',
              data: filteredMonths?.map(({ current_money }) => current_money),
              backgroundColor: convertBootstrapColorToRGBA('primary', 1),
              borderColor: convertBootstrapColorToRGBA('primary', 0.75),
              yAxisID: 'y1',
            },
          ]),
    ],
  };
};

const preparePercentageData = (filteredMonths, percentageBaseRefIndex) => {
  const percentageBaseRef =
    filteredMonths?.[percentageBaseRefIndex]?.current_money;
  const monthsToUse = [...filteredMonths];
  monthsToUse.splice(0, percentageBaseRefIndex);
  return {
    labels:
      filteredMonths?.map(({ month }) =>
        formatMonthCustomFormat(month, 'mmm-yy')
      ) || [],
    datasets: [
      {
        type: 'bar',
        label: 'Incomes',
        data: filteredMonths?.map(({ income }) => income),
        backgroundColor: convertBootstrapColorToRGBA('success', 0.5),
        borderColor: convertBootstrapColorToRGBA('success', 1),
        borderWidth: 1,
        borderRadius: 5,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Expenditures',
        data: filteredMonths?.map(({ expenditure }) => expenditure),
        backgroundColor: convertBootstrapColorToRGBA('danger', 0.5),
        borderColor: convertBootstrapColorToRGBA('danger', 1),
        borderWidth: 1,
        borderRadius: 5,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Money',
        data: filteredMonths?.map(({ current_money }, index) =>
          index < percentageBaseRefIndex
            ? undefined
            : Math.round((current_money / percentageBaseRef) * 100)
        ),
        backgroundColor: convertBootstrapColorToRGBA('primary', 1),
        borderColor: convertBootstrapColorToRGBA('primary', 0.75),
        yAxisID: 'y1',
      },
    ],
  };
};

export const BalanceComplexChartCore = ({
  balanceChartPeriod,
  balanceChartPercentage,
  hideLine,
  ...props
}) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const months = fullDB?.months_list;

  const filteredMonths = useMemo(
    () => filterAndSortData(months, balanceChartPeriod),
    [months, balanceChartPeriod]
  );
  const data = prepareData(filteredMonths, hideLine);

  const percentageBaseRefIndex = useMemo(
    () => (hideLine ? null : getIndexForPercentageBaseRef(filteredMonths)),
    [filteredMonths, hideLine]
  );

  const percentageData = useMemo(
    () =>
      hideLine
        ? null
        : preparePercentageData(filteredMonths, percentageBaseRefIndex),
    [filteredMonths, percentageBaseRefIndex, hideLine]
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
      },
      ...(hideLine
        ? {}
        : {
            y1: {
              position: 'right',
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: (value) =>
                  balanceChartPercentage ? `${value}%` : value,
              },
            },
          }),
    },
  };

  if (isLoading) return null;

  return (
    <Chart
      data={balanceChartPercentage ? percentageData : data}
      options={options}
    />
  );
};

export const BalanceComplexChartWrapper = ({ ...props }) => {
  const { isLoading } = useAutomaticGetFullDBQuery();

  const balanceChartPeriod = useSelector(selectBalanceChartPeriod);
  const balanceChartPercentage = useSelector(selectBalanceChartPercentage);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Income and expenditures by month',
        font: { size: 20 },
      },
    },
  };

  if (isLoading) return <LoadingDiv />;

  return (
    <div className='w-100'>
      <div className='d-md-flex justify-content-between align-items-end'>
        <ChartTypeSelector />
        <ChartPercentageSelector />
        <BalanceChartPeriod />
      </div>

      <BalanceComplexChartCore
        balanceChartPeriod={balanceChartPeriod}
        balanceChartPercentage={balanceChartPercentage}
        options={options}
      />
    </div>
  );
};

export default BalanceComplexChartWrapper;
