export function PanelBody({ children, title, className, ...props }) {
  return (
    <div className={`nobat-panel-body ${className || ''}`} {...props}>
      {title && <h3 className="nobat-panel-body__title">{title}</h3>}
      <div className="nobat-panel-body__content">
        {children}
      </div>
    </div>
  );
}

