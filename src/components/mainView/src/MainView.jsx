import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PanelUser from './PanelUser';
import PanelProspect from './PanelProspect';
import PanelExpenditures from './PanelExpenditures';
import PanelMonths from './PanelMonths';
import Search from './Search';
import { getCurrentPanel } from 'utils';

const MainView = () => {
  const navigate = useNavigate();
  const panel = getCurrentPanel();

  const checkInvalidPanel = useCallback(
    (panel) => {
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
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('panel', 'prospect');
        navigate(`/?${urlSearchParams.toString()}`);
      }
    },
    [navigate]
  );

  useEffect(() => checkInvalidPanel(panel));

  switch (panel) {
    case 'user':
      return <PanelUser />;
    case 'months':
      return <PanelMonths />;
    case 'actual_expenditures':
      return <PanelExpenditures expected={false} />;
    case 'expected_expenditures':
      return <PanelExpenditures expected />;
    case 'search':
      return <Search />;
    default:
      return <PanelProspect />;
  }
};

export default MainView;
