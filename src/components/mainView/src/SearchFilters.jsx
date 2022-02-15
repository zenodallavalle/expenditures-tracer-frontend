import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Form from 'react-bootstrap/Form';
import { InlineIcon } from '@iconify/react';
import xCircle16 from '@iconify/icons-octicon/x-circle-16';

import { AutoBlurButton, AutoBlurTransparentButton } from 'utils';
import { expenditureApi } from 'api';
import { searchActions, searchSelectors } from 'rdx/search';
import { expendituresActions } from 'rdx/expenditures';

const extractValue = (e) => e.target.value;

const SearchFilters = ({ ...props }) => {
  const [show, setShow] = useState(false);
  const toggleShow = (e) => {
    if (show) {
      dispatch(searchActions.advancedParametersReset());
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const dispatch = useDispatch();
  const { queryString, from, to, lowerPrice, upperPrice, type } = useSelector(
    searchSelectors.getQueryParameters()
  );
  const onChange = (parameter) => (e) =>
    dispatch(searchActions.parametersChanged({ [parameter]: extractValue(e) }));

  const onReset = (parameter) => (e) =>
    dispatch(searchActions.parameterReset(parameter));

  const search = useCallback(
    async ({ ...params }) => {
      dispatch(expendituresActions.isLoading());
      dispatch(searchActions.isLoading());
      let parameters = 0;
      Object.entries(params).forEach(([k, v]) => {
        if (k === 'type') {
          if (v !== 'both') {
            parameters++;
          }
        } else if (k === 'queryString') {
          if (v && v.trim()) {
            parameters = parameters + v.trim().length;
          }
        } else {
          if (v && v.trim()) {
            parameters++;
          }
        }
      });
      if (parameters > 2) {
        try {
          const json = await expenditureApi.searchExpenditure(params);
          dispatch(expendituresActions.expendituresRetrieved(json.results));
          dispatch(searchActions.dataRetrieved(json.results));
        } catch (e) {
          console.error(e);
        }
      } else {
        dispatch(searchActions.dataErased());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    search({ queryString, from, to, lowerPrice, upperPrice, type });
  }, [search, queryString, from, to, lowerPrice, upperPrice, type]);

  return (
    <div>
      {show ? (
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
            <Form.Select value={type} onChange={onChange('type')}>
              <option value={'both'}>Actual and expected</option>
              <option value={'actual'}>Actual only</option>
              <option value={'expected'}>Expected only</option>
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
      ) : (
        <div className='text-center'>
          <AutoBlurButton variant='link' onClick={toggleShow}>
            Need advanced search tools?
          </AutoBlurButton>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
