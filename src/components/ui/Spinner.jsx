export function Spinner({ className, ...props }) {
  return (
    <span className={`nobat-spinner ${className || ''}`} {...props}>
      <svg
        className="nobat-spinner__svg"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="nobat-spinner__circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
    </span>
  );
}

