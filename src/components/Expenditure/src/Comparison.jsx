import { LoadingDiv } from 'utils';

import { useGetExpenditureQuery } from 'api/expenditureApiSlice';

const right = 'text-end';
const value = 'p-0';

const rightValue = [right, value].join(' ');

export const ComparisonExpenditure = ({ id }) => {
  const { data: expenditure, isLoading } = useGetExpenditureQuery({ id });
  if (isLoading) return <LoadingDiv />;
  return (
    <div>
      <span>{expenditure?.name}</span>
      <span className='me-1'>,</span>
      <span className='me-1 fw-bold'>{expenditure?.value}</span>
      <span className='fw-bold'>€</span>
    </div>
  );
};

export const ComparisonRow = ({ expectedId }) => {
  const { data: expected, isLoading } = useGetExpenditureQuery(
    { id: expectedId },
    { skip: !expectedId }
  );
  const actualIds = expected?.actual_expenditures;
  if (isLoading) return <LoadingDiv />;
  return (
    <tr>
      <td className={value}>
        <ComparisonExpenditure id={expectedId} />
      </td>
      <td />
      <td className={rightValue}>
        {actualIds.map((aId) => (
          <ComparisonExpenditure
            key={`expenditure_comparison_${aId}`}
            id={aId}
          />
        ))}
      </td>
    </tr>
  );
};
