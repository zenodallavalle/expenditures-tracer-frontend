import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import FormControl from 'react-bootstrap/FormControl';

import { cashApi } from 'api';
import { formatDate, FunctionalitiesMenu, LoadingImg } from 'utils';
import { databaseSelectors } from 'rdx/database';

const CurrentMoney = ({ ...props }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(databaseSelectors.isLoading());
  const currentMoney = useSelector(databaseSelectors.getActualMoney());
  const workingDB = useSelector(databaseSelectors.getWorkingDB());

  const [instance, setInstance] = useState(undefined);
  const [message, setMessage] = useState(undefined);

  const [isEditing, setIsEditing] = useState(false);

  const refValue = useRef();

  const floated = parseFloat(currentMoney?.value);
  const greaterThan1000 = !isNaN(floated) && floated >= 1000;
  const formattedValue = isNaN(floated)
    ? ''
    : floated.toFixed(greaterThan1000 ? 0 : 2);

  const onChange = (e) => {
    setInstance(
      currentMoney.value === e.target.value ? undefined : e.target.value
    );
  };

  const onEdit = () => {
    setIsEditing(true)
    setInstance(floated)
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdited();
    }
  };

  const validate = () => {
    let isValid = true;
    let message = undefined;
    if (instance && isNaN(parseFloat(instance))) {
      isValid = false;
      message = 'Invalid value, must be a decimal number.';
    }
    setMessage(message);
    return isValid;
  };

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    if (validate()) {
      if (instance) {
        dispatch({ type: 'database/isLoading' });
        try {
          const payload = {
            value: parseFloat(parseFloat(instance).toFixed(2)),
          };
          if (currentMoney.id) {
            const fullDB = await cashApi.editCash({
              id: currentMoney.id,
              payload,
            });
            dispatch({ type: 'database/dataUpdated', payload: fullDB });
          } else {
            const fullDB = await cashApi.createCash({
              payload: { ...payload, db: workingDB.id },
            });
            dispatch({ type: 'database/dataUpdated', payload: fullDB });
          }
          onSuccess();
          setIsEditing(false);
          setInstance(undefined);
        } catch (e) {
          dispatch({ type: 'database/loaded' });
          onFail();
          setIsEditing(false);
        }
      } else {
        onSuccess();
        setIsEditing(false);
      }
    }
    onFail();
  };

  useEffect(() => {
    if (isEditing) {
      refValue.current?.focus();
    }
  }, [isEditing]);

  

  return (
    <div>
      <h5 className='text-center'>Current money</h5>

      <div className='d-flex py-2 px-3'>
        <div className='flex-grow-1'>
          {isEditing ? (
            <div>
              <FormControl
                name='value'
                value={instance === undefined ? formattedValue : instance}
                onChange={onChange}
                onKeyDown={onKeyDown}
                ref={refValue}
                disabled={isLoading}
                type='number'
                step={0.01}
              />
              {message && <div className='text-danger'>{message}</div>}
            </div>
          ) : currentMoney.value ? (
            <div>
              <div>
                {formattedValue ? (
                  <span>{formattedValue}</span>
                ) : (
                  <LoadingImg maxWidth={25} />
                )}
                <span className='ms-1'>€</span>
              </div>

              <div className='text-muted fst-italic'>
                <span className='me-1'>@</span>
                {currentMoney?.date ? (
                  formatDate(currentMoney.date)
                ) : (
                  <LoadingImg maxWidth={25} />
                )}
              </div>
            </div>
          ) : (
            <div className='text-center'>Register current money now</div>
          )}
        </div>

        <FunctionalitiesMenu
          isExtended
          hideCollapser
          hideExpander
          clickable={!isLoading}
          isEditing={isEditing}
          onEdit={onEdit}
          onEdited={onEdited}
        />
      </div>
    </div>
  );
};

export default CurrentMoney;
