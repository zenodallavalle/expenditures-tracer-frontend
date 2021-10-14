import LoadingImg from './LoadingImg';

const genClassName = (divClassName) =>
  divClassName ? `text-center ${divClassName}` : 'text-center';

const LoadingDiv = ({
  divClassName = '',
  divStyle = {},
  divProps = {},
  ...props
}) => {
  return (
    <div className={genClassName(divClassName)} style={divStyle} {...divProps}>
      <LoadingImg {...props} />
    </div>
  );
};

export default LoadingDiv;
