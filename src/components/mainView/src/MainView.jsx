import { useSelector } from 'react-redux';

import { localInfoSelectors } from 'rdx/localInfo';

import { LoadingDiv } from 'utils';

import PanelUser from './PanelUser';
import PanelProspect from './PanelProspect';
import PanelExpenditures from './PanelExpenditures';
import PanelMonths from './PanelMonths';

const MainView = () => {
  const currentPanel = useSelector(localInfoSelectors.getCurrentPanel());
  switch (currentPanel) {
    case 'user':
      return <PanelUser />;
    case 'prospect':
      return <PanelProspect />;
    case 'months':
      return <PanelMonths />;
    case 'actual_expenditures':
      return <PanelExpenditures />;
    case 'expected_expenditures':
      return <PanelExpenditures />;
    default:
      return <LoadingDiv />;
  }
};

export default MainView;
