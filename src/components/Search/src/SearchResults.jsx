import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { useAutomaticSearchExpendituresDebouncedQuery } from 'api/expenditureApiSlice';
import { getColumnWidth, LoadingDiv } from 'utils';

import { Expenditure } from 'components/Expenditure';

export const SearchResults = ({ ...props }) => {
  const {
    data: searchResults,
    isFetching,
    isError,
    error,
    isUninitialized,
  } = useAutomaticSearchExpendituresDebouncedQuery();

  return (
    <div>
      {isFetching ? (
        <LoadingDiv divClassName='text-center' />
      ) : isUninitialized ? (
        <div className='text-center'>
          Type something in search bar or edit advanced search filters to look
          for expenditures.
        </div>
      ) : !searchResults.length ? (
        <div className='text-center fst-italic'>
          The search did not produce any result.
        </div>
      ) : isError ? (
        <div className='text-center'>
          <div>Error occurred, try again later.</div>
          <div>{JSON.stringify(error)}</div>
        </div>
      ) : (
        <Row>
          {searchResults.map((expenditure) => (
            <Col key={`search_result_${expenditure.id}`}>
              <Expenditure
                id={expenditure.id}
                expenditure={expenditure}
                showType
                showCategory
                className='pb-1 mx-auto'
                style={{
                  maxWidth: getColumnWidth(),
                  minWidth: getColumnWidth() * 0.7,
                }}
                editable
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};
