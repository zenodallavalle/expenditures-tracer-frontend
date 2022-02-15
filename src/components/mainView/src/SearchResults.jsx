import { searchSelectors } from 'rdx/search';
import { useSelector } from 'react-redux';

import { Expenditure } from 'components/mainView';

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
        {searchResults.map((id) => (
          <Expenditure
            id={id}
            key={`search_results_${id}`}
            showType
            showCategory
            className='pb-1'
          />
        ))}
      </div>
    );
  }
};

export default SearchResults;
