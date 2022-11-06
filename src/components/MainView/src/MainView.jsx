import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changedPanel, selectPanel } from 'rdx/params';

import { PanelUser } from 'components/User';
import { PanelProspect } from 'components/Prospect';
import { PanelExpenditures } from 'components/Expenditure';
import { PanelMonths } from 'components/Month';
import { Search } from 'components/Search';

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
      ].includes(panel)
    ) {
      dispatch(changedPanel('prospect'));
    }
  });

  switch (panel) {
    case 'user':
      return <PanelUser />;
    case 'months':
      return <PanelMonths />;
    case 'actual_expenditures':
      return <PanelExpenditures />;
    case 'expected_expenditures':
      return <PanelExpenditures expected />;
    case 'search':
      return <Search />;
    default:
      return <PanelProspect />;
  }
};
