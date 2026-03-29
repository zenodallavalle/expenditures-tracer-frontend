import { useDispatch, useSelector } from 'react-redux';

import {
  selectHiddenCategoriesIds,
  resetCategoryViewStatus,
} from '/src/rdx/params';
import { AutoBlurButton } from '/src/utils';
import { useAutomaticGetFullDBQuery } from '/src/api/dbApiSlice';

const ExpandHiddenCategories = ({ ...props }) => {
  const dispatch = useDispatch();
  const { data: fullDB } = useAutomaticGetFullDBQuery();

  const hiddenCategoriesIds = useSelector(selectHiddenCategoriesIds).filter(
    (id) => fullDB?.categories.includes(id),
  );

  const onExpandHiddenCategories = () =>
    dispatch(resetCategoryViewStatus(hiddenCategoriesIds));

  if (!hiddenCategoriesIds.length) return null;
  else
    return (
      <div>
        <AutoBlurButton className="w-100" onClick={onExpandHiddenCategories}>
          Expand hidden categories
        </AutoBlurButton>
      </div>
    );
};

export default ExpandHiddenCategories;
