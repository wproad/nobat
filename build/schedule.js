/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/schedule/components/CreateSchedule.jsx":
/*!**********************************************************!*\
  !*** ./src/admin/schedule/components/CreateSchedule.jsx ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateSchedule: () => (/* binding */ CreateSchedule)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/constants */ "./src/lib/constants.js");
/* harmony import */ var _WeeklyHoursEditor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WeeklyHoursEditor */ "./src/admin/schedule/components/WeeklyHoursEditor.jsx");
/* harmony import */ var _JalaliDatePicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./JalaliDatePicker */ "./src/admin/schedule/components/JalaliDatePicker.jsx");
/* harmony import */ var _hooks_useSchedule__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../hooks/useSchedule */ "./src/hooks/useSchedule.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








function CreateSchedule() {
  const [name, setName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [isActive, setIsActive] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [startDay, setStartDay] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [endDay, setEndDay] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [meetingDuration, setMeetingDuration] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(30);
  const [selectedAdmin, setSelectedAdmin] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [weeklyHours, setWeeklyHours] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(_lib_constants__WEBPACK_IMPORTED_MODULE_3__.defaultWeeklyHours);
  const {
    adminUsers,
    notice,
    setNotice,
    saveSchedule
  } = (0,_hooks_useSchedule__WEBPACK_IMPORTED_MODULE_6__.useSchedule)();
  const buffer = 0;
  const handleSubmit = () => {
    const payload = {
      name,
      isActive,
      startDay,
      endDay,
      meetingDuration,
      buffer,
      selectedAdmin,
      weeklyHours
    };
    saveSchedule(payload).then(() => {
      // TODO: send success message as well
      // Redirect to all schedules page after successful creation
      window.location.href = "/wp-admin/admin.php?page=appointment-booking-all-schedules&message=1";
    }).catch(() => {
      // Error handling is already done in the saveSchedule function
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    style: {
      maxWidth: "800px"
    },
    children: [notice && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
      status: notice.status,
      isDismissible: true,
      onRemove: () => setNotice(null),
      children: notice.message
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Schedule Name", "appointment-booking"),
      value: name,
      onChange: setName,
      placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Enter a name for this schedule", "appointment-booking")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Is Active?", "appointment-booking"),
      checked: isActive,
      onChange: setIsActive
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_JalaliDatePicker__WEBPACK_IMPORTED_MODULE_5__.JalaliDatePickerInput, {
      id: "start-day",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Start Day", "appointment-booking"),
      value: startDay,
      onChange: setStartDay
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_JalaliDatePicker__WEBPACK_IMPORTED_MODULE_5__.JalaliDatePickerInput, {
      id: "end-day",
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("End Day", "appointment-booking"),
      value: endDay,
      onChange: setEndDay
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Meeting Duration (mins)", "appointment-booking"),
      type: "number",
      value: meetingDuration,
      onChange: val => setMeetingDuration(parseInt(val, 10))
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select Admin", "appointment-booking"),
      value: selectedAdmin,
      options: adminUsers,
      onChange: setSelectedAdmin
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_WeeklyHoursEditor__WEBPACK_IMPORTED_MODULE_4__.WeeklyHoursEditor, {
      weekdays: _lib_constants__WEBPACK_IMPORTED_MODULE_3__.weekdays,
      weeklyHours: weeklyHours,
      setWeeklyHours: setWeeklyHours
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
      isPrimary: true,
      onClick: handleSubmit,
      style: {
        marginTop: "20px"
      },
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Save Settings", "appointment-booking")
    })]
  });
}


/***/ }),

/***/ "./src/admin/schedule/components/JalaliDatePicker.jsx":
/*!************************************************************!*\
  !*** ./src/admin/schedule/components/JalaliDatePicker.jsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   JalaliDatePickerInput: () => (/* binding */ JalaliDatePickerInput)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


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
  const inputRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // Ensure the script is loaded and global object is available
    if (window.jalaliDatepicker && inputRef.current) {
      // Initialize the date input
      jalaliDatepicker.startWatch({
        minDate,
        autoReadOnlyInput,
        format,
        showCloseBtn,
        showTodayBtn,
        persianDigits
      });

      // Add native listener for the input
      const handleChange = e => {
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
  }, [minDate, autoReadOnlyInput, format, showCloseBtn, showTodayBtn, persianDigits, onChange]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "components-base-control",
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("label", {
      htmlFor: id,
      className: "components-base-control__label",
      children: label
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
      ref: inputRef,
      id: id,
      className: className,
      type: "text",
      "data-jdp": true,
      value: value,
      placeholder: placeholder,
      ...props
    })]
  });
}


/***/ }),

