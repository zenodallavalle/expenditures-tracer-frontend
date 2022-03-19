import Button from 'react-bootstrap/Button';

const AutoBlurButton = ({ ...props }) => (
  <Button {...props} onFocus={(e) => setTimeout(() => e.target.blur(), 0)} />
);

export default AutoBlurButton;
