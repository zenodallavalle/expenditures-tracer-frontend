import React, { useEffect, useState } from 'react';
import { InlineIcon } from '@iconify/react';
import workflow16 from '@iconify/icons-octicon/workflow-16';
import FunctionalitiesMenu from '../functionalitiesMenu';
import { useSwipeable } from 'react-swipeable';
import formatDate from '../uniformDate';
import { useDispatch, useSelector } from 'react-redux';
import { databaseSelectors } from 'rdx/database';
import { expendituresSelectors } from 'rdx/expenditures';
import LoadingImg from 'components/LoadingImg';
import { categoryApi, expenditureApi } from 'api';
import { localInfoSelectors } from 'rdx/localInfo';
import AddEditExpenditureOffcanvas from 'components/addEditExpenditureOffcanvas';

const CategoryCell = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const category = useSelector(databaseSelectors.getCategoryById(id));
  const isLoading = useSelector(databaseSelectors.isLoading());
  const [instance, setInstance] = useState({ name: category.name });
  useEffect(() => {
    setInstance({ name: category.name });
  }, [category]);
  const [isEditing, setIsEditing] = useState(false);

  const onChange = (e) =>
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));
  const onEdit = (e) => setIsEditing(true);
  const onEdited = async (e) => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await categoryApi.editCategory({ id, payload: instance });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch {
      // error catched will be an instance of RequestRejected
    }
    setInstance({ name: category.name });
    setIsEditing(false);
  };

  const onDelete = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await categoryApi.deleteCategory({ id });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch (e) {
      // error catched will be an instance of RequestRejected
    }
  };

  return (
    <div className='w-100 pl-1'>
      <div className='text-primary m-1 clearfix'>
        {isEditing ? (
          <input
            type='text'
            name='name'
            value={instance?.name || ''}
            onChange={onChange}
          />
        ) : (
          <span>{category.name}</span>
        )}
        <div className='float-right'>
          <FunctionalitiesMenu
            available={!isLoading}
            onEdit={onEdit}
            onEditFinished={onEdited}
            onDeleteConfirmed={onDelete}
            confirmDeleteTimeout={4000}
          />
        </div>
      </div>
    </div>
  );
};

const emptyCategory = { name: '' };

export const AddCategoryCell = (props) => {
  const dispatch = useDispatch();
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const [instance, setInstance] = useState(emptyCategory);
  const [isAdding, setIsAdding] = React.useState(false);
  const isLoading = useSelector(databaseSelectors.isLoading());

  const onAdd = () => setIsAdding(true);

  const onCancel = () => {
    setIsAdding(false);
    setInstance(emptyCategory);
  };

  const onChange = (e) => {
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));
  };

  const onAdded = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await categoryApi.createCategory({
        payload: { ...instance, db: workingDB.id },
      });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch (e) {
      console.log('error', e);
      // handle error e, that is an instance of RequestRejected, defined in api module.
    }
    setIsAdding(false);
    setInstance(emptyCategory);
  };

  return (
    <div className='w-100 p-2'>
      <div className='m-1 clearfix'>
        {isAdding ? (
          <div className='form-row'>
            <div className='col-sm mb-2'>
              <input
                type='text'
                className='form-control'
                name='name'
                placeholder='Category name'
                value={instance.name}
                onChange={onChange}
                disabled={isLoading}
              />
            </div>
            <div className='col-sm-auto text-center'>
              <button className='btn btn-danger mx-1' onClick={onCancel}>
                Cancel
              </button>
              <button
                className='btn btn-success mx-1'
                onClick={onAdded}
                disabled={isLoading}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <button
            className='btn btn-success w-100 my-0 py-0'
            onClick={onAdd}
            disabled={isLoading}
          >
            Add new category
          </button>
        )}
      </div>
    </div>
  );
};

