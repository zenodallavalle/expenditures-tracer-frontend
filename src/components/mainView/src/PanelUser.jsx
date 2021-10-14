import { databaseSelectors } from 'rdx/database';
import { userSelectors } from 'rdx/user';
import { useEffect, useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useSelector, useDispatch } from 'react-redux';
import { databaseApi, userApi } from 'api';
import FunctionalitiesMenu from '../../../utils/src/FunctionalitiesMenu';
import { LoadingImg } from 'utils';

const DBCell = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const db = useSelector(userSelectors.getDBById(id));
  const workingDB = useSelector(databaseSelectors.content());
  const isWorkingDB = db?.id === workingDB?.id;
  const isLoading = useSelector(userSelectors.isLoading());
  const [instance, setInstance] = useState({ name: db.name });
  const [isEditing, setIsEditing] = useState(false);

  const ref = useRef();

  useEffect(() => {
    setInstance({ name: db.name });
  }, [db]);

  const onEdit = (e) => {
    setIsEditing(true);
  };

  const onChange = (e) =>
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));

  const handleOk = (e) => {
    if (e.key === 'Enter') {
      onEdited();
    }
  };

  useEffect(() => {
    if (isEditing) {
      ref.current?.focus();
    }
  }, [isEditing]);

  const onSetWorkingDB = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await databaseApi.setWorkingDB({ id: db.id });
      dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
      dispatch({ type: 'database/dataRetrieved', payload: fullDB });
      localStorage.setItem('workingDBId', db.id);
      dispatch({ type: 'localInfo/panelChanged', payload: 'prospect' });
      dispatch({
        type: 'localInfo/setWorkingMonth',
        payload: fullDB.months_list.find((m) => m.is_working).month,
      });
    } catch (e) {
      // handle error e. Is an object that can be the json received from server or an object containing
      // {detail:'Service unreachable'}
    }
  };

  const onEdited = async (e, onSuccess, onFail) => {
    dispatch({ type: 'user/isLoading' });
    try {
      const fullDB = await databaseApi.editDB({ id: db.id, payload: instance });
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
      onSuccess();
    } catch (e) {
      console.log('error', e);
      // handle error e, that is an instance of RequestRejected, defined in api module.
      setInstance(db);
      onFail();
    }
    setIsEditing(false);
  };

  const onDelete = async () => {
    dispatch({ type: 'user/isLoading' });
    try {
      await databaseApi.deleteDB({ id: db.id });
      dispatch({ type: 'user/dbDeleted', payload: { id: db.id } });
      if (isWorkingDB) {
        dispatch({ type: 'database/dataErased' });
        dispatch({ type: 'expenditures/dataErased' });
      }
    } catch (e) {
      // handle error e, that is an instance of RequestRejected, defined in api module.
    }
  };

  return (
    <li className='list-group-item p-3'>
      <div className='d-flex justify-content-between'>
        <div style={{ width: 100 }}>
          {isLoading ? (
            <LoadingImg style={{ maxHeight: 30 }} />
          ) : (
            <Button
              variant={isWorkingDB ? 'success' : 'primary'}
              size='sm'
              className='select-db'
              onClick={() => onSetWorkingDB()}
              disabled={isLoading || isWorkingDB}
            >
              {isWorkingDB ? 'selected' : 'select'}
            </Button>
          )}
        </div>
        <div className='flex-grow-1'>
          {isEditing ? (
            <input
              onKeyPress={handleOk}
              ref={ref}
              className='mx-3'
              type='text'
              name='name'
              value={instance.name}
              onChange={onChange}
            />
          ) : (
            <span className='mx-3'>{db.name}</span>
          )}
        </div>
        <div>
          <FunctionalitiesMenu
            clickable={!isLoading}
            autocollapseTimeout={4000}
            onEdit={onEdit}
            isEditing={isEditing}
            onDelete={onDelete}
            confirmDeleteTimeout={4000}
          />
        </div>
      </div>
    </li>
  );
};

const emptyDB = { name: '' };

