import { useEffect, useRef } from "@wordpress/element";

function JalaliDatePickerInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  className = "components-base-control__input",
  minDate = "today",
  autoReadOnlyInput = true,
  format = "YYYY/MM/DD",
  showCloseBtn = true,
  showTodayBtn = true,
  persianDigits = false,
  ...props
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Ensure the script is loaded and global object is available
    if (window.jalaliDatepicker && inputRef.current) {
      // Initialize the date input
      jalaliDatepicker.startWatch({
        minDate,
        autoReadOnlyInput,
        format,
        showCloseBtn,
        showTodayBtn,
        persianDigits,
      });

      // Add native listener for the input
      const handleChange = (e) => {
        if (onChange) {
          onChange(e.target.value);
        }
      };

      const inputElement = inputRef.current;
      inputElement.addEventListener("change", handleChange);

      // Cleanup
      return () => {
        inputElement.removeEventListener("change", handleChange);
      };
    }
  }, [
    minDate,
    autoReadOnlyInput,
    format,
    showCloseBtn,
    showTodayBtn,
    persianDigits,
    onChange,
  ]);

  return (
    <div className="components-base-control">
      {label && (
        <label htmlFor={id} className="components-base-control__label">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        className={className}
        type="text"
        data-jdp
        value={value}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}

export { JalaliDatePickerInput };
