import { searchSelectors } from 'rdx/search';
import { useSelector } from 'react-redux';

import { Expenditure } from 'components/mainView';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

let columnWidth = parseInt(process.env.REACT_APP_COL_WIDTH);
if (isNaN(columnWidth)) {
  columnWidth = 500;
}

const SearchResults = ({ ...props }) => {
  const searchResults = useSelector(searchSelectors.getIds());
  if (searchResults === null) {
    return (
      <div className='text-center'>
        Type something in searchbar or edit advanced search filters to look for
        expenditures.
      </div>
    );
  } else if (searchResults.length === 0) {
    return <div className='text-center'>Nothing to show here.</div>;
  } else {
    return (
      <div>
        <Row>
          {searchResults.map((id) => (
            <Col key={`search_results_${id}`}>
              <Expenditure
                id={id}
                showType
                showCategory
                className='pb-1'
                style={{ maxWidth: columnWidth, minWidth: columnWidth * 0.7 }}
              />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
};

export default SearchResults;
