export function PanelRow({ children, className, ...props }) {
  return (
    <div className={`nobat-panel-row ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

