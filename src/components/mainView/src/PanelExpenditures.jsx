import { useState } from 'react';
import { useSelector } from 'react-redux';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { databaseSelectors } from 'rdx/database';

import { LoadingDiv, AutoBlurButton } from 'utils';

import Category, {
  AddCategory,
  CategoryProspect,
  ExpandHiddenCategories,
} from './Category';
import Expenditures from './Expenditures';

import ExpenditureCopyModal from './ExpenditureCopyModal';

let columnWidth = parseInt(process.env.REACT_APP_COL_WIDTH);
if (isNaN(columnWidth)) {
  columnWidth = 500;
}

const CopyExpectedExpenditures = ({ ...props }) => {
  const [showCopyExpenditures, setShowCopyExpenditures] = useState(false);

  const onToggleShowCopyExpenditures = () => setShowCopyExpenditures((s) => !s);

  return (
    <div>
      <AutoBlurButton
        className='w-100'
        disabled={showCopyExpenditures}
        onClick={onToggleShowCopyExpenditures}
        variant='primary'
      >
        Copy previous month's expected expenditures
      </AutoBlurButton>
      <ExpenditureCopyModal
        show={showCopyExpenditures}
        setShow={setShowCopyExpenditures}
      />
    </div>
  );
};

const PanelExpenditures = ({ expected, ...props }) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const categoriesIds = useSelector(databaseSelectors.getCategoriesIds());
  if (!categoriesIds?.length) {
    if (isLoading) {
      return <LoadingDiv className='text-center w-100' maxWidth={100} />;
    } else {
      return (
        <div className='mx-auto' style={{ maxWidth: columnWidth }}>
          <div className='text-center fst-italic mb-2'>
            No categories created yet.
          </div>
          <AddCategory />
        </div>
      );
    }
  } else {
    return (
      <div className='mx-auto'>
        <div>
          <Row xs='auto' sm='auto' md='auto' lg='auto' xl='auto' xxl='auto'>
            {categoriesIds.map((id) => (
              <Col
                key={`category_${expected ? 'expected' : 'actual'}_${id}`}
                className='mx-auto'
              >
                <Category id={id}>
                  <Expenditures expected={expected} categoryId={id} />
                  <CategoryProspect expected={expected} id={id} />
                </Category>
              </Col>
            ))}
          </Row>
        </div>

        <ExpandHiddenCategories />
        <div className='my-2' />
        <AddCategory />
        <div className='my-2' />
        {expected && <CopyExpectedExpenditures />}
      </div>
    );
  }
};

export default PanelExpenditures;
