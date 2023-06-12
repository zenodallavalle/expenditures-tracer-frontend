import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';
import clsx from 'clsx';

import { getTextForPercentage, getTextColorClassForDelta } from 'utils';

const CategoryProspect = ({ id, ...props }) => {
  const { data: category } = useAutomaticGetCategoryQuery({ id });

  const prospect = category?.prospect;

  const percentageOfExpected = getTextForPercentage(
    prospect?.actual_expenditure,
    prospect?.expected_expenditure
  );

  return (
    <div>
      <div className='d-flex'>
        <div className='d-flex justify-content-between px-1 pb-1 flex-grow-1'>
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
            <div>
              {prospect?.actual_expenditure}
              {percentageOfExpected && (
                <span
                  className={clsx(
                    'ps-1',
                    getTextColorClassForDelta(prospect?.delta)
                  )}
                >
                  ({percentageOfExpected})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProspect;
