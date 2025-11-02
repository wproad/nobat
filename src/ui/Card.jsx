export function Card({ children, className, ...props }) {
  return (
    <div className={`nobat-card ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={`nobat-card__header ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className, ...props }) {
  return (
    <div className={`nobat-card__body ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

