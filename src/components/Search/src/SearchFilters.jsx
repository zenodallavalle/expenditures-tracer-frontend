import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Form from 'react-bootstrap/Form';
import { InlineIcon } from '@iconify/react';
import xCircle16 from '@iconify/icons-octicon/x-circle-16';

import { AutoBlurButton, AutoBlurTransparentButton } from 'utils';
import {
  changedSearchParams,
  initialSearchParams,
  resetSearchParamsButQueryString,
  selectSearchParams,
} from 'rdx/params';

const extractValue = (e) => {
  const {
    target: { name, value },
  } = e;

  switch (name) {
    case 'type':
      if (value === 'both') return undefined;
      else return value;
    default:
      return value;
  }
};

export const SearchFilters = ({ ...props }) => {
  const [show, setShow] = useState();

  const toggleShow = (e) => {
    if (show) {
      dispatch(resetSearchParamsButQueryString());
      setShow();
    } else {
      setShow(true);
    }
  };

  const dispatch = useDispatch();
  const {
    from = '',
    to = '',
    lowerPrice = '',
    upperPrice = '',
    type = 'both',
  } = useSelector(selectSearchParams);

  const onChange = (parameter) => (e) =>
    dispatch(changedSearchParams({ [parameter]: extractValue(e) }));

  const onReset = (parameter) => (e) =>
    dispatch(
      changedSearchParams({ [parameter]: initialSearchParams[parameter] })
    );

  return (
    <div>
      {!show ? (
        <div className='text-center'>
          <AutoBlurButton variant='link' onClick={toggleShow}>
            Need advanced search tools?
          </AutoBlurButton>
        </div>
      ) : (
        <div>
          <div className='fst-italic text-center small'>
            Use space " " to combine words with AND operator.
          </div>
          <div className='fst-italic text-center small mb-2'>
            Use comma "," to combine words with OR operator.
          </div>
          <div className='d-md-flex'>
            <div className='flex-grow-1 mb-2'>
              <div>From</div>
              <div className='d-flex text-center'>
                <Form.Control
                  name='from'
                  type='datetime-local'
                  value={from}
                  onChange={onChange('from')}
                  className='me-1'
                />
                <AutoBlurTransparentButton onClick={onReset('from')}>
                  <InlineIcon icon={xCircle16} />
                </AutoBlurTransparentButton>
              </div>
            </div>
            <div className='flex-grow-1 mb-2'>
              <div>To</div>
              <div className='d-flex text-center'>
                <Form.Control
                  name='to'
                  type='datetime-local'
                  value={to}
                  onChange={onChange('to')}
                  className='me-1'
                />
                <AutoBlurTransparentButton onClick={onReset('to')}>
                  <InlineIcon icon={xCircle16} />
                </AutoBlurTransparentButton>
              </div>
            </div>
          </div>
          <div className='d-md-flex'>
            <div className='flex-grow-1 mb-2'>
              <div>Lower price range</div>
              <div className='d-flex text-center'>
                <Form.Control
                  name='lowerPrice'
                  type='number'
                  step={0.01}
                  min={0}
                  value={lowerPrice}
                  onChange={onChange('lowerPrice')}
                  className='me-1'
                />
                <AutoBlurTransparentButton onClick={onReset('lowerPrice')}>
                  <InlineIcon icon={xCircle16} />
                </AutoBlurTransparentButton>
              </div>
            </div>
            <div className='flex-grow-1 mb-2'>
              <div>Upper price range</div>
              <div className='d-flex text-center'>
                <Form.Control
                  name='upperPrice'
                  type='number'
                  step={0.01}
                  min={0}
                  value={upperPrice}
                  onChange={onChange('upperPrice')}
                  className='me-1'
                />
                <AutoBlurTransparentButton onClick={onReset('upperPrice')}>
                  <InlineIcon icon={xCircle16} />
                </AutoBlurTransparentButton>
              </div>
            </div>
          </div>
          <div className='mb-2'>
            <div>Which kind of expenditures are you looking for?</div>
            <Form.Select name='type' value={type} onChange={onChange('type')}>
              <option value='both'>Actual and expected</option>
              <option value='actual'>Actual only</option>
              <option value='expected'>Expected only</option>
            </Form.Select>
          </div>
          <div className='mb-2 d-flex'>
            <div className='w-100'>
              <Form.Check
                disabled
                label='Search only in current month'
                type='radio'
                name='months'
                id={'radio-current-month'}
              />
            </div>
            <div className='w-100'>
              <Form.Check
                label='Search in all months'
                defaultChecked
                type='radio'
                name='months'
                id={'radio-all-months'}
              />
            </div>
          </div>
          <div className='mb-2 d-flex'>
            <div className='w-100'>
              <Form.Check
                defaultChecked
                label='Search in current database'
                type='radio'
                name='database'
                id={'radio-current-db'}
              />
            </div>
            <div className='w-100'>
              <Form.Check
                label='Search in all databases'
                type='radio'
                name='database'
                id={'radio-all-dbs'}
                disabled
              />
            </div>
          </div>

          <div className='text-center'>
            <AutoBlurButton onClick={toggleShow} variant='link'>
              Hide advanced search tools
            </AutoBlurButton>
          </div>
        </div>
      )}
    </div>
  );
};
