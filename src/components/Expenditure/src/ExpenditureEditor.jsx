import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import {
  categoryApiSlice,
  useAutomaticGetCategoryQuery,
} from 'api/categoryApiSlice';
import {
  expenditureApiSlice,
  useEditExpenditureMutation,
  useGetExpenditureQuery,
} from 'api/expenditureApiSlice';
import {
  LoadingImg,
  dateToLocaleISOString,
  AutoBlurButton,
  LoadingDiv,
} from 'utils';

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
      return e.target.value === '' ? '' : toFloat(e.target.value);
    case 'category':
      return toPKRelated(e.target.value);
    case 'expected_expenditure':
      return toPKRelated(e.target.value);
    default:
      return e.target.value;
  }
};

const ExpectedExpenditureOption = ({ id, ...props }) => {
  const { data: expenditure } = useGetExpenditureQuery({ id });
  return (
    <option value={id}>
      {expenditure
        ? `${expenditure.value.toString()} €, ${expenditure.name}`
        : `[${id}] Loading expenditure's name and value.`}
    </option>
  );
};

const CategoryOptionsGroup = ({ id, ...props }) => {
  const { data: category } = useAutomaticGetCategoryQuery({ id });
  return (
    <optgroup
      label={category?.name || `[${id}] Loading category name and expenditures`}
    >
      {category?.expected_expenditures?.map((expId) => (
        <ExpectedExpenditureOption
          key={`expected_expenditure_${expId}`}
          id={expId}
        />
      ))}
    </optgroup>
  );
};

const CategoryOption = ({ id, ...props }) => {
  const { data: category } = useAutomaticGetCategoryQuery({ id });

  return (
    <option value={id}>
      {category?.name || `[${id}] Loading cateory name`}
    </option>
  );
};

