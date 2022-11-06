import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';
import { Category, CategoryTotal } from 'components/Category';

import { Expenditure } from './Expenditure';

export const Expenditures = ({ catId, expected, ...props }) => {
  const { data: category, isSuccess } = useAutomaticGetCategoryQuery({
    id: catId,
  });
  const expenditures = expected
    ? category?.expected_expenditures
    : category?.actual_expenditures;

  return (
    <Category id={catId}>
      {isSuccess && !expenditures?.length ? (
        <div className='fst-italic text-center mb-2'>
          No expenditures registered so far.
        </div>
      ) : (
        expenditures?.map((id) => (
          <Expenditure id={id} key={`expenditure_${id}`} editable />
        ))
      )}
      <CategoryTotal id={catId} expected={expected} />
    </Category>
  );
};
