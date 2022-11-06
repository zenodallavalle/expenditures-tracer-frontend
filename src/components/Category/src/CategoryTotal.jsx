import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';

import { LoadingDiv } from 'utils';

const CategoryTotal = ({ id, expected, ...props }) => {
  const { data: category, isLoading } = useAutomaticGetCategoryQuery({ id });

  const numberOfExpenditures = expected
    ? category?.expected_expenditures.length
    : category?.actual_expenditures.length;

  const totalCostOfExpenditures = expected
    ? category?.prospect.expected_expenditure
    : category?.prospect.actual_expenditure;

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
            <span className='ms-1'>€</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CategoryTotal;