const ExpendituresList = ({ categoryId, ...props }) => {
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  const isLoading = useSelector(expendituresSelectors.isLoading());
  const expendituresIds = useSelector(
    expendituresSelectors.getIdsByCategory(
      categoryId,
      currentPanel === 'expected_expenditures'
    )
  );
  return (
    <React.Fragment>
      {isLoading && expendituresIds.length === 0 ? (
        <LoadingImg />
      ) : expendituresIds.length === 0 ? (
        <p className='text-center'>
          <em>No expenditures added yet.</em>
        </p>
      ) : (
        expendituresIds.map((expenditureId) => (
          <ExpenditureCell
            key={`expenditure_${expenditureId}s`}
            id={expenditureId}
          />
        ))
      )}
    </React.Fragment>
  );
};

const ExpenditureCell = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const [showEditExpenditure, setShowEditExpenditure] = useState(false);
  const hasMouse = window.matchMedia('(hover:hover').matches;
  const [showControls, setShowControls] = useState(hasMouse);
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

  const onEdit = () => {
    setShowEditExpenditure(true);
  };
  const onDelete = async () => {
    dispatch({ type: 'expenditures/isLoading' });
    try {
      const fullDB = await expenditureApi.deleteExpenditure({ id });
      dispatch({ type: 'expenditures/dataUpdated', payload: fullDB });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch (e) {}
  };

  return expenditure ? (
    <div className='pl-3 pr-1 py-1'>
      <div
        {...(hasMouse ? null : handlers)}
        className='d-flex align-items-stretch bg-light border border-dark rounded m-0'
      >
        <div className='flex-grow-1 pl-1'>
          <div className='text'>{expenditure.name}</div>
          <div className='text text-muted'>{formatDate(expenditure.date)}</div>
          <div className='text'>
            <span>{expenditure.value + ' €'}</span>
          </div>
        </div>
        <div className='d-flex flex-column'>
          <div className='flex-grow-1 mt-1 mr-1'>
            <FunctionalitiesMenu
              showExpander={hasMouse}
              showControls={!hasMouse && showControls}
              onShowControlsChanged={(showC) => {
                setShowControls(showC);
              }}
              available={!isLoading}
              onEdit={onEdit}
              onDeleteConfirmed={onDelete}
              confirmDeleteTimeout={4000}
            />
          </div>
          {(Boolean(expenditure.expected_expenditure) ||
            (expenditure.is_expected &&
              expenditure.actual_expenditures.length > 0)) && (
            <div className='clearfix'>
              <div className='float-right mb-1 mr-1'>
                <button className='btn btn-small btn-action'>
                  <InlineIcon icon={workflow16} rotate={135} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showEditExpenditure && (
        <AddEditExpenditureOffcanvas
          show={showEditExpenditure}
          onHide={() => setShowEditExpenditure(false)}
          id={id}
          expected={expenditure.is_expected}
        />
      )}
    </div>
  ) : null;
};

const CategoriesView = (props) => {
  const isLoading = useSelector(databaseSelectors.isLoading());
  const categoriesIds = useSelector(databaseSelectors.getCategoriesIds());
  const selectedPanel = 'actual';
  return (
    <React.Fragment>
      {isLoading && categoriesIds.length === 0 ? (
        <LoadingImg />
      ) : categoriesIds.length === 0 ? (
        <div className='text text-center'>
          <p>
            <em>No categories created yet.</em>
          </p>
        </div>
      ) : (
        categoriesIds.map((categoryId) => {
          return (
            <div
              key={`category_${categoryId}`}
              className='border border-primary rounded my-2'
            >
              <CategoryCell id={categoryId} />
              <ExpendituresList categoryId={categoryId} />
            </div>
          );
        })
      )}
      <AddCategoryCell />
      {selectedPanel === 'expected' && (
        <div className='w-100 p-2'>
          <button
            className='btn btn-primary w-100 my-0 py-0'
            onClick={() => {}}
          >
            Copy precend months expected expenditures
          </button>
        </div>
      )}
    </React.Fragment>
  );
};

export default CategoriesView;
