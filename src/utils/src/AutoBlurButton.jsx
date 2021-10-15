import Button from 'react-bootstrap/Button';

const AutoBlurButton = ({ ...props }) => (
  <Button {...props} onFocus={(e) => setImmediate(() => e.target.blur())} />
);

export default AutoBlurButton;
