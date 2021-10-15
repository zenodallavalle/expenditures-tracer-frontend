import { useSelector } from 'react-redux';

import { LoadingDiv } from 'utils';
import { expendituresSelectors } from 'rdx/expenditures';

import Expenditure from './Expenditure';

const Expenditures = ({ categoryId, expected, ...props }) => {
  const isLoading = useSelector(expendituresSelectors.isLoading());
  const expendituresIds = useSelector(
    expendituresSelectors.getIdsByCategory(categoryId, expected)
  );

  if (expendituresIds.length === 0) {
    if (isLoading) {
      return <LoadingDiv className='text-center w-100 py-1' maxWidth={100} />;
    } else {
      return (
        <div className='text-center fst-italic py-1'>
          No expenditures registered so far
        </div>
      );
    }
  } else {
    return (
      <div>
        {isLoading && (
          <LoadingDiv className='text-center w-100 py-1' maxWidth={25} />
        )}
        {expendituresIds.map((id) => (
          <Expenditure key={`expenditure_${id}`} id={id} />
        ))}
      </div>
    );
  }
};

export default Expenditures;
