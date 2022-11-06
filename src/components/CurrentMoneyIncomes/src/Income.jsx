import { useState } from 'react';

import {
  useDeleteCashMutation,
  useEditCashMutation,
  useGetCashQuery,
} from 'api/cashApiSlice';
import { FormControl } from 'react-bootstrap';

import { FunctionalitiesMenu, LoadingDiv, parseFloat } from 'utils';

const Income = ({ id, ...props }) => {
  const { data: income, isLoading } = useGetCashQuery({ id });

  const [isEditing, setIsEditing] = useState();

  const [patch, setPatch] = useState({ id });

  const onChange = (e) => {
    if (patch[e.target.name] !== e.target.value) {
      setPatch((i) => ({ ...i, [e.target.name]: e.target.value }));
    } else {
      setPatch((i) => {
        const update = { ...i };
        delete update[e.target.name];
        return update;
      });
    }
  };

  const [editCash, { isLoading: editCashIsLoading, error: editCashError }] =
    useEditCashMutation();

  const [deleteCash] = useDeleteCashMutation();

  const onEdit = () => {
    setIsEditing(true);
  };

  const onEdited = async (e, onSuccess = () => {}, onFail = () => {}) => {
    const payload = { ...patch };
    if (payload.value && parseFloat(payload.value) !== income.value) {
      payload.value = parseFloat(payload.value);
    } else {
      delete payload.value;
    }

    if (Object.keys(payload).length <= 1) return setIsEditing() || onSuccess();

    const response = await editCash(payload);
    if (response.data) {
      setIsEditing();
      onSuccess();
    }
  };

  const onDelete = async (e, onSuccess = () => {}, onFail = () => {}) => {
    await deleteCash(income);
    setIsEditing();
    onSuccess();
  };

  return (
    <div className='ps-2 my-1'>
      {isLoading ? (
        <LoadingDiv maxWidth={30} />
      ) : (
        <div className='d-flex align-items-center'>
          <div className='flex-grow-1'>
            {isEditing ? (
              <div className='d-flex align-items-baseline'>
                <div className='me-1'>Name</div>
                <FormControl
                  className='my-1'
                  name='name'
                  onChange={onChange}
                  value={patch.name !== undefined ? patch.name : income.name}
                  disabled={editCashIsLoading}
                />
                {editCashError?.name?.map((msg, idx) => (
                  <div
                    key={`income_edit_name_error_${idx}`}
                    className='text-danger'
                  >
                    {msg}
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-muted fst-italic'>{income?.name}</div>
            )}

            {isEditing ? (
              <div className='d-flex align-items-baseline'>
                <div className='me-1'>Value</div>
                <FormControl
                  className='my-1'
                  name='value'
                  onChange={onChange}
                  value={patch.value !== undefined ? patch.value : income.value}
                  disabled={editCashIsLoading}
                />
                {editCashError?.value?.map((msg, idx) => (
                  <div
                    key={`income_edit_value_error_${idx}`}
                    className='text-danger'
                  >
                    {msg}
                  </div>
                ))}
              </div>
            ) : (
              <div className=''>{`${parseFloat(income?.value)} €`}</div>
            )}
          </div>
          <FunctionalitiesMenu
            isEditing={isEditing}
            onEdit={onEdit}
            onEdited={onEdited}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};

export default Income;
