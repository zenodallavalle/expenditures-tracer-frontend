import { useRef, useState } from 'react';

import FormControl from 'react-bootstrap/FormControl';
import { InlineIcon } from '@iconify/react';
import x16 from '@iconify/icons-octicon/x-16';
import check16 from '@iconify/icons-octicon/check-16';

import { useNewCashMutation } from 'api/cashApiSlice';
import {
  AutoBlurButton,
  AutoBlurTransparentButton,
  LoadingImg,
  parseFloat,
} from 'utils';

const EmptyCurrentMoney = ({ ...props }) => {
  const [isAdding, setIsAdding] = useState();
  const ref = useRef();
  const [
    addCurrentMoney,
    { isLoading: addCurrentMoneyIsLoading, error: addCurrentMoneyError },
  ] = useNewCashMutation();

  const onAdd = () => setIsAdding(true);

  const onAdded = async () => {
    const payload = { value: parseFloat(ref.current?.value), income: false };
    const response = await addCurrentMoney(payload);
    console.log(response);
    setIsAdding(false);
  };

  const onCancel = () => setIsAdding();

  return (
    <div className='ms-2'>
      {isAdding ? (
        <div className='d-flex'>
          <div className='flex-grow-1'>
            <FormControl
              ref={ref}
              disabled={addCurrentMoneyIsLoading}
              type='number'
              name='value'
              step={0.01}
            />
            {addCurrentMoneyError?.data?.value?.map((msg, idx) => (
              <div
                key={`add_current_money_value_error_${idx}`}
                className='text-danger'
              >
                {msg}
              </div>
            ))}
          </div>
          <div>
            <AutoBlurTransparentButton
              onClick={onCancel}
              disabled={addCurrentMoneyIsLoading}
            >
              <InlineIcon icon={x16} />
            </AutoBlurTransparentButton>
            <AutoBlurTransparentButton
              onClick={onAdded}
              disabled={addCurrentMoneyIsLoading}
            >
              {addCurrentMoneyIsLoading ? (
                <LoadingImg maxWidth={28} />
              ) : (
                <InlineIcon icon={check16} />
              )}
            </AutoBlurTransparentButton>
          </div>
        </div>
      ) : (
        <div className='text-center'>
          <div className='fst-italic'>
            Current money not registered for this month.
          </div>
          <AutoBlurButton variant='link' onClick={onAdd}>
            Register current money now!
          </AutoBlurButton>
        </div>
      )}
    </div>
  );
};

export default EmptyCurrentMoney;
