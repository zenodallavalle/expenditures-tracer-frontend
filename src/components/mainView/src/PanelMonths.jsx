import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Table from 'react-bootstrap/Table';
import { InlineIcon } from '@iconify/react';
import calendar16 from '@iconify/icons-octicon/calendar-16';
import package16 from '@iconify/icons-octicon/package-16';
import packageDependencies16 from '@iconify/icons-octicon/package-dependencies-16';

import { LoadingDiv } from 'utils';
import { databaseSelectors } from 'rdx/database';

import Month from './Month';

let columnWidth = parseInt(process.env.REACT_APP_COL_WIDTH);
if (isNaN(columnWidth)) {
  columnWidth = 500;
}

const Months = ({ ...props }) => {
  const months = useSelector(databaseSelectors.getMonths());
  const isLoading = useSelector(databaseSelectors.isLoading());
  const [showExplanation, setShowExaplanation] = useState(false);

  useEffect(() => {
    if (!isLoading && !months?.length) {
      setShowExaplanation(true);
    }
  }, [months, isLoading]);

  if (!months?.length) {
    if (isLoading) {
      return <LoadingDiv className='text-center w-100' maxWidth={100} />;
    } else {
      return (
        <div className='mx-auto' style={{ maxWidth: columnWidth }}>
          No monhts with registered money or expenditures yet.
        </div>
      );
    }
  } else {
    return (
      <div className='mx-auto' style={{ maxWidth: columnWidth }}>
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
          <a
            href='#help'
            onClick={(e) => {
              e.preventDefault();
              setShowExaplanation((s) => !s);
            }}
          >
            {showExplanation ? 'Hide explaination' : 'How do I add months?'}
          </a>
        </div>
      </div>
    );
  }
};

export default Months;
