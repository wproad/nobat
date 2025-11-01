import classNames from 'classnames';

export function Notice({
  status = 'info',
  children,
  isDismissible = false,
  onRemove,
  className,
  ...props
}) {
  const classes = classNames('nobat-notice', className, {
    'nobat-notice--success': status === 'success',
    'nobat-notice--error': status === 'error',
    'nobat-notice--warning': status === 'warning',
    'nobat-notice--info': status === 'info',
    'nobat-notice--dismissible': isDismissible,
  });

  return (
    <div className={classes} {...props}>
      <div className="nobat-notice__content">
        {children}
      </div>
      {isDismissible && onRemove && (
        <button
          className="nobat-notice__dismiss"
          onClick={onRemove}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  );
}

