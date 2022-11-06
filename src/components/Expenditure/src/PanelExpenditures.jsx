import { useState } from 'react';
import { AutoBlurButton, getColumnWidth, LoadingDiv } from 'utils';

import { AddCategory, ExpandHiddenCategories } from 'components/Category';

import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { Expenditures } from 'components/Expenditure';

import { ExpendituresCopyModal } from 'components/ExpendituresCopyModal';

export const PanelExpenditures = ({ expected, ...props }) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const categoriesIds = fullDB?.categories;

  const [showCopyExpenditures, setShowCopyExpenditures] = useState();
  const onShowCopyExpendituresModal = () => setShowCopyExpenditures(true);
  const onHideCopyExpendituresModal = () => setShowCopyExpenditures();

  if (isLoading)
    return <LoadingDiv className='text-center w-100' maxWidth={100} />;
  else if (!categoriesIds.length)
    return (
      <div className='mx-auto' style={{ maxWidth: getColumnWidth() }}>
        <div className='text-center fst-italic mb-2'>
          No categories created yet.
        </div>
        <AddCategory />
      </div>
    );
  return (
    <div className='mx-auto my-2'>
      {categoriesIds.map((catId) => (
        <Expenditures
          expected={expected}
          catId={catId}
          key={`expenditures_wrapper_cat_${catId}`}
        />
      ))}
      <ExpandHiddenCategories />
      <div className='my-2' />
      <AddCategory />
      <div className='my-2' />
      {expected && (
        <div>
          <AutoBlurButton
            className='w-100'
            disabled={showCopyExpenditures}
            onClick={onShowCopyExpendituresModal}
          >
            Copy previous month's expected expenditures
          </AutoBlurButton>
          <ExpendituresCopyModal
            show={showCopyExpenditures}
            onHide={onHideCopyExpendituresModal}
          />
        </div>
      )}
    </div>
  );
};
