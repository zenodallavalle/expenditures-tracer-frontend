import { alertsSelectors } from 'rdx/alerts';
import { useEffect, useRef } from 'react';
import { default as RBAlert } from 'react-bootstrap/Alert';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const Alert = ({ alert, ...props }) => {
  const timeoutRef = useRef();
  const dispatch = useDispatch();

  const onClose = () => dispatch({ type: 'alerts/dismissed', payload: alert });

  if (!timeoutRef.current && alert.timeout) {
    timeoutRef.current = setTimeout(onClose, alert.timeout);
  }

  useEffect(() => {
    if (alert.dismissed && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [alert, timeoutRef]);

  return (
    <RBAlert
      show={!alert.dismissed}
      onClose={onClose}
      variant={alert.variant}
      className='mb-1'
      dismissible
    >
      {alert.message}
    </RBAlert>
  );
};

const Alerts = (props) => {
  const alerts = useSelector(alertsSelectors.getAll());

  return alerts.length === 0
    ? null
    : alerts.map((alert) => <Alert key={`alert_${alert.id}`} alert={alert} />);
};

export default Alerts;