const AddDBCell = ({ ...props }) => {
  const dispatch = useDispatch();
  const dbsCount = useSelector(userSelectors.countDBS());
  const isLoading = useSelector(userSelectors.isLoading());
  const [instance, setInstance] = useState(emptyDB);
  const [isAdding, setIsAdding] = useState(false);

  const onAdd = () => setIsAdding(true);
  const onCancel = () => setIsAdding(false);
  const onChange = (e) =>
    setInstance((instance) => ({
      ...instance,
      [e.target.name]: e.target.value,
    }));
  const onAdded = async () => {
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
        dispatch({
          type: 'localInfo/setWorkingMonth',
          payload: fullDB.months_list.find((m) => m.is_working).month,
        });
      }
    } catch (e) {
      console.log('error', e);
      // handle error e, that is an instance of RequestRejected, defined in api module.
    }
    setInstance(emptyDB);
    setIsAdding(false);
  };

  return (
    <div className='w-100 p-3'>
      <div className='m-1 clearfix'>
        {isAdding ? (
          <div className='form-row'>
            <div className='col-sm mb-2'>
              <input
                type='text'
                className='form-control'
                name='name'
                placeholder='DB name'
                value={instance.name}
                onChange={onChange}
                disabled={isLoading}
              />
            </div>
            <div className='col-sm-auto text-center'>
              <Button variant='danger' className='mx-1' onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant='success'
                className='mx-1'
                onClick={onAdded}
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant='success'
            className='w-100 my-0 py-0'
            onClick={onAdd}
            disabled={isLoading}
          >
            Add new DB
          </Button>
        )}
      </div>
    </div>
  );
};

const User = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(userSelectors.isLoading());
  const error = useSelector(userSelectors.error());
  const isAuthenticated = useSelector(userSelectors.isAuthenticated());
  const user = useSelector(userSelectors.user());

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState({});
  const [resMessages, setResMessages] = useState({});
  const onLogin = async () => {
    if (!username || !password || !username.trim() || !password.trim()) {
      setMessages({
        username:
          !username || !username.trim() ? ['This field is required.'] : [],
        password:
          !password || !password.trim() ? ['This field is required.'] : [],
      });
    } else {
      setMessages({});
      setResMessages({});
      const action = await dispatch(userApi.login({ username, password }));
      const json = action.payload;
      const { response } = action.meta;
      if (response) {
        setResMessages(json);
        if (json.non_field_errors) {
          dispatch({
            type: 'alerts/added',
            payload: {
              variant: 'danger',
              message: json.non_field_errors.join(', '),
            },
          });
        }
      }
    }
  };
  const onLogout = () => {
    dispatch(userApi.logout());
    dispatch({ type: 'database/dataErased' });
    dispatch({ type: 'expenditures/dataErased' });
    dispatch({
      type: 'alerts/added',
      payload: { variant: 'success', message: 'User logged out.' },
    });
  };
  return (
    <div>
      {error && <Alert variant='danger'>{error}</Alert>}
      {isAuthenticated ? (
        //user logged in
        <div>
          <h4>Logged in as {user.username}</h4>
          <div className='text'>
            <h5>Available DBs:</h5>
            {user.dbs.length > 0 && (
              <ul className='list-group'>
                {user.dbs.map((db) => (
                  <DBCell key={`db_${db.id}`} id={db.id} />
                ))}
              </ul>
            )}
            {user.dbs.length === 0 && (
              <div className='text-center'>
                <p>
                  <em>No databases created yet.</em>
                </p>
              </div>
            )}
            <AddDBCell />
          </div>
          <div className='text-center'>
            <Button
              variant='primary'
              onClick={onLogout}
              disabled={isLoading || error}
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        //user not logged in
        <div>
          <h4>Please login</h4>
          <form>
            <div className='form-group'>
              <p>
                <label htmlFor='username'>Username/email</label>
                <input
                  type='text'
                  className='form-control'
                  name='username'
                  placeholder='username/email'
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  disabled={isLoading || error}
                />
                {messages.username?.map((m, idx) => (
                  <div
                    key={`msg_login_username_val_${idx}`}
                    className='text-danger'
                  >
                    {m}
                  </div>
                ))}
                {resMessages.username?.map((m, idx) => (
                  <div
                    key={`msg_login_username_res_${idx}`}
                    className='text-danger'
                  >
                    {m}
                  </div>
                ))}
              </p>
              <p>
                <label htmlFor='password'>Password</label>
                <input
                  type='password'
                  className='form-control'
                  name='password'
                  placeholder='password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  disabled={isLoading || error}
                />
                {messages.password?.map((m, idx) => (
                  <div key={`msg_login_pwd_val_${idx}`} className='text-danger'>
                    {m}
                  </div>
                ))}
                {resMessages.password?.map((m, idx) => (
                  <div key={`msg_login_pwd_res_${idx}`} className='text-danger'>
                    {m}
                  </div>
                ))}
              </p>
            </div>
          </form>
          <div className='text-center'>
            <Button
              variant='primary'
              onClick={onLogin}
              disabled={isLoading || error}
            >
              Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
