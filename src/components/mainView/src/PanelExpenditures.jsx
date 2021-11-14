import { useSelector } from 'react-redux';

import { LoadingDiv } from 'utils';
import { databaseSelectors } from 'rdx/database';

import Category, {
  AddCategory,
  CategoryProspect,
  ExpandHiddenCategories,
} from './Category';
import Expenditures from './Expenditures';

const PanelExpenditures = ({ expected, ...props }) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const categoriesIds = useSelector(databaseSelectors.getCategoriesIds());
  if (!categoriesIds?.length) {
    if (isLoading) {
      return <LoadingDiv className='text-center w-100' maxWidth={100} />;
    } else {
      return (
        <div>
          <div className='text-center fst-italic mb-2'>
            No categories created yet.
          </div>
          <AddCategory />
        </div>
      );
    }
  } else {
    return (
      <div>
        {categoriesIds.map((id) => (
          <Category
            id={id}
            key={`category_${expected ? 'expected' : 'actual'}_${id}`}
          >
            <Expenditures expected={expected} categoryId={id} />
            <CategoryProspect expected={expected} id={id} />
          </Category>
        ))}
        <ExpandHiddenCategories />
        <div className='my-2'></div>
        <AddCategory />
      </div>
    );
  }
};

export default PanelExpenditures;
