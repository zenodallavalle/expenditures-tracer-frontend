import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import ListGroup from 'react-bootstrap/ListGroup';

import { databaseSelectors } from 'rdx/database';

import Month from './Month';

const Months = ({ ...props }) => {
  const months = useSelector(databaseSelectors.getMonths());
  const [showExplanation, setShowExaplanation] = useState(false);

  useEffect(() => {
    if (months.length === 0) {
      setShowExaplanation(true);
    }
  }, [months]);

  return (
    <div>
      {months.length > 0 && (
        <ListGroup variant='flush'>
          {months.map((month) => (
            <ListGroup.Item key={`month_${month.month}`}>
              <Month month={month} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <div className='text-center'>
        {showExplanation && (
          <div className='fst-italic'>
            Months will appear here if they have at least one expenditure or an
            income registered.
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
};

export default Months;
