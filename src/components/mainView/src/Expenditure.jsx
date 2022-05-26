import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

import Badge from 'react-bootstrap/Badge';
import { InlineIcon } from '@iconify/react';
import workflow16 from '@iconify/icons-octicon/workflow-16';

import { expenditureApi } from 'api';
import { formatDate, FunctionalitiesMenu, getColorFor } from 'utils';

import { expendituresSelectors } from 'rdx/expenditures';
import ExpenditureOffcanvas from 'components/expenditureEditor';

import ExpenditureModal from './ExpenditureModal';
import { databaseSelectors } from 'rdx/database';

const Expenditure = ({
  id,
  showCategory = false,
  showType = false,
  ...props
}) => {
  const dispatch = useDispatch();
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

  const isLoading = useSelector(expendituresSelectors.isLoading());
  const expenditure = useSelector(expendituresSelectors.getById(id));

  const category = useSelector(
    databaseSelectors.getCategoryById(expenditure?.category)
  );

  const categoryBg = getColorFor(expenditure?.category);

  const onEdit = (e, collapseFunctionalityMenu) => {
    setShowEditExpenditure(true);
    collapseFunctionalityMenu();
  };

  const onDelete = async () => {
    dispatch({ type: 'expenditures/isLoading' });
    try {
      const fullDB = await expenditureApi.deleteExpenditure({ id });
      dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch (e) {}
  };

  const onToggleDetails = () => {
    setShowExpenditureDetails((s) => !s);
  };

  return (
    <div {...props}>
      <div
        {...(hasMouse ? null : handlers)}
        onClick={onToggleDetails}
        className='bg-light border border-secondary rounded ms-2 my-1 ps-2 py-1'
      >
        <div className='d-flex align-items-stretch'>
          <div className='flex-grow-1'>
            {showCategory && <Badge bg={categoryBg}>{category?.name}</Badge>}
            <div>{expenditure?.name}</div>
            <div className='text-muted fst-italic small'>
              {formatDate(expenditure?.date)}
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
          <div>
            <div
              className='d-flex flex-column h-100'
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
              {(Boolean(expenditure?.expected_expenditure) ||
                (expenditure?.is_expected &&
                  expenditure?.actual_expenditures.length > 0)) && (
                <div className='ms-auto mt-auto'>
                  <div className='py-1 px-2' onClick={onToggleDetails}>
                    <InlineIcon icon={workflow16} rotate={135} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <ExpenditureModal
          show={showExpenditureDetails}
          setShow={setShowExpenditureDetails}
          setShowEditExpenditure={setShowEditExpenditure}
          id={id}
        />
      </div>

      <ExpenditureOffcanvas
        show={showEditExpenditure}
        onHide={() => setShowEditExpenditure(false)}
        id={id}
        expected={expenditure?.is_expected}
      />
    </div>
  );
};

export default Expenditure;
