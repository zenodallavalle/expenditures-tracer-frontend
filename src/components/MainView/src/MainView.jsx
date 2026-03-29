import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changedPanel, selectPanel } from '/src/rdx/params';

import { PanelUser } from '/src/components/User';
import { PanelProspect } from '/src/components/Prospect';
import { PanelExpenditures } from '/src/components/Expenditure';
import { Months } from '/src/components/Month';
import { SearchFilters, SearchResults } from '/src/components/Search';
import { PanelCharts } from '/src/components/Charts';

export const MainView = () => {
  const dispatch = useDispatch();
  const panel = useSelector(selectPanel);

  useEffect(() => {
    // check panel is always something valid
    if (
      !panel ||
      ![
        'user',
        'months',
        'actual_expenditures',
        'expected_expenditures',
        'prospect',
        'search',
        'charts',
      ].includes(panel)
    ) {
      dispatch(changedPanel('prospect'));
    }
  });

  switch (panel) {
    case 'user':
      return <PanelUser />;
    case 'months':
      return <Months />;
    case 'actual_expenditures':
      return <PanelExpenditures />;
    case 'expected_expenditures':
      return <PanelExpenditures expected />;
    case 'search':
      return (
        <>
          <SearchFilters />
          <SearchResults />
        </>
      );
    case 'charts':
      return <PanelCharts />;
    default:
      return <PanelProspect />;
  }
};
