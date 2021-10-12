import LoadingGif from 'media/img/loading256.gif';
const getPositionClassName = (position) => ` text-${position}`;

const LoadingImg = ({
  alt = 'loading',
  position = 'center',
  maxWidth = 150,
  style = {},
  className = '',
  ...props
}) => {
  return (
    <img
      src={LoadingGif}
      className={className + getPositionClassName(position)}
      style={{ maxWidth, ...style }}
      {...props}
      alt={alt}
    />
  );
};

export default LoadingImg;
