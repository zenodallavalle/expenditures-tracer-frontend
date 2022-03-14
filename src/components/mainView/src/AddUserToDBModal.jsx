import { userSelectors } from 'rdx/user';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import FormControl from 'react-bootstrap/FormControl';
import { InlineIcon } from '@iconify/react';
import xCircle16 from '@iconify/icons-octicon/x-circle-16';

import { useDispatch, useSelector } from 'react-redux';
import { usersSelectors } from 'rdx/users';
import { AutoBlurTransparentButton } from 'utils';
import { databaseApi } from 'api';
import { databaseSelectors } from 'rdx/database';

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

const AddUserToDBModal = ({ show, onHide, dbId, ...props }) => {
  const db = useSelector(userSelectors.getDBById(dbId));
  const dispatch = useDispatch();

  const onExclude = async (userId) => {
    const fullDB = await databaseApi.editDB({
      id: db.id,
      payload: {
        users: db.users.filter((id) => id !== userId),
      },
    });
    dispatch({ type: 'user/dbUpdated', payload: fullDB });
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
              onExclude={onExclude}
            />
          ))}
        </ListGroup>
        <h5 className='small mt-4'>Add users</h5>
        <FormControl />
      </Modal.Body>
    </Modal>
  );
};

export default AddUserToDBModal;
