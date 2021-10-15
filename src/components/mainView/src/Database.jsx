import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';

import { databaseApi } from 'api';
import {
  LoadingImg,
  AutoBlurButton,
  FunctionalitiesMenu,
  getCurrentMonth,
} from 'utils';
import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';
import { useHistory, useParams } from 'react-router';

const emptyDatabase = { name: '' };

export const AddDatabase = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userSelectors.isLoading());
  const dbsCount = useSelector(userSelectors.countDBS());

  const [instance, setInstance] = useState(emptyDatabase);
  const [messages, setMessages] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const refName = useRef();

  const onAdd = () => setIsAdding(true);

  const onCancel = () => {
    setIsAdding(false);
    setMessages({});
    setInstance(emptyDatabase);
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
      dispatch({ type: 'user/isLoading' });
      try {
        const fullDB = await databaseApi.createDB({ payload: instance });
        const addedDB = {
          id: fullDB.id,
          name: fullDB.name,
          users: fullDB.users,
        };
        dispatch({ type: 'user/dbAdded', payload: addedDB });
        if (dbsCount === 0) {
          dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
          dispatch({ type: 'database/dataRetrieved', payload: fullDB });
          localStorage.setItem('workingDBId', fullDB.id);
          dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
        }
        setMessages({});
        setInstance(emptyDatabase);
      } catch (e) {
        dispatch({ type: 'user/loaded' });
      }
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (isAdding) {
      refName.current?.focus();
    }
  }, [isAdding]);

  return (
    <div className='py-1'>
      {isAdding ? (
        <div>
          <h5 className='text-center'>Create new database</h5>

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
          Create new database
        </AutoBlurButton>
      )}
    </div>
  );
};

const Database = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { panel } = useParams();
  const isLoading = useSelector(userSelectors.isLoading());
  const database = useSelector(userSelectors.getDBById(id));
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const isWorkingDB = database?.id === workingDB?.id;

  const [instance, setInstance] = useState({});
  const [messages, setMessages] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const refName = useRef();

  const onSetWorkingDB = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      //when a db is loaded we want to reset workingMonth to currentMonth, so we load with it and then
      const fullDB = await databaseApi.setWorkingDB({
        id: database.id,
        workingMonth: getCurrentMonth(),
      });
      // we update url so we are sure that loading went well and we send user to prospect
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.delete('month');
      history.push(
        history.location.pathname.replace(panel, 'prospect') +
          `?${urlSearchParams.toString()}`
      );

      dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
      dispatch({ type: 'database/dataRetrieved', payload: fullDB });
      localStorage.setItem('workingDBId', database.id);
    } catch (e) {
      // handle error e. Is an object that can be the json received from server or an object containing
      // {detail:'Service unreachable'}
    }
  };

  const onEdit = () => setIsEditing(true);

  const onChange = (e) => {
    const updatedInstance = { ...instance };
    if (database[e.target.name] === e.target.value) {
      delete updatedInstance[e.target.name];
    } else {
      updatedInstance[e.target.name] = e.target.value;
    }
    setInstance(updatedInstance);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdited();
    }
  };

  const validate = () => {
    let isValid = true;
    const updatedMessages = {};
    const instanceEntries = Object.entries(instance);

    if (instanceEntries.length === 0) {
      isValid = false;
    } else {
      instanceEntries.forEach(([k, v]) => {
        if (!v || !v.trim()) {
          updatedMessages.name = 'Invalid name.';
          isValid = false;
        }
      });
    }
    setMessages(updatedMessages);
    return isValid;
  };

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    if (validate()) {
      dispatch({ type: 'user/isLoading' });
      try {
        const fullDB = await databaseApi.editDB({
          id: database.id,
          payload: instance,
        });
        const editedDB = {
          id: fullDB.id,
          name: fullDB.name,
          users: fullDB.users,
        };
        dispatch({ type: 'user/dbUpdated', payload: editedDB });
        if (isWorkingDB) {
          dispatch({ type: 'expenditures/dataUpdated', payload: fullDB });
          dispatch({ type: 'database/dataUpdated', payload: fullDB });
        }
        setMessages({});
        setInstance({});
        onSuccess();
      } catch (e) {
        dispatch({ type: 'user/loaded' });
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
      refName.current?.focus();
    }
  }, [isEditing]);

  const onDelete = async (e, onSuccess = () => {}, onFail = () => {}) => {
    dispatch({ type: 'user/isLoading' });
    try {
      await databaseApi.deleteDB({ id: database.id });
      dispatch({ type: 'user/dbDeleted', payload: { id: database.id } });
      if (isWorkingDB) {
        dispatch({ type: 'expenditures/dataErased' });
        dispatch({ type: 'database/dataErased' });
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.delete('month');
        history.push(history.location.pathname + `?${urlSearchParams}`);
      }
    } catch (e) {
      dispatch({ type: 'user/loaded' });
      onFail();
    }
  };

  return (
    <div className='d-flex align-items-stretch'>
      <div className='flex-grow-1'>
        {isEditing ? (
          <div>
            <div className='d-flex align-items-center py-1'>
              <div style={{ width: 50 }}>Name</div>
              <div className='flex-grow-1'>
                <FormControl
                  name='name'
                  value={instance.name || database.name}
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
          <div className='d-flex align-items-center py-1'>
            <div>
              <AutoBlurButton
                style={{ width: 80 }}
                variant={isWorkingDB ? 'primary' : 'success'}
                size='sm'
                disabled={isWorkingDB}
                onClick={onSetWorkingDB}
              >
                {isWorkingDB ? 'selected' : 'select'}
              </AutoBlurButton>
            </div>
            <div className='flex-grow-1 ps-2'>{database?.name}</div>
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

export default Database;
