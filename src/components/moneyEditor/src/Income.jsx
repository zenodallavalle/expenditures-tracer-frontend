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
        const fullDB = await cashApi.createCash({ payload });
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
  const income = useSelector(databaseSelectors.getIncomeById(id));

  const [instance, setInstance] = useState({});
  const [messages, setMessages] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const refName = useRef();
  const refValue = useRef();

  const onEdit = () => setIsEditing(true);

  const onChange = (e) => {
    const updatedInstance = { ...instance };
    if (income[e.target.name] === e.target.value) {
      delete updatedInstance[e.target.name];
    } else {
      updatedInstance[e.target.name] = e.target.value;
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

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    if (validate()) {
      dispatch({ type: 'database/isLoading' });
      try {
        const payload = {
          ...instance,
        };
        if (instance.value) {
          payload.value = parseFloat(parseFloat(instance.value).toFixed(2));
        }
        const fullDB = await cashApi.editCash({ id, payload });
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

  const onDelete = async (e, onSuccess = () => {}, onFail = () => {}) => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await cashApi.deleteCash({ id });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
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

export default Income;
