import { InlineIcon } from '@iconify/react';

import AutoBlurTransparentButton from './AutoBlurTransparentButton';

const CheckButton = ({ id, checked, onChange = () => {}, ...props }) => {
  return (
    <AutoBlurTransparentButton onClick={onChange}>
      <InlineIcon
        icon={checked ? 'octicon:check-circle-16' : 'octicon:circle-16'}
      />
    </AutoBlurTransparentButton>
  );
};

export default CheckButton;
