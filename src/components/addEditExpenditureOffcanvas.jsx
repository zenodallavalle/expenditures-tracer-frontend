import React, { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import { expendituresSelectors } from 'rdx/expenditures';
import { databaseSelectors } from 'rdx/database';
import LoadingImg from './LoadingImg';
import { expenditureApi } from 'api';
import { useDispatch } from 'react-redux';

const toPKRelated = (v) => {
  const int = parseInt(v.trim());
  if (!isNaN(int)) {
    return int || null;
  }
  return undefined;
};

const toFloat = (v) => {
  const float = parseFloat(v.trim().replace(',', '.'));
  if (!isNaN(float)) {
    return float;
  }
  return undefined;
};

const getUpdatedValue = (e) => {
  switch (e.target.name) {
    case 'value':
      return toFloat(e.target.value);
    case 'category':
      return toPKRelated(e.target.value);
    case 'expected_expenditure':
      return toPKRelated(e.target.value);
    default:
      return e.target.value;
  }
};

const dateToLocaleISOString = (date = new Date()) => {
  const utcMilliseconds = date.getTime();
  const localMilliseconds =
    utcMilliseconds - date.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(localMilliseconds);
  return localDate.toISOString().slice(0, -8);
};

const AddEditExpenditureOffcanvas = ({
  show = false,
  onHide = () => {},
  clear = () => {},
  id,
  expected = false,
  ...props
}) => {
  const emptyExpenditure = {
    name: '',
    value: '',
    date: new Date(),
    category: null,
    expected_expenditure: null,
    is_expected: expected,
  };

  const dispatch = useDispatch();

  const expendituresLoading = useSelector(expendituresSelectors.isLoading());
  const databaseLoading = useSelector(databaseSelectors.isLoading());
  const isLoading = databaseLoading || expendituresLoading;

  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const categories = useSelector(databaseSelectors.getCategories());
  const expenditure = useSelector(expendituresSelectors.getById(id));
  const expectedExpenditures = useSelector(expendituresSelectors.getAll(true));
  const [instance, setInstance] = useState(id ? {} : emptyExpenditure);
  const [messages, setMessages] = useState({});
  useEffect(() => {
    if (id && expenditure) {
      setInstance({});
    }
  }, [id, expenditure]);

  const onChange = (e) => {
    const updatedValue = getUpdatedValue(e);
    if (updatedValue !== undefined) {
      if (id) {
        if (expenditure[e.target.name] !== updatedValue) {
          setInstance((i) => ({ ...i, [e.target.name]: updatedValue }));
        } else {
          const updatedInstance = { ...instance };
          delete updatedInstance[e.target.name];
          setInstance(updatedInstance);
        }
      } else {
        setInstance((instance) => ({
          ...instance,
          [e.target.name]: updatedValue,
        }));
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('instance', instance);
    if (id) {
      let isValid = true;
      const msgs = {};
      Object.entries(instance).forEach(([k, v]) => {
        if (!v) {
          if (['category', 'name', 'value'].includes(k)) {
            isValid = false;
            msgs[k] = ['This field is required'];
          }
        }
      });
      setMessages(msgs);
      if (isValid) {
        dispatch({ type: 'expenditures/isLoading' });
        try {
          const fullDB = await expenditureApi.editExpenditure({
            id,
            payload: instance,
          });
          dispatch({ type: 'database/dataUpdated', payload: fullDB });
          dispatch({ type: 'expenditures/dataUpdated', payload: fullDB });
          onHide();
          clear();
        } catch (e) {
          if (e.json.non_field_errors) {
            dispatch({
              type: 'alerts/added',
              payload: e.json.non_field_errors.join(', '),
            });
          } else {
            setMessages(e.json);
          }
          dispatch({ type: 'expenditures/loaded' });
        }
      }
    } else {
      setMessages({
        name:
          !instance.name || !instance.name.trim()
            ? ['This field is required']
            : [],
        value: !instance.value ? ['This field should be float'] : [],
        category: !instance.category ? ['This field is required'] : [],
      });
      if (!instance.name || !instance.value || !instance.category) {
        // not ok
      } else {
        const payload = {
          ...instance,
          db: workingDB.id,
        };
        if (instance.is_expected) {
          delete payload['expected_expenditure'];
        }
        dispatch({ type: 'expenditures/isLoading' });
        try {
          const fullDB = await expenditureApi.createExpenditure({
            payload,
          });
          dispatch({ type: 'database/dataUpdated', payload: fullDB });
          dispatch({ type: 'expenditures/dataUpdated', payload: fullDB });
          onHide();
          clear();
        } catch (e) {
          if (e.json.non_field_errors) {
            dispatch({
              type: 'alerts/added',
              payload: e.json.non_field_errors.join(', '),
            });
          } else {
            setMessages(e.json);
          }
          dispatch({ type: 'expenditures/loaded' });
        }
      }
    }
  };

  const getTitle = () => {
    if (!id) {
      if (instance.is_expected) {
        return 'Add new expected expenditure';
      } else {
        return 'Add new actual expenditure';
      }
    } else {
      if (expenditure.is_expected) {
        return 'Edit expected expenditure';
      } else {
        return 'Edit actual expenditure';
      }
    }
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement='end'>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{getTitle()}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <p>
                <label htmlFor='name'>Description</label>
                <input
                  type='text'
                  className='form-control'
                  name='name'
                  placeholder='Description'
                  value={
                    instance.name !== undefined
                      ? instance.name
                      : expenditure.name
                  }
                  onChange={onChange}
                />
                {messages.name?.map((m, idx) => (
                  <div
                    key={`msg_expenditure_name_val_${idx}`}
                    className='text-danger'
                  >
                    {m}
                  </div>
                ))}
              </p>
              <p>
                <label htmlFor='name'>Value</label>
                <input
                  type='number'
                  step={0.01}
                  className='form-control'
                  name='value'
                  placeholder='€'
                  value={
                    instance.value !== undefined
                      ? instance.value
                      : expenditure.value
                  }
                  onChange={onChange}
                />
                {messages.value?.map((m, idx) => (
                  <div
                    key={`msg_expenditure_value_val_${idx}`}
                    className='text-danger'
                  >
                    {m}
                  </div>
                ))}
              </p>
              {!id && (
                <p>
                  <Button
                    className='w-100'
                    onClick={() => {
                      setInstance((i) => ({
                        ...i,
                        is_expected: !i.is_expected,
                      }));
                    }}
                  >{`Switch to ${
                    instance.is_expected ? 'actual' : 'expected'
                  }`}</Button>
                </p>
              )}
              <p>
                <label htmlFor='name'>{'Date & Time'}</label>
                <input
                  type='datetime-local'
                  className='form-control'
                  name='date'
                  placeholder='Date & Time'
                  value={dateToLocaleISOString(
                    new Date(
                      instance.date !== undefined
                        ? instance.date
                        : expenditure.date
                    )
                  )}
                  onChange={onChange}
                />
                {messages.date?.map((m, idx) => (
                  <div
                    key={`msg_expenditure_date_val_${idx}`}
                    className='text-danger'
                  >
                    {m}
                  </div>
                ))}
              </p>
              <p>
                <label htmlFor='category'>
                  <span>Category</span>
                  {databaseLoading && (
                    <LoadingImg className='ms-2' maxWidth={30} />
                  )}
                </label>
                {databaseLoading ? (
                  <input
                    name='category'
                    className='form-control'
                    value={'Loading...'}
                    disabled
                  />
                ) : (
                  <select
                    name='category'
                    className='form-control'
                    onChange={onChange}
                    value={
                      (instance.category !== undefined
                        ? instance.category
                        : expenditure.category) || 0
                    }
                  >
                    <option key={'categorydefault0'} value={0}>
                      -----
                    </option>
                    {categories.map((c) => (
                      <option
                        key={`category_add_edit_modal_${c.id}`}
                        value={c.id}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
                {messages.category?.map((m, idx) => (
                  <div
                    key={`msg_expenditure_category_val_${idx}`}
                    className='text-danger'
                  >
                    {m}
                  </div>
                ))}
              </p>
              {(id ? !expenditure?.is_expected : !instance.is_expected) ? (
                <p>
                  <label htmlFor='expected_expenditure'>
                    <span>Expected expenditure</span>
                    {expendituresLoading && (
                      <LoadingImg className='ms-2' maxWidth={30} />
                    )}
                  </label>
                  {expendituresLoading ? (
                    <input
                      name='expected_expenditure'
                      className='form-control'
                      value={'Loading...'}
                      disabled
                    />
                  ) : (
                    <select
                      name='expected_expenditure'
                      className='form-control'
                      onChange={onChange}
                      value={
                        (instance.expected_expenditure !== undefined
                          ? instance.expected_expenditure
                          : expenditure.expected_expenditure) || 0
                      }
                    >
                      <option key={'expectedexpendituredefault0'} value={0}>
                        -----
                      </option>
                      {expectedExpenditures.map((e) => (
                        <option key={'expectedexpenditure' + e.id} value={e.id}>
                          {e.value.toString() + '€, ' + e.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {messages.expected_expenditure?.map((m, idx) => (
                    <div
                      key={`msg_expenditure_expected_expenditure_val_${idx}`}
                      className='text-danger'
                    >
                      {m}
                    </div>
                  ))}
                </p>
              ) : null}
            </div>
            <div className='text-center w-100'>
              <Button
                variant='primary'
                className='px-5'
                type='submit'
                disabled={isLoading}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default AddEditExpenditureOffcanvas;
