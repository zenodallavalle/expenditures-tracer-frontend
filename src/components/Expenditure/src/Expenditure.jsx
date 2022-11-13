import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

import Badge from 'react-bootstrap/Badge';
import { InlineIcon } from '@iconify/react';
import workflow16 from '@iconify/icons-octicon/workflow-16';

import {
  useDeleteExpenditureMutation,
  useGetExpenditureQuery,
} from 'api/expenditureApiSlice';
import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';
import {
  formatDateTime,
  FunctionalitiesMenu,
  getColorFor,
  LoadingImg,
} from 'utils';

import { ExpenditureEditor } from './ExpenditureEditor';

import ExpenditureModal from './ExpenditureModal';
import { ExpenditureLoading } from './ExpenditureLoading';

export const Expenditure = ({
  id,
  expenditure: _expenditure,
  showCategory = false,
  showType = false,
  editable = false,
  ...props
}) => {
  const [showEditExpenditure, setShowEditExpenditure] = useState(false);
  const [showExpenditureDetails, setShowExpenditureDetails] = useState(false);
  const hasMouse = window.matchMedia('(hover:hover)').matches;

  const [showControls, setShowControls] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setShowControls(true);
    },
    onSwipedRight: () => {
      setShowControls(false);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  const { data: cachedExpenditure, isLoading } = useGetExpenditureQuery(
    { id },
    { skip: _expenditure }
  );

  const expenditure = _expenditure || cachedExpenditure;

  const [deleteExpenditure] = useDeleteExpenditureMutation();

  const { data: category, isFetching: categoryIsFetching } =
    useAutomaticGetCategoryQuery(
      { id: expenditure?.category },
      { skip: !showCategory }
    );

  const categoryBg = getColorFor(expenditure?.category);

  const onEdit = (e, collapseFunctionalityMenu) => {
    setShowEditExpenditure(true);
    collapseFunctionalityMenu();
  };

  const onDelete = async () => {
    deleteExpenditure(expenditure);
  };

  const onToggleDetails = () => {
    setShowExpenditureDetails((s) => !s);
  };

  if (isLoading) return <ExpenditureLoading />;
  return (
    <div {...props}>
      <div
        {...(hasMouse || !editable ? null : handlers)}
        onClick={onToggleDetails}
        className='bg-light border border-secondary rounded ms-2 my-1 ps-2 py-1'
      >
        <div className='d-flex align-items-stretch'>
          <div className='flex-grow-1'>
            {showCategory && (
              <Badge bg={categoryBg}>
                {categoryIsFetching ? (
                  <LoadingImg maxWidth={20} />
                ) : (
                  category.name
                )}
              </Badge>
            )}
            <div>{expenditure?.name}</div>
            <div className='text-muted fst-italic small'>
              {formatDateTime(expenditure?.date)}
            </div>
            <div>
              <span>{expenditure?.value}</span>
              <span className='ms-1'>€</span>
            </div>
            {showType && (
              <Badge bg={expenditure?.is_expected ? 'secondary' : 'primary'}>
                {expenditure?.is_expected ? 'Expected' : 'Actual'}
              </Badge>
            )}
          </div>
          {editable && (
            <div>
              <div
                className='d-flex flex-column h-100 justify-content-between'
                onClick={(e) => e.stopPropagation()}
              >
                <FunctionalitiesMenu
                  hideExpander={!hasMouse}
                  clickable={!isLoading}
                  isExtended={showControls}
                  setIsExtended={setShowControls}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  deleteConfirmTimeout={4000}
                  autocollapseTimeout={4000}
                />
                {(expenditure?.expected_expenditure ||
                  (expenditure?.is_expected &&
                    expenditure?.actual_expenditures.length > 0)) && (
                  <div className='ms-auto'>
                    <div className='py-1 px-2' onClick={onToggleDetails}>
                      <InlineIcon icon={workflow16} rotate={135} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showExpenditureDetails && (
        <ExpenditureModal
          show={showExpenditureDetails}
          setShow={setShowExpenditureDetails}
          setShowEditExpenditure={setShowEditExpenditure}
          id={id}
          editable={editable}
        />
      )}

      {(showEditExpenditure || showExpenditureDetails) && editable && (
        <ExpenditureEditor
          show={showEditExpenditure}
          onHide={() => setShowEditExpenditure(false)}
          id={id}
          expected={expenditure?.is_expected}
        />
      )}
    </div>
  );
};
