import { alertsSelectors } from 'rdx/alerts';
import { useSelector } from 'react-redux';

import { Alert } from './Alert';

export const Alerts = ({ ...props }) => {
  const alerts = useSelector(alertsSelectors.getAll());

  return alerts.map((alert) => (
    <Alert key={`alert_${alert.id}`} alert={alert} />
  ));
};
