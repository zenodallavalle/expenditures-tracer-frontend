import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';
import { InlineIcon } from '@iconify/react';
import plus16 from '@iconify/icons-octicon/plus-16';
import dash16 from '@iconify/icons-octicon/dash-16';
import eyeClosed16 from '@iconify/icons-octicon/eye-closed-16';

import { categoryApi } from 'api';
import {
  AutoBlurButton,
  AutoBlurTransparentButton,
  FunctionalitiesMenu,
  LoadingImg,
} from 'utils';
import { databaseSelectors, databaseActions } from 'rdx/database';

export const ExpandHiddenCategories = ({ ...props }) => {
  const dispatch = useDispatch();
  const onClick = () => {
    dispatch(databaseActions.expandHiddenCategories());
  };
  const hiddenCategoriesIds = useSelector(
    databaseSelectors.getHiddenCategoriesIds()
  );
  if (hiddenCategoriesIds.length === 0) return null;
  else
    return (
      <div>
        <AutoBlurButton className='w-100' onClick={onClick}>
          Expand hidden categories
        </AutoBlurButton>
      </div>
    );
};

const emptyCategory = { name: '' };

export const AddCategory = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(databaseSelectors.isLoading());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const [instance, setInstance] = useState(emptyCategory);
  const [messages, setMessages] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const ref = useRef();

  const onAdd = () => setIsAdding(true);

  const onCancel = () => {
    setIsAdding(false);
    setMessages({});
    setInstance(emptyCategory);
  };

  const onChange = (e) => {
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onAdded();
    }
  };

  const validate = () => {
    let isValid = true;
    const updatedMessages = {};
    if (!instance.name || !instance.name.trim()) {
      updatedMessages.name = 'Invalid name.';
      isValid = false;
    }
    setMessages(updatedMessages);
    return isValid;
  };

  const onAdded = async () => {
    if (validate()) {
      dispatch({ type: 'database/isLoading' });
      try {
        const fullDB = await categoryApi.createCategory({
          payload: { ...instance, db: workingDB.id },
        });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
        setMessages({});
        setInstance(emptyCategory);
      } catch (e) {
        console.log('error', e);
        // handle error e, that is an instance of RequestRejected, defined in api module.
        dispatch({ type: 'database/loaded' });
      }
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (isAdding) {
      ref.current?.focus();
    }
  }, [isAdding]);

  return (
    <div>
      {isAdding ? (
        <div className='d-flex align-items-center'>
          <div className='d-flex flex-grow-1 align-items-baseline'>
            <div>Name</div>
            <div className='flex-grow-1 mx-2'>
              <FormControl
                name='name'
                value={instance.name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={ref}
                disabled={isLoading}
              />
            </div>
            {messages.name && (
              <div className='text-danger'>{messages.name}</div>
            )}
          </div>

          <div className='d-flex align-items-baseline py-1'>
            <div className='pe-1 flex-grow-1'>
              <AutoBlurButton
                variant='danger'
                className='w-100'
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </AutoBlurButton>
            </div>
            <div className='ps-1 flex-grow-1'>
              <AutoBlurButton
                variant='success'
                className='w-100'
                onClick={onAdded}
                disabled={isLoading}
              >
                {isLoading ? <LoadingImg maxWidth={25} /> : 'Save'}
              </AutoBlurButton>
            </div>
          </div>
        </div>
      ) : (
        <AutoBlurButton className='w-100' onClick={onAdd} variant='success'>
          Add new category
        </AutoBlurButton>
      )}
    </div>
  );
};

export const CategoryProspect = ({ id, expected, ...props }) => {
  const category = useSelector(databaseSelectors.getCategoryById(id));
  const numberOfExpenditures = expected
    ? category?.expected_expenditures.length
    : category?.actual_expenditures.length;

  const totalCostOfExpenditures = expected
    ? category?.prospect.expected_expenditure
    : category?.prospect.actual_expenditure;

  return (
    <div>
      {numberOfExpenditures ? (
        <div className='d-flex p-1'>
          <div className='flex-grow-1'>
            <span>{numberOfExpenditures}</span>
            <span className='ms-1'>
              {numberOfExpenditures === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div>
            <span>{totalCostOfExpenditures}</span>
            <span className='ms-1'>€</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Category = ({ id, children = null, readOnly = false, ...props }) => {
  const dispatch = useDispatch();
  const category = useSelector(databaseSelectors.getCategoryById(id));
  const isLoading = useSelector(databaseSelectors.isLoading());

  const [instance, setInstance] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const ref = useRef();

  const collapsed = category?.status === 'collapsed';
  const hidden = category?.status === 'hidden';

  const toggleCollapsed = () => {
    dispatch(
      databaseActions.updateCategoryState({
        id,
        status: collapsed ? 'expanded' : 'collapsed',
      })
    );
  };

  const hideCategory = () => {
    dispatch(
      databaseActions.updateCategoryState({
        id,
        status: 'hidden',
      })
    );
  };

  const onChange = (e) =>
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdited();
    }
  };

  const onEdit = (e) => {
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    if (Object.keys(instance).length > 0) {
      dispatch({ type: 'database/isLoading' });
      try {
        const fullDB = await categoryApi.editCategory({
          id,
          payload: instance,
        });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
        setInstance({});
        setIsEditing(false);
        onSuccess();
      } catch {
        // error catched will be an instance of RequestRejected
        dispatch({ type: 'database/loaded' });
        onFail();
      }
    } else {
      onSuccess();
      setIsEditing(false);
    }
  };

  const onDelete = async (e, onSuccess = () => {}, onFail = () => {}) => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await categoryApi.deleteCategory({ id });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
      onSuccess();
    } catch (e) {
      // error catched will be an instance of RequestRejected
      onFail();
    }
  };

  const FunctionalitiesMenuCompiled = (
    <FunctionalitiesMenu
      clickable={!isLoading}
      onEdit={onEdit}
      isEditing={isEditing}
      onEdited={onEdited}
      onDelete={onDelete}
      deleteConfirmTimeout={4000}
      autocollapseTimeout={4000}
    />
  );

  if (hidden) return null;

  return (
    <div className='border rounded border-primary px-1 mt-1 mb-3'>
      <div className='d-flex align-items-center pb-1'>
        <div>
          <AutoBlurTransparentButton onClick={toggleCollapsed}>
            <InlineIcon icon={collapsed ? plus16 : dash16} />
          </AutoBlurTransparentButton>
        </div>
        {collapsed && (
          <div>
            <AutoBlurTransparentButton onClick={hideCategory}>
              <InlineIcon icon={eyeClosed16} />
            </AutoBlurTransparentButton>
          </div>
        )}
        <div className='flex-grow-1 text-primary px-1'>
          {isEditing ? (
            <FormControl
              name='name'
              className='my-1 me-2'
              value={instance?.name || category?.name || ''}
              onChange={onChange}
              onKeyDown={onKeyDown}
              ref={ref}
              disabled={isLoading}
            />
          ) : (
            <div>{category?.name}</div>
          )}
        </div>
        {!readOnly && <div>{FunctionalitiesMenuCompiled}</div>}
      </div>
      {!collapsed && children}
    </div>
  );
};

export default Category;
