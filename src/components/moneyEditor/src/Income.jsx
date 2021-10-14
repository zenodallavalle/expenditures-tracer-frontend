import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';

import { cashApi } from 'api';
import { LoadingImg, AutoBlurButton, FunctionalitiesMenu } from 'utils';
import { databaseSelectors } from 'rdx/database';

const emptyCash = { name: '', value: '' };

export const AddIncome = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(databaseSelectors.isLoading());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const workingMonth = useSelector(databaseSelectors.getWorkingMonth());

  const [instance, setInstance] = useState(emptyCash);
  const [messages, setMessages] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const refName = useRef();
  const refValue = useRef();

  const onAdd = () => setIsAdding(true);

  const onCancel = () => {
    setIsAdding(false);
    setMessages({});
    setInstance(emptyCash);
  };

  const onChange = (e) => {
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'value') {
        refName?.current.focus();
      } else {
        onAdded();
      }
    }
  };

  const validate = () => {
    let isValid = true;
    const floated = parseFloat(instance.value);
    const updatedMessages = {};
    if (isNaN(floated) || floated <= 0) {
      updatedMessages.value =
        'Invalid value, must be a positive decimal number.';
      isValid = false;
    }
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
        const payload = {
          ...instance,
          value: parseFloat(instance.value),
          db: workingDB.id,
          income: true,
        };
        const fullDB = await cashApi.createCash({ payload, workingMonth });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
        setMessages({});
        setInstance(emptyCash);
      } catch (e) {
        dispatch({ type: 'database/loaded' });
      }
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (isAdding) {
      refValue.current?.focus();
    }
  }, [isAdding]);

  return (
    <div>
      {isAdding ? (
        <div>
          <h5 className='text-center'>Register new income</h5>

          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 50 }}>Value</div>
            <div className='flex-grow-1'>
              <FormControl
                name='value'
                value={instance.value}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refValue}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages?.value && (
            <div className='text-danger'>{messages.value} </div>
          )}

          <div className='d-flex align-items-baseline py-1'>
            <div style={{ width: 50 }}>Name</div>
            <div className='flex-grow-1'>
              <FormControl
                name='name'
                value={instance.name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refName}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages?.name && (
            <div className='text-danger'>{messages.name} </div>
          )}

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
          Register new income
        </AutoBlurButton>
      )}
    </div>
  );
};

const Income = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(databaseSelectors.isLoading());
  const workingMonth = useSelector(databaseSelectors.getWorkingMonth());
  const income = useSelector(databaseSelectors.getIncomeById(id));

  const [instance, setInstance] = useState({});
  const [messages, setMessages] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const refName = useRef();
  const refValue = useRef();

  const onEdit = () => setIsEditing(true);

  const onChange = (e) => {
    const updatedInstance = { ...instance };
    const floated = parseFloat(e.target.value);
    if (!e.target.name === 'value' || !isNaN(floated)) {
      const value = e.target.name === 'value' ? floated : e.target.value;
      if (income[e.target.name] === value) {
        delete updatedInstance[e.target.name];
      } else {
        updatedInstance[e.target.name] = value;
      }
    }
    setInstance(updatedInstance);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.target.name === 'value') {
        refName?.current.focus();
      } else {
        onEdited();
      }
    }
  };

  const validate = () => {
    let isValid = true;
    const floated = parseFloat(instance?.value);
    const updatedMessages = {};
    const instanceEntries = Object.entries(instance);

    if (instanceEntries.length === 0) {
      isValid = false;
    } else {
      instanceEntries.forEach(([k, v]) => {
        if (k === 'value') {
          if (isNaN(floated) || floated <= 0) {
            updatedMessages.value =
              'Invalid value, must be a positive decimal number.';
            isValid = false;
          }
        } else {
          if (!v || !v.trim()) {
            updatedMessages.name = 'Invalid name.';
            isValid = false;
          }
        }
      });
    }

    setMessages(updatedMessages);
    return isValid;
  };

  const onEdited = async (e, onSuccess, onFail) => {
    if (validate()) {
      dispatch({ type: 'database/isLoading' });
      try {
        const payload = {
          ...instance,
        };
        const fullDB = await cashApi.editCash({ id, payload, workingMonth });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
        setMessages({});
        setInstance({});
        onSuccess();
      } catch (e) {
        dispatch({ type: 'database/loaded' });
        onFail();
      }
      setIsEditing(false);
    } else {
      const instanceEntries = Object.entries(instance);

      if (instanceEntries.length === 0) {
        setIsEditing(false);
        onSuccess();
      }
    }
  };

  useEffect(() => {
    if (isEditing) {
      refValue.current?.focus();
    }
  }, [isEditing]);

  const onDelete = async (e, onSuccess, onFail) => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await cashApi.deleteCash({ id, workingMonth });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
      onSuccess();
    } catch (e) {
      dispatch({ type: 'database/loaded' });
      onFail();
    }
  };

  return (
    <div className='d-flex align-items-stretch'>
      <div className='flex-grow-1'>
        {isEditing ? (
          <div>
            <div className='d-flex align-items-baseline py-1'>
              <div style={{ width: 50 }}>Value</div>
              <div className='flex-grow-1'>
                <FormControl
                  name='value'
                  value={instance.value || income.value}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  ref={refValue}
                  disabled={isLoading}
                />
              </div>
            </div>
            {messages?.value && (
              <div className='text-danger'>{messages.value} </div>
            )}

            <div className='d-flex align-items-baseline py-1'>
              <div style={{ width: 50 }}>Name</div>
              <div className='flex-grow-1'>
                <FormControl
                  name='name'
                  value={instance.name || income.name}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  ref={refName}
                  disabled={isLoading}
                />
              </div>
            </div>
            {messages?.name && (
              <div className='text-danger'>{messages.name} </div>
            )}
          </div>
        ) : (
          <div>
            <div>
              <span>{income?.value}</span>
              <span className='ms-1'>€</span>
            </div>
            <div className='text-muted fst-italic'>{income?.name}</div>
          </div>
        )}
      </div>
      <FunctionalitiesMenu
        clickable={!isLoading}
        onEdit={onEdit}
        isEditing={isEditing}
        onEdited={onEdited}
        onDelete={onDelete}
        deleteConfirmTimeout={4000}
        autocollapseTimeout={4000}
      />
    </div>
  );
};

