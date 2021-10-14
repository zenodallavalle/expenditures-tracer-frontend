import LoadingImg from './LoadingImg';

const getPositionClassName = (position) => `text-${position}`;

const genClassName = (position, divClassName) =>
  divClassName
    ? `${getPositionClassName(position)} ${divClassName}`
    : getPositionClassName(position);

const LoadingDiv = ({
  position = 'center',
  divClassName = '',
  divStyle = {},
  divProps = {},
  ...props
}) => {
  return (
    <div
      className={genClassName(position, divClassName)}
      style={divStyle}
      {...divProps}
    >
      <LoadingImg {...props} position={position} />
    </div>
  );
};

export default LoadingDiv;
