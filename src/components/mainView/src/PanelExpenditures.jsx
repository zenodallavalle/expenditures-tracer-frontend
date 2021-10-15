import { useSelector } from 'react-redux';
import { databaseSelectors } from 'rdx/database';
import { LoadingDiv } from 'utils';
import { localInfoSelectors } from 'rdx/localInfo';

import Category from './Category';
import Expenditures from './Expenditures';
import { AddCategory } from './Category';

const PanelExpenditures = (props) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const categoriesIds = useSelector(databaseSelectors.getCategoriesIds());
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  if (categoriesIds.length === 0) {
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
          <Category id={id} key={`category_${currentPanel}_${id}`}>
            <Expenditures categoryId={id} />
          </Category>
        ))}
        <AddCategory />
      </div>
    );
  }
};

export default PanelExpenditures;
