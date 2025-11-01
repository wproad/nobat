export function TextareaControl({
  label,
  value,
  onChange,
  placeholder,
  help,
  disabled,
  rows = 4,
  className,
  style,
  ...props
}) {
  return (
    <div className={`nobat-textarea-control ${className || ''}`}>
      {label && (
        <label className="nobat-textarea-control__label">
          {label}
        </label>
      )}
      <textarea
        className="nobat-textarea-control__textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        style={style}
        {...props}
      />
      {help && (
        <p className="nobat-textarea-control__help">
          {help}
        </p>
      )}
    </div>
  );
}

