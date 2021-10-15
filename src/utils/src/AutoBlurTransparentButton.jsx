const AutoBlurTransparentButton = ({ className = '', ...props }) => {
  return (
    <button
      className={[className, 'btn btn-sm btn-action'].join(' ')}
      onFocus={(e) => setImmediate(() => e.target.blur())}
      {...props}
    />
  );
};

export default AutoBlurTransparentButton;