/***/ "./src/admin/schedule/components/WeeklyHoursEditor.jsx":
/*!*************************************************************!*\
  !*** ./src/admin/schedule/components/WeeklyHoursEditor.jsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WeeklyHoursEditor: () => (/* binding */ WeeklyHoursEditor)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _WorkingHoursForDay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WorkingHoursForDay */ "./src/admin/schedule/components/WorkingHoursForDay.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function WeeklyHoursEditor({
  weekdays,
  weeklyHours,
  setWeeklyHours
}) {
  const addWorkingHour = day => {
    setWeeklyHours(prev => ({
      ...prev,
      [day]: [...prev[day], "00:00-00:00"]
    }));
  };
  const removeWorkingHour = (day, index) => {
    setWeeklyHours(prev => {
      const newDay = [...prev[day]];
      newDay.splice(index, 1);
      return {
        ...prev,
        [day]: newDay
      };
    });
  };
  const updateWorkingHour = (day, index, value) => {
    setWeeklyHours(prev => {
      const newDay = [...prev[day]];
      newDay[index] = value;
      return {
        ...prev,
        [day]: newDay
      };
    });
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("h3", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Weekly Hours", "appointment-booking")
    }), weekdays.map(day => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_WorkingHoursForDay__WEBPACK_IMPORTED_MODULE_1__.WorkingHoursForDay, {
      day: day,
      hours: weeklyHours[day],
      onAdd: addWorkingHour,
      onRemove: removeWorkingHour,
      onUpdate: updateWorkingHour
    }, day))]
  });
}

/***/ }),

/***/ "./src/admin/schedule/components/WorkingHoursForDay.jsx":
/*!**************************************************************!*\
  !*** ./src/admin/schedule/components/WorkingHoursForDay.jsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WorkingHoursForDay: () => (/* binding */ WorkingHoursForDay)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function WorkingHoursForDay({
  day,
  hours,
  onAdd,
  onRemove,
  onUpdate
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelBody, {
    title: day.toUpperCase(),
    initialOpen: true,
    children: [hours.map((slot, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.PanelRow, {
      style: {
        display: "flex",
        gap: "10px",
        marginBottom: "5px"
      },
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
        value: slot,
        onChange: val => onUpdate(day, index, val),
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("e.g. 9:00-12:00", "appointment-booking")
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        isDestructive: true,
        onClick: () => onRemove(day, index),
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Remove", "appointment-booking")
      })]
    }, index)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      isPrimary: true,
      onClick: () => onAdd(day),
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Add Working Hour", "appointment-booking")
    })]
  });
}

/***/ }),

/***/ "./src/admin/schedule/components/index.js":
/*!************************************************!*\
  !*** ./src/admin/schedule/components/index.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateSchedule: () => (/* reexport safe */ _CreateSchedule__WEBPACK_IMPORTED_MODULE_0__.CreateSchedule),
/* harmony export */   JalaliDatePickerInput: () => (/* reexport safe */ _JalaliDatePicker__WEBPACK_IMPORTED_MODULE_1__.JalaliDatePickerInput)
/* harmony export */ });
/* harmony import */ var _CreateSchedule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreateSchedule */ "./src/admin/schedule/components/CreateSchedule.jsx");
/* harmony import */ var _JalaliDatePicker__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./JalaliDatePicker */ "./src/admin/schedule/components/JalaliDatePicker.jsx");



/***/ }),

/***/ "./src/admin/schedule/schedule.scss":
/*!******************************************!*\
  !*** ./src/admin/schedule/schedule.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/hooks/useSchedule.js":
/*!**********************************!*\
  !*** ./src/hooks/useSchedule.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSchedule: () => (/* binding */ useSchedule)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);



function useSchedule() {
  const [adminUsers, setAdminUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [notice, setNotice] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: "/wp/v2/users?roles=administrator"
    }).then(users => {
      setAdminUsers(users.map(u => ({
        label: u.name,
        value: u.id
      })));
    }).catch(() => setNotice({
      status: "error",
      message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Error fetching users.", "appointment-booking")
    }));
  }, []);
  const saveSchedule = payload => {
    return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_1___default()({
      path: "appointment-booking/v1/schedule",
      method: "POST",
      data: payload
    }).then(response => {
      // console.log("Schedule save response:", response);
      setNotice({
        status: "success",
        message: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Settings saved successfully!", "appointment-booking")
      });
      return response;
    }).catch(error => {
      console.error("Schedule save error:", error);
      let errorMessage = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Error saving settings.", "appointment-booking");
      if (error && error.message) {
        errorMessage = error.message;
      } else if (error && error.data && error.data.message) {
        errorMessage = error.data.message;
      }
      setNotice({
        status: "error",
        message: errorMessage
      });
      throw error;
    });
  };
  return {
    adminUsers,
    notice,
    setNotice,
    saveSchedule
  };
}

/***/ }),

/***/ "./src/lib/constants.js":
/*!******************************!*\
  !*** ./src/lib/constants.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultWeeklyHours: () => (/* binding */ defaultWeeklyHours),
/* harmony export */   weekdays: () => (/* binding */ weekdays)
/* harmony export */ });
const defaultWeeklyHours = {
  sat: ["9:00-14:00"],
  sun: ["9:00-14:00"],
  mon: ["9:00-14:00"],
  tue: ["9:00-14:00"],
  wed: ["9:00-14:00"],
  thu: ["9:00-12:00"],
  fri: []
};
const weekdays = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react/jsx-runtime":
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["ReactJSXRuntime"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./src/admin/schedule/index.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _schedule_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule.scss */ "./src/admin/schedule/schedule.scss");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ "./src/admin/schedule/components/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default()(() => {
  const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createRoot)(document.getElementById("appointment-booking-scheduling"));
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.CreateSchedule, {}));
});
})();

/******/ })()
;
//# sourceMappingURL=schedule.js.map