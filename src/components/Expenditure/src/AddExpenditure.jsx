import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import Form from 'react-bootstrap/Form';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { useAutomaticGetCategoryQuery } from 'api/categoryApiSlice';
import {
  useGetExpenditureQuery,
  useNewExpenditureMutation,
} from 'api/expenditureApiSlice';
import { selectPanel } from 'rdx/params';
import { LoadingImg, dateToLocaleISOString, AutoBlurButton } from 'utils';

const emptyExpenditure = {
  name: undefined,
  value: undefined,
  date: new Date(),
  category: null,
  expected_expenditure: null,
  is_expected: false,
};

const toPKRelated = (v) => {
  const int = parseInt(v.trim());
  if (isNaN(int)) {
    return undefined;
  }
  return int || null;
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
  const { data: category, isLoading } = useAutomaticGetCategoryQuery({ id });
  if (isLoading) return <optgroup label={`Category with id=${id}`}></optgroup>;
  if (!category.expected_expenditures.length) return null;
  else
    return (
      <optgroup
        label={
          category?.name || `[${id}] Loading category name and expenditures`
        }
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

export const AddExpenditure = ({
  show = false,
  onHide = () => {},
  passedExpenditureParams = {},
  ...props
}) => {
  const { data: fullDB, isLoading: databaseIsLoading } =
    useAutomaticGetFullDBQuery();

  const [newExpenditure, { isLoading: newExpenditureIsLoading }] =
    useNewExpenditureMutation();

  const isLoading = databaseIsLoading || newExpenditureIsLoading;

  const categoriesIds = fullDB?.categories;

  const [instance, setInstance] = useState({
    ...emptyExpenditure,
    ...passedExpenditureParams,
  });
  const [messages, setMessages] = useState({});

  const refName = useRef();
  const refValue = useRef();
  const refDate = useRef();
  const refCategory = useRef();
  const refExpected = useRef();

  let { data: expectedExpenditure, isFetching } = useGetExpenditureQuery(
    { id: instance.expected_expenditure },
    { skip: !instance.expected_expenditure }
  );
  if (!instance.expected_expenditure) {
    expectedExpenditure = null;
  }

  const panel = useSelector(selectPanel);

  useEffect(() => {
    setInstance((i) => ({
      ...i,
      is_expected: panel === 'expected_expenditures',
    }));
  }, [panel]);

  useEffect(() => {
    if (!isFetching) {
      const instancePatch = {};
      if (
        expectedExpenditure?.category &&
        instance.category !== expectedExpenditure?.category
      ) {
        instancePatch.category =
          expectedExpenditure.category || instance.category;
      }

      if (instance.name === undefined && expectedExpenditure?.name) {
        instancePatch.name = expectedExpenditure.name;
      }

      if (instance.value === undefined && expectedExpenditure?.value) {
        instancePatch.value = expectedExpenditure.value;
      }

      if (Object.keys(instancePatch).length > 0) {
        setInstance({ ...instance, ...instancePatch });
      }
    }
  }, [expectedExpenditure, isFetching, instance]);

  const onChange = (e) => {
    const updatedValue = getUpdatedValue(e);
    if (updatedValue !== undefined) {
      setInstance((instance) => ({
        ...instance,
        [e.target.name]: updatedValue,
      }));
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
        !instance.name || !instance.name.trim()
          ? ['This field is required']
          : [],
      value: !instance.value ? ['This field should be float'] : [],
      category: !instance.category ? ['This field is required'] : [],
    });
    if (!instance.name || !instance.value || !instance.category)
      // not ok
      return;

    const payload = { ...instance };
    if (instance.is_expected) {
      delete payload['expected_expenditure'];
    }

    const response = await newExpenditure(payload);

    if (response?.data?.id) {
      // Remember to call onHide before clear
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

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement='end'
      style={{ width: '100%', maxWidth: 500 }}
      {...props}
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
                value={instance.name || ''}
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
                value={instance.value || ''}
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

          <div className='py-2'>
            <AutoBlurButton
              className='w-100'
              onClick={() => {
                setInstance((i) => ({
                  ...i,
                  is_expected: !i.is_expected,
                }));
              }}
            >{`Switch to ${
              instance.is_expected ? 'actual' : 'expected'
            }`}</AutoBlurButton>
          </div>

          <div className='d-flex align-items-baseline py-2'>
            <div className='pe-2'>Date</div>
            <div className='flex-grow-1'>
              <Form.Control
                name='date'
                type='datetime-local'
                value={dateToLocaleISOString(instance.date)}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refDate}
                disabled={isLoading}
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
                value={instance.category || 0}
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
                    value={instance.expected_expenditure || 0}
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
