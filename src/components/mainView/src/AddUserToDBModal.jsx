import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import { InlineIcon } from '@iconify/react';
import xCircle16 from '@iconify/icons-octicon/x-circle-16';

import { databaseSelectors } from 'rdx/database';
import { userSelectors } from 'rdx/user';
import { usersSelectors } from 'rdx/users';

import { databaseApi, userApi } from 'api';
import { AutoBlurTransparentButton } from 'utils';

const UserElement = ({ id, onExclude, ...props }) => {
  const mainUser = useSelector(userSelectors.user());
  const user = useSelector(usersSelectors.getById(id));
  const isMainUser = id === mainUser.id;
  const isLoading = useSelector(databaseSelectors.isLoading());

  return (
    <ListGroupItem>
      <div className='d-flex align-items-baseline'>
        <div className='flex-grow-1'>{user?.username || `user_id${id}`}</div>
        {isMainUser ? (
          <div className='text-nowrap small fst-italic'>
            You cannot exclude yourself
          </div>
        ) : (
          <div>
            <AutoBlurTransparentButton
              onClick={() => onExclude(id)}
              disabled={isLoading}
            >
              <InlineIcon icon={xCircle16} />
            </AutoBlurTransparentButton>
          </div>
        )}
      </div>
    </ListGroupItem>
  );
};

const DropdownElement = ({ id, usersInDb = [], ...props }) => {
  const user = useSelector(usersSelectors.getById(id));
  const isUserInDb = usersInDb.indexOf(id) >= 0;

  return (
    <Dropdown.Item eventKey={id} disabled={isUserInDb}>
      <div className='d-flex'>
        <div className='flex-grow-1'>
          {user?.username || `usernameId ${id}`}
        </div>
        {isUserInDb && (
          <div className='text-nowrap fst-italic'>
            <small>This user is alredy in DB</small>
          </div>
        )}
      </div>
    </Dropdown.Item>
  );
};

const emptyResults = { ids: [], hasNext: false, hasSearched: false };

const AddUserToDBModal = ({ show, onHide, dbId, ...props }) => {
  const [queryString, setQueryString] = useState('');
  const [results, setResults] = useState(emptyResults);
  const [showDropdown, setShowDropdown] = useState(false);
  const db = useSelector(userSelectors.getDBById(dbId));
  const dispatch = useDispatch();

  const onExcludeUser = async (userId) => {
    const fullDB = await databaseApi.editDB({
      id: db.id,
      payload: {
        users: db.users.filter((id) => id !== userId),
      },
    });
    dispatch({ type: 'user/dbUpdated', payload: fullDB });
  };

  const searchUsers = async (username) => {
    const res = await dispatch(userApi.search({ username }));
    if (res.meta.response.ok) {
      setResults({
        ids: res.payload.results.map((u) => u.id),
        hasNext: Boolean(res.payload.next),
        hasSearched: true,
      });
    }
  };

  const onSelect = async (userId) => {
    setQueryString('');
    setResults(emptyResults);

    const fullDB = await databaseApi.editDB({
      id: db.id,
      payload: {
        users: [...db.users, userId],
      },
    });
    dispatch({ type: 'user/dbUpdated', payload: fullDB });
  };

  const onUsernameSearchChange = (e) => {
    setQueryString(e.target.value);
    if (e.target.value.trim()) {
      setShowDropdown(true);
      searchUsers(e.target.value.trim());
    } else {
      setResults(emptyResults);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <span className='me-1'>Manage users related to database</span>
        <span className='fst-italic fw-bold'>{db?.name}</span>
      </Modal.Header>
      <Modal.Body>
        <h5 className='small'>Edit users</h5>
        <ListGroup>
          {db?.users.map((userId) => (
            <UserElement
              id={userId}
              key={`db_${dbId}_user_${userId}`}
              onExclude={onExcludeUser}
            />
          ))}
        </ListGroup>
        <h5 className='small mt-4'>Select users to add to database</h5>

        <Dropdown
          className='m-1'
          onToggle={setShowDropdown}
          show={showDropdown && results.hasSearched}
          onSelect={onSelect}
        >
          <Dropdown.Toggle
            as='input'
            placeholder='Type something to search'
            value={queryString}
            onChange={onUsernameSearchChange}
            className='form-control'
            name='username_search'
          ></Dropdown.Toggle>
          <Dropdown.Menu className='w-100'>
            {results.ids.map((userId) => (
              <DropdownElement
                key={`search_username_${userId}`}
                id={userId}
                usersInDb={db?.users}
              />
            ))}
            {results.hasNext && (
              <Dropdown.Item disabled key='search_has_more'>
                <div className='flex-grow-1 fst-italic text-center'>
                  <small>Search results are partial</small>
                </div>
              </Dropdown.Item>
            )}
            {results.hasSearched && results.ids.length === 0 && (
              <Dropdown.Item disabled key='search_no_results'>
                <div className='flex-grow-1 fst-italic text-center'>
                  <small>No users found</small>
                </div>
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserToDBModal;
