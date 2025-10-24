import classNames from 'classnames';

export function Button({
  variant = 'secondary',
  isDestructive = false,
  isBusy = false,
  disabled = false,
  type = 'button',
  onClick,
  href,
  className,
  children,
  style,
  size,
  ...props
}) {
  const classes = classNames('nobat-button', className, {
    'nobat-button--primary': variant === 'primary',
    'nobat-button--secondary': variant === 'secondary',
    'nobat-button--tertiary': variant === 'tertiary',
    'nobat-button--link': variant === 'link',
    'nobat-button--destructive': isDestructive,
    'nobat-button--busy': isBusy,
    'nobat-button--compact': size === 'compact',
  });

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        style={style}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isBusy}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

