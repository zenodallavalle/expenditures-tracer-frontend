import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FormControl from 'react-bootstrap/FormControl';
import { InlineIcon } from '@iconify/react';
import personAdd16 from '@iconify/icons-octicon/person-add-16';

import { databaseApi } from 'api';
import {
  LoadingImg,
  AutoBlurButton,
  FunctionalitiesMenu,
  getCurrentMonth,
  AutoBlurTransparentButton,
} from 'utils';
import { userSelectors } from 'rdx/user';
import { databaseSelectors } from 'rdx/database';

import AddUserToDBModal from './AddUserToDBModal';
import { useUserTokenAuthQuery } from 'api/userApiSlice';
import {
  useDeleteDBMutation,
  useEditDBMutation,
  useNewDBMutation,
} from 'api/dbsApiSlice';
import { alertsActions } from 'rdx/alerts';
import {
  changedPanel,
  selectWorkingDBId,
  updatedWorkingDBId,
} from 'rdx/params';

const emptyDatabase = { name: '' };

export const AddDatabase = ({ ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const isLoading = useSelector(userSelectors.isLoading());
  // const dbsCount = useSelector(userSelectors.countDBS());
  const { data: user, isFetching: isFetchingUser } = useUserTokenAuthQuery();
  const [newDB, { isError: isErrorNewDB, error, isFetching: isFetchingNewDB }] =
    useNewDBMutation();
  const isFetching = isFetchingUser || isFetchingNewDB;
  const dbsCount = user.dbs.length;

  console.log(error);

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
      const response = await newDB({ name: instance.name });
      if (response.data) {
        if (dbsCount === 0) {
          dispatch(updatedWorkingDBId(response.data.id));
          const urlSearchParams = new URLSearchParams(window.location.search);
          urlSearchParams.delete('month');
          urlSearchParams.set('panel', 'prospect');
          navigate(`/?${urlSearchParams.toString()}`);
        }
        setMessages({});
        setInstance(emptyDatabase);
      } else if (response.error) {
        dispatch({
          type: 'alerts/added',
          payload: {
            variant: 'danger',
            message: 'Error while creating new DB.',
          },
        });
      }
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
                disabled={isFetching}
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
                disabled={isFetching}
              >
                Cancel
              </AutoBlurButton>
            </div>
            <div className='ps-1 flex-grow-1'>
              <AutoBlurButton
                variant='success'
                className='w-100'
                onClick={onAdded}
                disabled={isFetching}
              >
                {isFetching ? <LoadingImg maxWidth={25} /> : 'Save'}
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
  const navigate = useNavigate();
  // const isLoading = useSelector(userSelectors.isLoading());
  // const database = useSelector(userSelectors.getDBById(id));
  // const workingDB = useSelector(databaseSelectors.getWorkingDB());
  // const isWorkingDB = database?.id === workingDB?.id;
  const workingDBId = useSelector(selectWorkingDBId);
  const isWorkingDB = workingDBId === id;
  const {
    data: user,
    isLoading,
    isFetching: isFetchingUser,
  } = useUserTokenAuthQuery();

  const database = user.dbs.find((db) => db.id === id);

  const [editDB, { isFetching: isFetchingEditDB }] = useEditDBMutation();
  const [deleteDB, { isFetching: isFetchingDeleteDB }] = useDeleteDBMutation();

  const [instance, setInstance] = useState({});
  const [messages, setMessages] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const refName = useRef();

  const onSetWorkingDB = async () => {
    dispatch(updatedWorkingDBId(id));
    dispatch(changedPanel('prospect'));
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
      const response = await editDB({ id, ...instance });
      console.log(response);
      if (response.data) {
        setMessages({});
        setInstance({});
        onSuccess();
        setIsEditing(false);
      } else if (response.error) {
        dispatch({
          type: 'alerts/added',
          payload: {
            variant: 'danger',
            message: 'Error while editing DB.',
          },
        });
        onFail();
      }
      //   dispatch({ type: 'user/isLoading' });
      //   try {
      //     const fullDB = await databaseApi.editDB({
      //       id: database.id,
      //       payload: instance,
      //     });
      //     const editedDB = {
      //       id: fullDB.id,
      //       name: fullDB.name,
      //       users: fullDB.users,
      //     };
      //     dispatch({ type: 'user/dbUpdated', payload: editedDB });
      //     if (isWorkingDB) {
      //       dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
      //       dispatch({ type: 'database/dataUpdated', payload: fullDB });
      //     }
      //     setMessages({});
      //     setInstance({});
      //     onSuccess();
      //   } catch (e) {
      //     dispatch({ type: 'user/loaded' });
      //     onFail();
      //   }
      //   setIsEditing(false);
      // } else {
      //   const instanceEntries = Object.entries(instance);
      //   if (instanceEntries.length === 0) {
      //     setIsEditing(false);
      //     onSuccess();
      //   }
    }
  };

  useEffect(() => {
    if (isEditing) {
      refName.current?.focus();
    }
  }, [isEditing]);

  const onDelete = async (e, onSuccess = () => {}, onFail = () => {}) => {
    const response = await deleteDB({ id });
    if (response.data) {
      onSuccess();
    } else if (response.error) {
      dispatch({
        type: 'alerts/added',
        payload: {
          variant: 'danger',
          message: 'Error while deleting DB.',
        },
      });
      onFail();
    }
    // dispatch({ type: 'user/isLoading' });
    // try {
    //   await databaseApi.deleteDB({ id: database.id });
    //   dispatch({ type: 'user/dbDeleted', payload: { id: database.id } });
    //   if (isWorkingDB) {
    //     dispatch({ type: 'expenditures/dataErased' });
    //     dispatch({ type: 'database/dataErased' });
    //     const urlSearchParams = new URLSearchParams(window.location.search);
    //     urlSearchParams.delete('month');
    //     navigate(`/?${urlSearchParams}`);
    //   }
    // } catch (e) {
    //   dispatch({ type: 'user/loaded' });
    //   onFail();
    // }
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
                  disabled={isFetchingEditDB}
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
      <div>
        <AutoBlurTransparentButton
          disabled={isFetchingEditDB}
          onClick={() => setShowAddUserModal(true)}
        >
          <InlineIcon icon={personAdd16} />
        </AutoBlurTransparentButton>
      </div>
      <FunctionalitiesMenu
        clickable={!isFetchingEditDB & !isFetchingDeleteDB}
        onEdit={onEdit}
        isEditing={isEditing}
        onEdited={onEdited}
        onDelete={onDelete}
        deleteConfirmTimeout={4000}
        autocollapseTimeout={4000}
      />
      <AddUserToDBModal
        show={showAddUserModal}
        onHide={() => setShowAddUserModal(false)}
        dbId={id}
      />
    </div>
  );
};

export default Database;
