import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Modal from 'react-bootstrap/Modal';
import FormControl from 'react-bootstrap/FormControl';

import { expenditureApi } from 'api';
import { databaseSelectors } from 'rdx/database';
import { expendituresActions, expendituresSelectors } from 'rdx/expenditures';
import { userSelectors } from 'rdx/user';
import {
  AutoBlurButton,
  getDateFromMonthString,
  getLastDateForMonth,
  dateFormatI18n,
  LoadingDiv,
  CheckButton,
  dateToLocaleISOString,
  adaptDateForCurrentMonth,
} from 'utils';

const divideInCategoriesReducer = (acc, expenditure) => {
  if (acc[expenditure.category] === undefined) {
    acc[expenditure.category] = [expenditure.id];
  } else {
    acc[expenditure.category].push(expenditure.id);
  }
  return acc;
};

const CategoryListGroup = ({
  categoryId,
  expendituresIds,
  selected,
  setSelected,
  ...props
}) => {
  const category = useSelector(databaseSelectors.getCategoryById(categoryId));
  return (
    <div>
      <h5>{category?.name}</h5>
      {expendituresIds.length > 0 ? (
        <ListGroup>
          {expendituresIds.map((expenditureId) => (
            <ExpenditureListGroupItem
              key={`prev_month_exp_${expenditureId}`}
              expenditureId={expenditureId}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </ListGroup>
      ) : (
        <div>No registered expenditures</div>
      )}
    </div>
  );
};

const ExpenditureListGroupItem = ({
  expenditureId,
  selected,
  setSelected,
  ...props
}) => {
  const [expenditure, setExpenditure] = useState({});
  const loaded = useRef(false);

  const _expenditure = useSelector(
    expendituresSelectors.getById(expenditureId)
  );
  const workingMonth = useSelector(databaseSelectors.getWorkingMonth());

  useEffect(() => {
    if (!loaded.current && _expenditure) {
      setExpenditure({
        prevId: _expenditure.id,
        name: _expenditure.name,
        value: _expenditure.value,
        date: dateToLocaleISOString(
          adaptDateForCurrentMonth(new Date(_expenditure.date), workingMonth)
        ),
        is_expected: true,
        category: _expenditure.category,
        db: _expenditure.db,
      });
      loaded.current = true;
    }
  }, [expenditure, _expenditure, workingMonth]);

  const onChange = (fieldName) => (e) => {
    setExpenditure((s) => ({ ...s, [fieldName]: e.target.value }));
  };

  const checked = selected.map((exp) => exp.prevId).includes(expenditureId);

  const onToggleSelect = () => {
    if (checked) {
      setSelected((s) => s.filter((exp) => exp.prevId !== expenditureId));
    } else {
      setSelected((s) => [...s, { ...expenditure }]);
    }
  };

  return (
    <ListGroupItem>
      <div className='d-flex'>
        <CheckButton
          id={expenditureId}
          checked={checked}
          onChange={onToggleSelect}
        />
        <div className='w-100'>
          <div className='pb-1'>
            {checked ? (
              <FormControl
                value={expenditure?.name || ''}
                onChange={onChange('name')}
              />
            ) : (
              _expenditure?.name
            )}
          </div>
          <div className='pb-1'>
            {checked ? (
              <FormControl
                type='number'
                step={1}
                value={expenditure?.value || 0}
                onChange={onChange('value')}
              />
            ) : (
              _expenditure?.value
            )}
          </div>
          <div className='pb-1'>
            {checked ? (
              <FormControl
                type='datetime-local'
                step={1}
                value={expenditure?.date || dateToLocaleISOString(new Date())}
                onChange={onChange('date')}
              />
            ) : (
              _expenditure?.date
            )}
          </div>
        </div>
      </div>
    </ListGroupItem>
  );
};

const ExpenditureCopyModal = ({ show, setShow = () => {}, ...props }) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [loadedExpenditures, setLoadedExpenditures] = useState(false);
  const [previosMonthExpenditures, setPreviosMonthExpenditures] = useState({});

  const databaseIsLoading = useSelector(databaseSelectors.isLoading(false));
  const userIsLoading = useSelector(userSelectors.isLoading(true));
  const expenditureIsLoading = useSelector(
    expendituresSelectors.isLoading(false)
  );

  const isLoading = databaseIsLoading || userIsLoading || expenditureIsLoading;

  const previousMonth = useSelector(
    databaseSelectors.getLastMonthAvailable()
  )?.month;

  useEffect(() => {
    if (previousMonth && !loadedExpenditures && !isLoading) {
      const fetch = async () => {
        dispatch(expendituresActions.isLoading());
        const startDate = getDateFromMonthString(previousMonth);
        const endDate = getLastDateForMonth(startDate);
        const stringStartDate = dateFormatI18n(startDate, 'yyyy-mm-dd');
        const stringEndDate = dateFormatI18n(endDate, 'yyyy-mm-dd');
        const json = await expenditureApi.searchExpenditure({
          from: stringStartDate,
          to: stringEndDate,
          type: 'expected',
        });
        dispatch(expendituresActions.expendituresRetrieved(json.results));
        setPreviosMonthExpenditures(
          json.results.reduce(divideInCategoriesReducer, {})
        );
        setLoadedExpenditures(true);
      };
      fetch();
    }
  }, [previousMonth, loadedExpenditures, isLoading, dispatch]);

  const onHide = () => setShow(false);
  const onResetStatus = () => {
    setLoadedExpenditures(false);
    setPreviosMonthExpenditures({});
    setSelected([]);
  };

  const onCancel = () => {
    onResetStatus();
    onHide();
  };

  const onCopy = async () => {
    dispatch(expendituresActions.isLoading());
    const _selected = [...selected];
    const last = _selected.splice(-1)[0];
    if (_selected.length > 0) {
      Promise.all(
        _selected.map((exp) =>
          expenditureApi.createExpenditure({ payload: exp })
        )
      ).then(async () => {
        const fullDB = await expenditureApi.createExpenditure({
          payload: last,
        });
        dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
        dispatch({ type: 'database/dataUpdated', payload: fullDB });
        onHide();
      });
    } else {
      const fullDB = await expenditureApi.createExpenditure({ payload: last });
      dispatch({ type: 'expenditures/dataRetrieved', payload: fullDB });
      dispatch({ type: 'database/dataUpdated', payload: fullDB });
      onResetStatus();
      onHide();
    }
  };

  return (
    <div>
      <Modal size='lg' show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <h5 className='me-2'>
            Copy expected expenditures from previous month
          </h5>
        </Modal.Header>
        <Modal.Body>
          {isLoading || !loadedExpenditures ? (
            <LoadingDiv />
          ) : (
            <div>
              <h5 className='text-center'>{previousMonth}</h5>
              {previosMonthExpenditures ? (
                <div>
                  {Object.entries(previosMonthExpenditures).map(
                    ([categoryId, expendituresIds]) => (
                      <CategoryListGroup
                        key={`prev_month_expected_category_${categoryId}`}
                        categoryId={categoryId}
                        expendituresIds={expendituresIds}
                        selected={selected}
                        setSelected={setSelected}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className='text-center'>
                  No previous expenditures registered.
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className='d-flex justify-content-between w-100'>
            <div>
              <AutoBlurButton onClick={onCancel} variant='danger'>
                Cancel
              </AutoBlurButton>
            </div>
            <div>
              <AutoBlurButton disabled={!selected.length} onClick={onCopy}>
                Copy selected
              </AutoBlurButton>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExpenditureCopyModal;
