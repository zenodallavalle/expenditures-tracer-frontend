import SearchFilters from './SearchFilters';
import SearchResults from './SearchResults';

const Search = ({ ...props }) => {
  return (
    <div>
      <SearchFilters />
      <SearchResults />
    </div>
  );
};

export default Search;
