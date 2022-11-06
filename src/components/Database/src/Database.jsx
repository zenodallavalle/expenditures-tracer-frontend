import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';
import { InlineIcon } from '@iconify/react';
import personAdd16 from '@iconify/icons-octicon/person-add-16';

import {
  useDeleteDBMutation,
  useEditDBMutation,
  useGetLigthDBQuery,
} from 'api/dbApiSlice';
import {
  changedPanel,
  selectWorkingDBId,
  updatedWorkingDBId,
} from 'rdx/params';
import {
  AutoBlurButton,
  FunctionalitiesMenu,
  AutoBlurTransparentButton,
} from 'utils';

import { AddUserToDBModal } from './AddUserToDBModal';

export const Database = ({ id, ...props }) => {
  const dispatch = useDispatch();

  const { data: database, isLoading } = useGetLigthDBQuery({ id });

  const workingDBId = useSelector(selectWorkingDBId);
  const isWorkingDB = workingDBId === id;

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
    if (!validate()) {
      onSuccess();
      setIsEditing(false);
      return;
    }

    const response = await editDB({ id, ...instance });
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
                  value={instance.name || database?.name || ''}
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
            <div className='flex-grow-1 ps-2'>
              {database?.name || `db with id=${id}`}
            </div>
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
        disabled={isLoading}
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
