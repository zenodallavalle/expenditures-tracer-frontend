const AutoBlurTransparentButton = ({ className = '', ...props }) => {
  return (
    <button
      className={[className, 'btn btn-sm btn-action'].join(' ')}
      onFocus={(e) => setTimeout(() => e.target.blur(), 0)}
      {...props}
    />
  );
};

export default AutoBlurTransparentButton;
