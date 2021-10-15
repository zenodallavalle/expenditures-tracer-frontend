import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';

import { InlineIcon } from '@iconify/react';
import workflow16 from '@iconify/icons-octicon/workflow-16';

import { expenditureApi } from 'api';
import {
  formatDate,
  FunctionalitiesMenu,
  AutoBlurTransparentButton,
} from 'utils';
import { expendituresSelectors } from 'rdx/expenditures';
import ExpenditureOffcanvas from 'components/expenditureEditor';

const Expenditure = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const [showEditExpenditure, setShowEditExpenditure] = useState(false);
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

  const onEdit = (e, collapseFunctionalityMenu) => {
    setShowEditExpenditure(true);
    collapseFunctionalityMenu();
  };

  const onDelete = async () => {
    dispatch({ type: 'expenditures/isLoading' });
    try {
      const fullDB = await expenditureApi.deleteExpenditure({ id });
      dispatch({ type: 'expenditures/dataUpdated', payload: fullDB });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch (e) {}
  };

  return (
    <div>
      <div
        {...(hasMouse ? null : handlers)}
        className='d-flex align-items-stretch bg-light border border-secondary rounded ms-2 my-1 ps-2 py-1'
      >
        <div className='flex-grow-1'>
          <div>{expenditure?.name}</div>
          <div className='text-muted fst-italic small'>
            {formatDate(expenditure?.date)}
          </div>
          <div>
            <span>{expenditure?.value}</span>
            <span className='ms-1'>€</span>
          </div>
        </div>
        <div>
          <div className='d-flex flex-column h-100'>
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
                <AutoBlurTransparentButton>
                  <InlineIcon icon={workflow16} rotate={135} />
                </AutoBlurTransparentButton>
              </div>
            )}
          </div>
        </div>
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