export const AddIncomeCell = ({ ...props }) => {
  const dispatch = useDispatch();
  const [instance, setInstance] = useState(emptyCash);
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const workingMonth = useSelector(databaseSelectors.getWorkingMonth());
  const [isAdding, setIsAdding] = useState(false);
  const isLoading = useSelector(databaseSelectors.isLoading());

  const onAdd = () => setIsAdding(true);

  const onCancel = () => {
    setIsAdding(false);
  };

  const onChange = (e) => {
    const floated = parseFloat(e.target.value);
    const val =
      e.target.name === 'value'
        ? isNaN(floated)
          ? undefined
          : floated
        : e.target.value;
    if (val !== undefined) {
      setInstance((instance) => ({
        ...instance,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onAdded = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      const payload = { ...instance, db: workingDB.id, income: true };
      const fullDB = await cashApi.createCash({ payload, workingMonth });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
      setInstance(emptyCash);
    } catch (e) {
      dispatch({ type: 'database/loaded' });
    }
    setIsAdding(false);
  };

  return (
    <div className='w-100 p-2'>
      <div className='m-1 clearfix'>
        {isAdding ? (
          <div>
            <h5>Register new income</h5>
            <div className='form-row'>
              <div className='col-md mb-2'>
                <div className='form-row'>
                  <div className='col-sm'>
                    <input
                      type='number'
                      step={0.01}
                      className='form-control'
                      name='value'
                      placeholder='Value'
                      value={instance.value}
                      onChange={onChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div className='col-sm'>
                    <input
                      type='text'
                      className='form-control'
                      name='name'
                      placeholder='Name'
                      value={instance.name}
                      onChange={onChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              <div className='col-md-auto text-center'>
                <AutoBlurButton
                  variant='danger'
                  className='mx-1'
                  onClick={onCancel}
                >
                  Cancel
                </AutoBlurButton>
                <AutoBlurButton
                  variant='success'
                  className='mx-1'
                  onClick={onAdded}
                  disabled={isLoading}
                >
                  Save
                </AutoBlurButton>
              </div>
            </div>
          </div>
        ) : (
          <AutoBlurButton
            variant='success'
            className='w-100 my-0 py-0'
            onClick={onAdd}
            disabled={isLoading}
          >
            Register new income
          </AutoBlurButton>
        )}
      </div>
    </div>
  );
};
export default Income;
