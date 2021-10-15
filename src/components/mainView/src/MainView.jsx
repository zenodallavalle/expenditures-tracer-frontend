import { useCallback, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import PanelUser from './PanelUser';
import PanelProspect from './PanelProspect';
import PanelExpenditures from './PanelExpenditures';
import PanelMonths from './PanelMonths';

const MainView = () => {
  const history = useHistory();
  const { panel } = useParams();

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
        history.push(
          history.location.pathname.replace(panel, 'prospect') +
            window.location.search
        );
      }
    },
    [history]
  );

  useEffect(() => {
    checkInvalidPanel(panel);
  }, [checkInvalidPanel, panel]);

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
