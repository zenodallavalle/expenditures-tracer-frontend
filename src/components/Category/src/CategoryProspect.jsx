import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';

import { LoadingDiv, getTextColorClassForDelta } from 'utils';

// check this out https://skeletonreact.com/

const CategoryProspect = ({ id, ...props }) => {
  const { data: category, isLoading } = useAutomaticGetCategoryQuery({ id });

  const prospect = category?.prospect;

  return (
    <div>
      {isLoading ? (
        <LoadingDiv />
      ) : (
        <div>
          <div className='d-flex justify-content-between px-1 pb-1'>
            <div className='d-flex flex-column text-center'>
              <div className='fst-italic fw-light small'>Expected</div>
              <div>{prospect?.expected_expenditure}</div>
            </div>

            <div className='d-flex flex-column text-center'>
              <div className='fst-italic fw-light small'>Delta</div>
              <div className={getTextColorClassForDelta(prospect?.delta)}>
                {prospect?.delta}
              </div>
            </div>

            <div className='d-flex flex-column text-center'>
              <div className='fst-italic fw-light small'>Actual</div>
              <div>{prospect?.actual_expenditure}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryProspect;
