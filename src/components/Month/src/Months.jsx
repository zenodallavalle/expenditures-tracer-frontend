import { useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';
import { InlineIcon } from '@iconify/react';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import package16 from '@iconify/icons-octicon/package-16';
import packageDependencies16 from '@iconify/icons-octicon/package-dependencies-16';

import { useAutomaticGetFullDBQuery } from 'api/dbApiSlice';
import { AutoBlurButton, getColumnWidth, LoadingDiv } from 'utils';

import { Month } from './Month';

export const Months = ({ ...props }) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const months = fullDB?.months_list;

  const [showExplanation, setShowExaplanation] = useState(false);

  const onToggleExplain = () => setShowExaplanation((s) => !s);

  useEffect(() => {
    if (!isLoading && !months?.length) {
      setShowExaplanation(true);
    }
  }, [months, isLoading]);

  if (isLoading)
    return <LoadingDiv className='text-center w-100' maxWidth={100} />;
  else if (months?.length)
    return (
      <div>
        {
          <Table className='text-center'>
            <thead>
              <tr>
                <th></th>
                <th>
                  <InlineIcon icon={calendar16} />
                </th>
                <th>
                  <InlineIcon icon={packageDependencies16} />
                </th>
                <th>
                  <InlineIcon icon={package16} />
                </th>
              </tr>
            </thead>
            <tbody>
              {months.map((month) => (
                <Month month={month} key={`month_${month.month}`} />
              ))}
            </tbody>
          </Table>
        }

        <div className='text-center'>
          {showExplanation && (
            <div className='fst-italic'>
              Months will appear here if they have at least one expenditure or
              an income registered.
            </div>
          )}
          <AutoBlurButton variant='link' onClick={onToggleExplain}>
            {showExplanation ? 'Hide explaination' : 'How do I add months?'}
          </AutoBlurButton>
        </div>
      </div>
    );
  else
    return (
      <div className='mx-auto' style={{ maxWidth: getColumnWidth() }}>
        No months with registered money or expenditures yet.
      </div>
    );
};
