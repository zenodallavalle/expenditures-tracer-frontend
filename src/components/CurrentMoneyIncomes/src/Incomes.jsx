import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { LoadingDiv } from 'utils';

import AddIncome from './AddIncome';
import Income from './Income';

const Incomes = ({ ...props }) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const incomes = fullDB?.incomes;
  return (
    <div>
      <h5 className='text-center'>Incomes</h5>
      {isLoading ? (
        <LoadingDiv />
      ) : (
        <div>
          {!incomes.length ? (
            <div className='fst-italic text-center'>
              No incomes registered yet.
            </div>
          ) : (
            <div className='mb-2'>
              {incomes.map((id) => (
                <Income id={id} key={`income_${id}`} />
              ))}
            </div>
          )}
          <AddIncome />
        </div>
      )}
    </div>
  );
};

export default Incomes;
