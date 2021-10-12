import { InlineIcon } from '@iconify/react';
import pencil16 from '@iconify/icons-octicon/pencil-16';
import check16 from '@iconify/icons-octicon/check-16';
import { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import FunctionalitiesMenu from './functionalitiesMenu';
import formatDate from './uniformDate';
import { useSelector, useDispatch } from 'react-redux';
import { databaseSelectors } from 'rdx/database';
import LoadingImg from './LoadingImg';
import { cashApi } from 'api';

const IncomeCell = ({ id, ...props }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const isLoading = useSelector(databaseSelectors.isLoading());
  const workingMonth = useSelector(databaseSelectors.getWorkingMonth());
  const income = useSelector(databaseSelectors.getIncomeById(id));
  const [instance, setInstance] = useState({});

  const onChange = (e) => {
    const floated = parseFloat(e.target.value);
    const val =
      e.target.name === 'value'
        ? isNaN(floated)
          ? floated
          : undefined
        : e.target.value;
    if (val !== undefined) {
      if (income[e.target.name] === val) {
        const i = { ...instance };
        delete i[e.target.name];
        setInstance(i);
      } else {
        setInstance((i) => ({ ...i, [e.target.name]: val }));
      }
    }
  };

  const onEditStarted = () => {
    setIsEditing(true);
  };
  const onEditEnded = async () => {
    if (Object.keys(instance).length > 0) {
      console.log(instance);
      dispatch({ type: 'database/isLoading' });
      try {
        const payload = { ...instance };
        const fullDB = await cashApi.editCash({ id, payload, workingMonth });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
      } catch (e) {
        dispatch({ type: 'database/loaded' });
      }
    }
    setIsEditing(false);
  };

  const onDelete = async () => {
    dispatch({ type: 'database/isLoading' });
    try {
      const fullDB = await cashApi.deleteCash({ id, workingMonth });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
    } catch (e) {
      dispatch({ type: 'database/loaded' });
    }
  };

  return (
    <li className='list-group-item'>
      <div className='clearfix'>
        <div className='float-right'>
          <FunctionalitiesMenu
            available={!isLoading}
            onEdit={onEditStarted}
            onEditFinished={onEditEnded}
            onDeleteConfirmed={onDelete}
            confirmDeleteTimeout={4000}
          />
        </div>
        <div>
          {isEditing ? (
            <input
              type='text'
              name='value'
              value={instance.value || income.value}
              onChange={onChange}
            />
          ) : (
            <span>{income.value}</span>
          )}
          <span>€</span>
          <span className='mx-2'></span>
          {isEditing ? (
            <input
              type='text'
              name='name'
              value={instance.name || income.name}
              onChange={onChange}
            />
          ) : (
            <span className='text-muted'>
              <em>{income.name}</em>
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

const emptyCash = { name: '', value: '' };

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
          </div>
        ) : (
          <Button
            variant='success'
            className='w-100 my-0 py-0'
            onClick={onAdd}
            disabled={isLoading}
          >
            Register new income
          </Button>
        )}
      </div>
    </div>
  );
};

const ActualMoneyOrIncomeOffcanvas = ({
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
  const [newActualMoney, setNewActualMoney] = useState(actualMoney.value);
  useEffect(() => {
    setNewActualMoney(actualMoney.value);
  }, [actualMoney.value]);

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
            <div className='list-group-item py-3 pr-3 pl-4'>
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
        {isLoading ? (
          <LoadingImg />
        ) : incomesIds.length === 0 ? (
          <p className='text-center'>
            <em>No incomes registered yet</em>
          </p>
        ) : (
          <ul className='list-group'>
            {incomesIds.map((id) => (
              <IncomeCell id={id} key={`income_${id}`} />
            ))}
          </ul>
        )}

        <AddIncomeCell />
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
export default ActualMoneyOrIncomeOffcanvas;