export const ExpenditureEditor = ({
  id,
  show = false,
  onHide = () => {},
  clear = () => {},
  ...props
}) => {
  const dispatch = useDispatch();

  const { data: expenditure, isLoading: expenditureIsLoading } =
    useGetExpenditureQuery({ id });

  const { data: fullDB, isLoading: databaseIsLoading } =
    useAutomaticGetFullDBQuery({});

  const [patchExpenditure, { isLoading: newExpenditureIsLoading }] =
    useEditExpenditureMutation();

  const isLoading = databaseIsLoading || newExpenditureIsLoading;

  const categoriesIds = fullDB?.categories;

  const [instance, setInstance] = useState({ id });
  const [messages, setMessages] = useState({});

  const refName = useRef();
  const refValue = useRef();
  const refDate = useRef();
  const refCategory = useRef();
  const refExpected = useRef();

  const { data: expectedExpenditure, isFetching } = useGetExpenditureQuery(
    { id: instance.expected_expenditure },
    { skip: !instance.expected_expenditure }
  );

  useEffect(() => {
    if (
      !isFetching &&
      expectedExpenditure?.category &&
      instance.category !== expectedExpenditure.category
    ) {
      setInstance({ ...instance, category: expectedExpenditure.category });
    }
  }, [expectedExpenditure, isFetching, instance]);

  const onChange = (e) => {
    const updatedValue = getUpdatedValue(e);
    if (updatedValue !== undefined) {
      if (updatedValue !== expenditure?.[e.target.name]) {
        setInstance({
          ...instance,
          [e.target.name]: updatedValue,
        });
      } else {
        const updatedInstance = { ...instance };
        delete updatedInstance[e.target.name];
        setInstance(updatedInstance);
      }
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      switch (e.target.name) {
        case 'name':
          return refValue.current?.focus();
        case 'value':
          return refDate.current?.focus();
        case 'date':
          return refCategory.current?.focus();
        case 'category':
          return instance.is_expected ? refExpected.current?.focus() : onSave();
        case 'expected_expenditure':
          return onSave();
        default:
          return;
      }
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      switch (e.target.name) {
        case 'name':
          return refValue.current?.focus();
        case 'value':
          return refDate.current?.focus();
        case 'date':
          return refCategory.current?.focus();
        case 'category':
          return instance.is_expected
            ? refExpected.current?.focus()
            : refName.current?.focus();
        case 'expected_expenditure':
          return refName.current?.focus();
        default:
          return;
      }
    }
  };

  const onSave = async () => {
    setMessages({
      name:
        instance.name && !instance.name.trim()
          ? ['This field is required']
          : [],
    });
    const payload = { ...instance };
    if (instance.is_expected) {
      delete payload['expected_expenditure'];
    }

    if (!Object.keys(payload).length > 1)
      // not ok
      return;

    const response = await patchExpenditure(payload);

    if (response?.data?.id) {
      if (payload.value || payload.category || payload.expected_expenditure) {
        dispatch(
          categoryApiSlice.util.invalidateTags([
            { type: 'category', id: expenditure.category },
          ])
        );
      }

      if (
        (payload.value && expenditure.expected_expenditure) ||
        payload.expected_expenditure
      ) {
        dispatch(
          expenditureApiSlice.util.invalidateTags([
            { type: 'expenditure', id: expenditure.expected_expenditure },
          ])
        );
      }
      clear();
      onHide();
    }
  };

  const getTitle = () =>
    `Add new ${instance.is_expected ? 'expected' : 'actual'} expenditure`;

  useEffect(() => {
    if (show) {
      refName.current?.focus();
    }
  }, [show]);

  if (expenditureIsLoading) return <LoadingDiv />;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement='end'
      style={{ width: '100%', maxWidth: 500 }}
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{getTitle()}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div>
          <div className='d-flex align-items-baseline py-2'>
            <div className='pe-2'>Description</div>
            <div className='flex-grow-1'>
              <Form.Control
                name='name'
                value={instance.name || expenditure?.name}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refName}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages.name?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className='text-danger'
            >
              {m}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-2'>
            <div className='pe-2'>Value</div>
            <div className='flex-grow-1'>
              <Form.Control
                name='value'
                value={instance.value || expenditure?.value}
                placeholder='€'
                type='number'
                step={0.01}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refValue}
                disabled={isLoading}
              />
            </div>
          </div>
          {messages.value?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className='text-danger'
            >
              {m}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-2'>
            <div className='pe-2'>Date</div>
            <div className='flex-grow-1'>
              <Form.Control
                name='date'
                type='datetime-local'
                value={
                  instance.date
                    ? dateToLocaleISOString(new Date(instance.date))
                    : expenditure?.date
                    ? dateToLocaleISOString(new Date(expenditure.date))
                    : 'Loading'
                }
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refDate}
                disabled={isLoading}
                readOnly={!instance.date && !expenditure?.date}
              />
            </div>
          </div>
          {messages.date?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className='text-danger'
            >
              {m}
            </div>
          ))}

          <div className='d-flex align-items-baseline py-2'>
            <div className='pe-2'>Category</div>
            <div className='flex-grow-1'>
              <Form.Select
                name='category'
                value={instance.category || expenditure.category || 0}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refCategory}
                disabled={isLoading || instance.expected_expenditure}
              >
                <option key={'category_default_0'} value={0}>
                  -----
                </option>
                {categoriesIds?.map((catId) => (
                  <CategoryOption
                    key={`category_add_edit_modal_${catId}`}
                    id={catId}
                  />
                ))}
              </Form.Select>
            </div>
          </div>
          {messages.category?.map((m, idx) => (
            <div
              key={`msg_expenditure_name_val_${idx}`}
              className='text-danger'
            >
              {m}
            </div>
          ))}

          {!instance.is_expected && (
            <div>
              <div className='d-flex align-items-baseline py-2'>
                <div className='pe-2'>Expected expenditure</div>
                <div className='flex-grow-1'>
                  <Form.Select
                    name='expected_expenditure'
                    value={
                      instance.expected_expenditure ||
                      expenditure.expected_expenditure ||
                      0
                    }
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    ref={refExpected}
                    disabled={isLoading}
                  >
                    <option key={'expected_expenditure_default_0'} value={0}>
                      -----
                    </option>
                    {categoriesIds?.map((catId) => (
                      <CategoryOptionsGroup
                        key={`expected_expenditure_category_options_group_${catId}`}
                        id={catId}
                      />
                    ))}
                  </Form.Select>
                </div>
              </div>
              {messages.expected_expenditure?.map((m, idx) => (
                <div
                  key={`msg_expenditure_name_val_${idx}`}
                  className='text-danger'
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          <div className='ps-1 flex-grow-1 pt-4'>
            <AutoBlurButton
              variant='success'
              className='w-100'
              onClick={onSave}
              disabled={isLoading}
            >
              {isLoading ? <LoadingImg maxWidth={25} /> : 'Save'}
            </AutoBlurButton>
          </div>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};
