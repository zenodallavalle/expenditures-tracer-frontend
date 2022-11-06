import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAutomaticSearchUsersDebouncedQuery } from 'api/userApiSlice';

import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';

import { LoadingDiv } from 'utils';
import { changedUserSearchParams, selectUserSearchParams } from 'rdx/params';
import { useEditDBMutation, useGetLigthDBQuery } from 'api/dbApiSlice';

import { UserElement } from './UserElement';

export const AddUserToDBModal = ({ dbId, show, onHide, ...props }) => {
  const dispatch = useDispatch();

  const { data: db, isLoading: dbIsLoading } = useGetLigthDBQuery({ id: dbId });

  const [editDB, { isLoading: editDBIsLoading }] = useEditDBMutation();

  const {
    data: searchResults,
    isLoading,
    isUninitialized,
  } = useAutomaticSearchUsersDebouncedQuery();

  const [showDropdown, setShowDropdown] = useState(false);

  const { queryString } = useSelector(selectUserSearchParams);

  const onExcludeUser = (userId) => {
    editDB({
      id: dbId,
      users: db.users.filter((DBUserId) => DBUserId !== userId),
    });
  };

  const onAddUser = (userId) => {
    editDB({
      id: dbId,
      users: [...db.users, userId],
    });
  };

  const onChange = (e) => {
    dispatch(changedUserSearchParams({ queryString: e.target.value }));
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <span className='me-1'>Manage users related to database</span>
        <span className='fst-italic fw-bold'>
          {db?.name || `with id=${dbId}`}
        </span>
      </Modal.Header>
      <Modal.Body>
        <h5 className='small'>Edit users</h5>
        <ListGroup>
          {db?.users.map((userId) => (
            <UserElement
              key={`db_${dbId}_user_${userId}`}
              id={userId}
              onExclude={onExcludeUser}
            />
          ))}
        </ListGroup>
        <h5 className='small mt-4'>Select users to add to database</h5>

        <Dropdown
          className='m-1'
          onToggle={setShowDropdown}
          show={showDropdown}
          onSelect={onAddUser}
        >
          <Dropdown.Toggle
            as='input'
            type='search'
            placeholder='Type something to search'
            value={queryString || ''}
            onChange={onChange}
            className='form-control'
            name='username_search'
            disabled={dbIsLoading || editDBIsLoading}
          />
          {!isUninitialized && (
            <Dropdown.Menu className='w-100'>
              {isLoading ? (
                <Dropdown.Item disabled key='search_is_loading'>
                  <LoadingDiv />
                </Dropdown.Item>
              ) : !searchResults.length ? (
                <Dropdown.Item disabled key='search_no_results'>
                  <div className='flex-grow-1 fst-italic text-center'>
                    <small>No users found</small>
                  </div>
                </Dropdown.Item>
              ) : (
                searchResults.map((user) => {
                  const inDB = db?.users.includes(user.id);
                  return (
                    <Dropdown.Item
                      key={`search_users_${user.id}`}
                      disabled={dbIsLoading || editDBIsLoading || inDB}
                      eventKey={user.id}
                    >
                      <div className='d-flex'>
                        <div className='flex-grow-1'>
                          {user.username || `username with id=${user.id}`}
                        </div>
                        {inDB && (
                          <div className='text-nowrap fst-italic'>
                            <small>This user is alredy in DB</small>
                          </div>
                        )}
                      </div>
                    </Dropdown.Item>
                  );
                })
              )}
              {searchResults?.next && (
                <Dropdown.Item disabled key='search_has_more'>
                  <div className='flex-grow-1 fst-italic text-center'>
                    <small>Search results are partial</small>
                  </div>
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          )}
        </Dropdown>
      </Modal.Body>
    </Modal>
  );
};
