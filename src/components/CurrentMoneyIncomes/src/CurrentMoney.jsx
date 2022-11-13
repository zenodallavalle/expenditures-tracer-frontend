import { useEffect, useRef, useState } from 'react';
import FormControl from 'react-bootstrap/FormControl';

import { useEditCashMutation, useGetCashQuery } from 'api/cashApiSlice';

import {
  formatDateTime,
  formatFloat,
  FunctionalitiesMenu,
  parseFloat,
} from 'utils';

import { CashLoading } from './CashLoading';

const CurrentMoney = ({ id, ...props }) => {
  const ref = useRef();
  const [isEditing, setIsEditing] = useState();
  const { data: currentMoney, isLoading } = useGetCashQuery({ id });
  const [editCash, { isLoading: editCashIsLoading, error: editCashError }] =
    useEditCashMutation();

  const onEdit = () => setIsEditing(true);

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    const patch = { id };
    if (parseFloat(ref.current.value) !== currentMoney.value) {
      patch.value = parseFloat(ref.current.value);
    }

    if (Object.keys(patch).length <= 1) return onSuccess() || setIsEditing();

    const response = await editCash(patch);
    if (response.data) {
      onSuccess();
      setIsEditing();
    }
  };

  useEffect(() => {
    if (isEditing) ref.current?.focus();
  }, [isEditing]);

  return (
    <div className='ms-2'>
      <div className='d-flex'>
        {isLoading ? (
          <CashLoading />
        ) : isEditing ? (
          <div className='flex-grow-1'>
            <FormControl
              ref={ref}
              name='value'
              defaultValue={currentMoney?.value || ''}
              disabled={editCashIsLoading}
            />
            {editCashError?.data?.value?.map((msg, idx) => (
              <div
                key={`edit_current_money_value_error_${idx}`}
                className='text-danger'
              >
                {msg}
              </div>
            ))}
          </div>
        ) : (
          <div className='flex-grow-1'>
            <div>{`${formatFloat(currentMoney?.value)} €`}</div>
            <div className='text-muted fst-italic'>
              {`@ ${formatDateTime(currentMoney?.date)}`}
            </div>
          </div>
        )}
        <FunctionalitiesMenu
          isExtended
          hideCollapser
          hideExpander
          clickable={!isLoading && !editCashIsLoading}
          onEdit={onEdit}
          onEdited={onEdited}
          isEditing={isEditing}
        />
      </div>
    </div>
  );
};

export default CurrentMoney;
