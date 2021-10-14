import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';

import { categoryApi } from 'api';
import { AutoBlurButton, FunctionalitiesMenu } from 'utils';
import { databaseSelectors } from 'rdx/database';
import { localInfoSelectors } from 'rdx/localInfo';

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
          </div>

          <div>
            <AutoBlurButton variant='danger' onClick={onCancel}>
              Cancel
            </AutoBlurButton>
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

const Category = ({
  id,
  children = null,
  hideProspect = false,
  readOnly = false,
  ...props
}) => {
  const dispatch = useDispatch();
  const category = useSelector(databaseSelectors.getCategoryById(id));
  const isLoading = useSelector(databaseSelectors.isLoading());
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());

  const [instance, setInstance] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const ref = useRef();

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

  const onEdited = async (e, collapseFunctionalityMenu) => {
    if (Object.keys(instance).length > 0) {
      dispatch({ type: 'database/isLoading' });
      try {
        const fullDB = await categoryApi.editCategory({
          id,
          payload: instance,
        });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
      } catch {
        // error catched will be an instance of RequestRejected
      }
    }

    setInstance({});
    setIsEditing(false);
    collapseFunctionalityMenu();
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

  const numberOfExpenditures =
    currentPanel === 'expected_expenditures'
      ? category?.expected_expenditures.length
      : category?.actual_expenditures.length;

  const totalCostOfExpenditures =
    currentPanel === 'expected_expenditures'
      ? category?.prospect.expected_expenditure
      : category?.prospect.actual_expenditure;

  const prospectCompiled = (
    <div className='d-flex p-1'>
      <div className='flex-grow-1'>
        <span>{numberOfExpenditures}</span>
        <span className='ms-1'>entries</span>
      </div>
      <div>
        <span>{totalCostOfExpenditures}</span>
        <span className='ms-1'>€</span>
      </div>
    </div>
  );

  return (
    <div className='border rounded border-primary px-1 mt-1 mb-3'>
      <div className='d-flex align-items-center pb-1'>
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
      {children}
      {numberOfExpenditures && !hideProspect ? prospectCompiled : ''}
    </div>
  );
};

export default Category;
