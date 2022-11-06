import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { LoadingDiv } from 'utils';

import CurrentMoney from './CurrentMoney';
import EmptyCurrentMoney from './EmptyCurrentMoney';
import Incomes from './Incomes';

export const CurrentMoneyIncomesOffcanvas = ({ show, onHide, ...props }) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const currentMoneyId = fullDB?.actual_money;

  return (
    <Offcanvas show={show} onHide={onHide} placement='end'>
      <Offcanvas.Header closeButton>
        <h5>Current money and incomes</h5>
      </Offcanvas.Header>

      <div className='px-2'>
        <div className='mb-3'>
          {isLoading ? (
            <LoadingDiv />
          ) : (
            <div>
              <h5 className='text-center'>Current money</h5>
              {currentMoneyId ? (
                <CurrentMoney id={currentMoneyId} />
              ) : (
                <EmptyCurrentMoney />
              )}
            </div>
          )}
        </div>

        <Incomes />
      </div>
    </Offcanvas>
  );
};
