import { Fragment, useEffect, useState } from 'react';

import Table from 'react-bootstrap/Table';
import { InlineIcon } from '@iconify/react';

import { useAutomaticGetFullDBQuery } from '/src/api/dbApiSlice';
import { AutoBlurButton, getColumnWidth, LoadingDiv } from '/src/utils';

import { Month } from './Month';

export const Months = ({ ...props }) => {
  const { data: fullDB, isLoading } = useAutomaticGetFullDBQuery();
  const months = fullDB?.months_list;

  const [showExplanation, setShowExaplanation] = useState(false);
  const onToggleExplain = () => setShowExaplanation((s) => !s);

  const [showMoreThanTwelve, setShowMoreThanTwelve] = useState(false);
  const onShowMoreThanTwelve = () => setShowMoreThanTwelve(true);

  const hasMoreThanTwelve = months?.length > 12;
  let monthsToShow = months ? [...months] : [];
  const hiddenMonths = hasMoreThanTwelve ? monthsToShow?.splice(12) : [];

  useEffect(() => {
    if (!isLoading && !months?.length) {
      setShowExaplanation(true);
    }
  }, [months, isLoading]);

  let displayYear = null;

  const generateMonthElement = (month) => {
    let show = false;
    const year = month.month.split('-')[1];
    if (year !== displayYear) {
      displayYear = year;
      show = true;
    }
    return (
      <Fragment key={`month_${month.month}`}>
        {show && (
          <tr>
            <td colSpan={5}>{year}</td>
          </tr>
        )}
        <Month month={month} />
      </Fragment>
    );
  };

  if (isLoading)
    return <LoadingDiv className="text-center w-100" maxWidth={100} />;
  else if (months?.length)
    return (
      <div>
        {
          <Table className="text-center">
            <thead>
              <tr>
                <th></th>
                <th>
                  <InlineIcon icon="octicon:calendar-16" />
                </th>
                <th>
                  <InlineIcon icon="octicon:package-dependencies-16" />
                </th>
                <th>
                  <InlineIcon icon="octicon:package-dependents-16" />
                </th>
                <th>
                  <InlineIcon icon="octicon:package-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {monthsToShow.map(generateMonthElement)}
              {hasMoreThanTwelve && (
                <>
                  {showMoreThanTwelve ? (
                    hiddenMonths.map(generateMonthElement)
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <AutoBlurButton
                          variant="link"
                          onClick={onShowMoreThanTwelve}
                        >
                          Show older months
                        </AutoBlurButton>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        }

        <div className="text-center">
          {showExplanation && (
            <div className="fst-italic">
              Months will appear here if they have at least one expenditure or
              an income registered.
            </div>
          )}
          <AutoBlurButton variant="link" onClick={onToggleExplain}>
            {showExplanation ? 'Hide explaination' : 'How do I add months?'}
          </AutoBlurButton>
        </div>
      </div>
    );
  else
    return (
      <div className="mx-auto" style={{ maxWidth: getColumnWidth() }}>
        No months with registered money or expenditures yet.
      </div>
    );
};
