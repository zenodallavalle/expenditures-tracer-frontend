import { useSelector } from 'react-redux';

import { alertsSelectors } from '/src/rdx/alerts';

import { Alert } from './Alert';

export const Alerts = ({ ...props }) => {
  const alerts = useSelector(alertsSelectors.getAll());

  return alerts.map((alert) => (
    <Alert key={`alert_${alert.id}`} alert={alert} />
  ));
};
