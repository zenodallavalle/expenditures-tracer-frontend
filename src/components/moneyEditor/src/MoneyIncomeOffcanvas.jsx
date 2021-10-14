import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import check16 from '@iconify/icons-octicon/check-16';

import { cashApi } from 'api';
import { formatDate, LoadingDiv } from 'utils';
import { databaseSelectors } from 'rdx/database';

import Income, { AddIncome } from './Income';

const MoneyIncomeOffcanvas = ({
  show = false,
  onHide = () => {},
  ...props
}) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(databaseSelectors.isLoading());
  const actualMoney = useSelector(databaseSelectors.getActualMoney());
  const incomesIds = useSelector(databaseSelectors.getIncomesIds());
  const prospect = useSelector(databaseSelectors.getProspect());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());
  const workingMonth = useSelector(databaseSelectors.getWorkingMonth());

  const [newActualMoney, setNewActualMoney] = useState(actualMoney?.value);

  useEffect(() => {
    if (actualMoney?.value) {
      setNewActualMoney(actualMoney.value);
    }
  }, [actualMoney]);

  const [isEditing, setIsEditing] = useState(false);

  const onChange = (e) => {
    const floated = e.target.value;
    if (!isNaN(floated)) {
      setNewActualMoney(floated);
    }
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onEdited = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      const payload = { value: newActualMoney };
      if (actualMoney.id) {
        const fullDB = await cashApi.editCash({
          id: actualMoney.id,
          payload,
          workingMonth,
        });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
      } else {
        const fullDB = await cashApi.createCash({
          payload: { ...payload, db: workingDB.id },
          workingMonth,
        });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
      }
    } catch (e) {
      dispatch({ type: 'database/loaded' });
    }
    setIsEditing(false);
  };

  return (
    <Offcanvas show={show} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Add/edit income/actual money</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className='mb-2'>
          <h5>Actual current money</h5>

          <div className='clearfix'>
            <div className='list-group-item py-3 pe-3 ps-4'>
              <div className='float-right'>
                <button
                  className='btn btn-sm btn-action p-1 pb-2'
                  onClick={isEditing ? onEdited : onEdit}
                  disabled={isLoading}
                >
                  <InlineIcon icon={isEditing ? check16 : pencil16} />
                </button>
              </div>
              {isEditing ? (
                <input
                  type='text'
                  name='value'
                  value={newActualMoney || actualMoney?.value}
                  onChange={onChange}
                />
              ) : (
                <span>{actualMoney?.value}</span>
              )}
              <span> €</span>
              <span className='text-muted'>
                <em>
                  {actualMoney
                    ? isEditing
                      ? ''
                      : ' at ' + formatDate(actualMoney?.date)
                    : ''}
                </em>
              </span>
            </div>
          </div>
        </div>
        <h5>
          <div className='clearfix'>
            <div className='float-right'>
              <div className='text-dark'>{`${prospect?.income} €`}</div>
            </div>
            <span>Incomes</span>
          </div>
        </h5>
        {isLoading && !incomesIds?.length ? (
          <LoadingDiv maxWidth={100} />
        ) : incomesIds?.length === 0 ? (
          <div className='fst-italic text-center mb-2'>
            No incomes registered yet
          </div>
        ) : (
          <ListGroup variant='flush'>
            {incomesIds?.map((id) => (
              <ListGroup.Item key={`income_${id}`}>
                <Income id={id} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <AddIncome />
        {isEditing && (
          <Button
            variant='primary'
            className='text-center w-100'
            onClick={() => {}}
          >
            Save and close
          </Button>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};
export default MoneyIncomeOffcanvas;
