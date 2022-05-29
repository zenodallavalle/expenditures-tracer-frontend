import { InlineIcon } from '@iconify/react';
import circle16 from '@iconify/icons-octicon/circle-16';
import checkCircle16 from '@iconify/icons-octicon/check-circle-16';

import AutoBlurTransparentButton from './AutoBlurTransparentButton';

const CheckButton = ({ id, checked, onChange = () => {}, ...props }) => {
  return (
    <AutoBlurTransparentButton onClick={onChange}>
      <InlineIcon icon={checked ? checkCircle16 : circle16} />
    </AutoBlurTransparentButton>
  );
};

export default CheckButton;
