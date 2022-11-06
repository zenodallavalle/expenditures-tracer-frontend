import { useState } from 'react';

import { useNewCashMutation } from 'api/cashApiSlice';
import { AutoBlurButton, parseFloat } from 'utils';
import { FormControl } from 'react-bootstrap';
import { useEffect } from 'react';

const emptyCash = { income: true, name: '', value: '' };

const AddIncome = ({ ...props }) => {
  const [isAdding, setIsAdding] = useState();
  const [instance, setInstance] = useState(emptyCash);
  const [
    addIncome,
    {
      isLoading: addIncomeIsLoading,
      isSuccess: addIncomeIsSuccess,
      error: addIncomeError,
    },
  ] = useNewCashMutation();

  const onChange = (e) => {
    setInstance((i) => ({ ...i, [e.target.name]: e.target.value }));
  };

  const onAdd = () => setIsAdding(true);

  const onCancel = () => setIsAdding() || setInstance(emptyCash);

  const onAdded = async () => {
    const payload = { ...instance, value: parseFloat(instance.value) };
    addIncome(payload);
  };

  useEffect(() => {
    if (addIncomeIsSuccess) {
      setIsAdding(false);
      setInstance(emptyCash);
    }
  }, [addIncomeIsSuccess]);

  return (
    <div>
      {isAdding ? (
        <div>
          <div className='d-flex align-items-baseline my-1'>
            <div className='me-2'>Name:</div>
            <FormControl
              value={instance.name}
              onChange={onChange}
              name='name'
              className='w-100'
              disabled={addIncomeIsLoading}
            />
          </div>
          {addIncomeError?.data?.name?.map((msg, idx) => (
            <div key={`add_income_name_error_${idx}`} className='text-danger'>
              {msg}
            </div>
          ))}

          <div className='d-flex align-items-baseline my-1'>
            <div className='me-2'>Value:</div>
            <FormControl
              value={instance.value}
              onChange={onChange}
              name='value'
              className='w-100'
              disabled={addIncomeIsLoading}
            />
          </div>
          {addIncomeError?.data?.value?.map((msg, idx) => (
            <div key={`add_income_name_error_${idx}`} className='text-danger'>
              {msg}
            </div>
          ))}

          <div className='d-flex'>
            <AutoBlurButton
              className='flex-grow-1 m-1'
              variant='danger'
              onClick={onCancel}
              disabled={addIncomeIsLoading}
            >
              Cancel
            </AutoBlurButton>
            <AutoBlurButton
              className='flex-grow-1 m-1'
              variant='success'
              onClick={onAdded}
              disabled={addIncomeIsLoading}
            >
              Save
            </AutoBlurButton>
          </div>
        </div>
      ) : (
        <AutoBlurButton variant='success' className='w-100' onClick={onAdd}>
          Register new income
        </AutoBlurButton>
      )}
    </div>
  );
};

export default AddIncome;
