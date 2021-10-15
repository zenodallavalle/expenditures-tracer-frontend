import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import PanelUser from './PanelUser';
import PanelProspect from './PanelProspect';
import PanelExpenditures from './PanelExpenditures';
import PanelMonths from './PanelMonths';
import { getCurrentPanel } from 'utils';

const MainView = () => {
  const history = useHistory();
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
        ].includes(panel)
      ) {
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('panel', 'prospect');
        history.push(`/?${urlSearchParams.toString()}`);
      }
    },
    [history]
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
    default:
      return <PanelProspect />;
  }
};

export default MainView;
