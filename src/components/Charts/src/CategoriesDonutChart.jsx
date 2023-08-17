import { useSelector } from 'react-redux';
import { useAutomaticGetDBForGraphsQuery } from 'api/dbApiSlice';
import { selectCategoriesViewStatus } from 'rdx/params';
import { getColorFor } from 'utils';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { convertBootstrapColorToRGBA } from 'utils/src/cycleColors';
import ChartWrapper from './ChartWrapper';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const CategoriesDonutChartCore = ({ ...props }) => {
  const { data: fullDB } = useAutomaticGetDBForGraphsQuery();
  const categoriesViewStatus = useSelector(selectCategoriesViewStatus);

  const notHiddenCategories = [];
  const hiddenCategories = [];

  fullDB?.categories.forEach((category) => {
    if (categoriesViewStatus[category.id] === 'hidden') {
      hiddenCategories.push(category);
    } else {
      notHiddenCategories.push(category);
    }
  });

  const data = {
    labels: notHiddenCategories.map(({ name }) => name),
    datasets: [
      {
        label: 'Actual expenditure',
        data: notHiddenCategories.map(
          ({ prospect }) => prospect.actual_expenditure
        ),
        backgroundColor: notHiddenCategories.map(({ id, db }) =>
          convertBootstrapColorToRGBA(
            getColorFor({ type: `category_${db}`, id }),
            1
          )
        ),
        borderColor: notHiddenCategories.map(({ id, db }) =>
          convertBootstrapColorToRGBA(
            getColorFor({ type: `category_${db}`, id }),
            1
          )
        ),
        borderWidth: 1,
        borderRadius: 5,
      },
      {
        label: 'Expected expenditure',
        data: notHiddenCategories.map(
          ({ prospect }) => prospect.expected_expenditure
        ),
        backgroundColor: notHiddenCategories.map(({ id, db }) =>
          convertBootstrapColorToRGBA(
            getColorFor({ type: `category_${db}`, id }),
            0.5
          )
        ),
        borderColor: notHiddenCategories.map(({ id, db }) =>
          convertBootstrapColorToRGBA(
            getColorFor({ type: `category_${db}`, id }),
            1
          )
        ),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const hiddenCategoriesExpenditure = hiddenCategories.reduce(
    (acc, { prospect }) => acc + prospect.actual_expenditure,
    0
  );
  const hiddenCateogriesExpectedExpenditure = hiddenCategories.reduce(
    (acc, { prospect }) => acc + prospect.expected_expenditure,
    0
  );

  if (
    hiddenCategoriesExpenditure > 0 ||
    hiddenCateogriesExpectedExpenditure > 0
  ) {
    data.labels.push('Hidden categories');

    data.datasets[0].data.push(hiddenCategoriesExpenditure);
    data.datasets[0].backgroundColor.push(
      convertBootstrapColorToRGBA('secondary', 1)
    );
    data.datasets[0].borderColor.push(
      convertBootstrapColorToRGBA('secondary', 1)
    );

    data.datasets[1].data.push(hiddenCateogriesExpectedExpenditure);
    data.datasets[1].backgroundColor.push(
      convertBootstrapColorToRGBA('secondary', 0.5)
    );
    data.datasets[1].borderColor.push(
      convertBootstrapColorToRGBA('secondary', 1)
    );
  }

  const options = {
    ...(props?.options || {}),
  };

  return <Bar data={data} options={options} />;
};

export const CategoriesDonutChartWrapper = ({ ...props }) => {
  const { isLoading } = useAutomaticGetDBForGraphsQuery();
  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Actual and expected expenditures by category',
        font: { size: 20 },
      },
    },
  };
  return (
    <ChartWrapper
      isLoading={isLoading}
      ChildrenRenderer={({ options: _options, ...childrenProps }) => (
        <CategoriesDonutChartCore
          options={{ ...options, ..._options }}
          {...childrenProps}
        />
      )}
    ></ChartWrapper>
  );
};
