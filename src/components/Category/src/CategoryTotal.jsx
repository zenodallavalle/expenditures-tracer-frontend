import clsx from 'clsx';

import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';

import {
  getTextColorClassForDelta,
  getTextForPercentage,
  LoadingDiv,
} from 'utils';

const CategoryTotal = ({ id, expected, ...props }) => {
  const { data: category, isLoading } = useAutomaticGetCategoryQuery({ id });

  const prospect = category?.prospect;

  const numberOfExpenditures = expected
    ? category?.expected_expenditures.length
    : category?.actual_expenditures.length;

  const totalCostOfExpenditures = expected
    ? prospect?.expected_expenditure
    : prospect?.actual_expenditure;
  const percentageOfExpected = getTextForPercentage(
    prospect?.actual_expenditure,
    prospect?.expected_expenditure
  );

  if (isLoading) return <LoadingDiv />;
  return (
    <div>
      {numberOfExpenditures ? (
        <div className='d-flex p-1'>
          <div className='flex-grow-1'>
            <span>{numberOfExpenditures}</span>
            <span className='ms-1'>
              {numberOfExpenditures === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div>
            <span>{totalCostOfExpenditures}</span>
            {!expected && percentageOfExpected && (
              <span
                className={clsx(
                  'ps-1',
                  getTextColorClassForDelta(prospect?.delta)
                )}
              >
                ({percentageOfExpected})
              </span>
            )}
            <span className='ms-1'>€</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CategoryTotal;
