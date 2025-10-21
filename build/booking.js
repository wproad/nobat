/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/frontend/booking/components/AppointmentTicket.jsx":
/*!***************************************************************!*\
  !*** ./src/frontend/booking/components/AppointmentTicket.jsx ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppointmentTicket: () => (/* binding */ AppointmentTicket)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const AppointmentTicket = ({
  appointmentData
}) => {
  if (!appointmentData) {
    return null;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "appointment-ticket",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "ticket-card",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "ticket-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "ticket-header-top"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "ticket-title",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("{name} Your appointment request was sent successfully", "appointment-booking").replace("{name}", appointmentData.client_name)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
            className: "ticket-subtitle",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Youll recieve confirmation SMS to phone number {phone}", "appointment-booking").replace("{phone}", appointmentData.client_phone)
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "ticket-body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "ticket-main-info",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "info-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
              className: "info-item",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                className: "info-label",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Date", "appointment-booking")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                className: "info-value",
                children: appointmentData.appointment_date_jalali
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
              className: "info-item",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                className: "info-label",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Time", "appointment-booking")
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
                className: "info-value",
                children: appointmentData.time_slot
              })]
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
          className: "ticket-footer",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "ticket-id-section",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
              className: "ticket-id-label",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Booking Reference", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
              className: "ticket-id-value",
              children: ["#", appointmentData.id || "TBD"]
            })]
          })
        })]
      })]
    })
  });
};


/***/ }),

/***/ "./src/frontend/booking/components/BookingForm.jsx":
/*!*********************************************************!*\
  !*** ./src/frontend/booking/components/BookingForm.jsx ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BookingForm: () => (/* binding */ BookingForm)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../hooks */ "./src/frontend/booking/hooks/index.js");
/* harmony import */ var _TimeSlotSelector__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TimeSlotSelector */ "./src/frontend/booking/components/TimeSlotSelector.jsx");
/* harmony import */ var _AppointmentTicket__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./AppointmentTicket */ "./src/frontend/booking/components/AppointmentTicket.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);







const BookingForm = () => {
  const {
    formData,
    loading,
    message,
    messageType,
    bookedAppointment,
    handleInputChange,
    submitBooking,
    clearMessage,
    getMinDate,
    isFormValid
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__.useBookingForm)();
  const {
    schedule,
    loading: loadingSchedule,
    error: scheduleError,
    refetch
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_2__.useAvailableSchedule)();
  const handleSlotSelection = selectionData => {
    if (selectionData) {
      handleInputChange("appointment_date", selectionData.date);
      handleInputChange("time_slot", selectionData.timeSlot);
    } else {
      handleInputChange("appointment_date", "");
      handleInputChange("time_slot", "");
    }
  };
  const handleSubmit = async e => {
    e.preventDefault();
    await submitBooking();
  };

  // If appointment is booked successfully, show only the ticket
  if (bookedAppointment) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "appointment-booking-form",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_AppointmentTicket__WEBPACK_IMPORTED_MODULE_4__.AppointmentTicket, {
        appointmentData: bookedAppointment
      })
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
    className: "appointment-booking-form",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardHeader, {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h3", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Book an Appointment", "appointment-booking")
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
        children: [message && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
          status: messageType,
          isDismissible: true,
          onRemove: clearMessage,
          children: message
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("form", {
          onSubmit: handleSubmit,
          className: "booking-form",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "form-row",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Your Name", "appointment-booking"),
              value: formData.client_name,
              onChange: value => handleInputChange("client_name", value),
              required: true,
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Enter your full name", "appointment-booking")
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "form-row",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Phone Number", "appointment-booking"),
              value: formData.client_phone,
              onChange: value => handleInputChange("client_phone", value),
              required: true,
              placeholder: "09xxxxxxxxx",
              type: "tel",
              name: "tel",
              id: "appointment-booking-phone",
              autoComplete: "tel",
              inputMode: "tel",
              autoCorrect: "off",
              autoCapitalize: "off"
            })
          }), loadingSchedule ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "loading-slots",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Loading schedule...", "appointment-booking")
            })]
          }) : scheduleError ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
              status: "error",
              isDismissible: false,
              children: scheduleError
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              className: "form-actions",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
                onClick: refetch,
                variant: "secondary",
                __next40pxDefaultSize: true,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Retry", "appointment-booking")
              })
            })]
          }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "form-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "date-selector-label",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Select a Date", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_TimeSlotSelector__WEBPACK_IMPORTED_MODULE_3__["default"], {
              schedule: schedule,
              onSlotSelect: handleSlotSelection
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "form-actions",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              type: "submit",
              variant: "primary",
              disabled: loading || loadingSchedule || !!scheduleError || !isFormValid,
              __next40pxDefaultSize: true,
              children: loading ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Spinner, {}), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Booking...", "appointment-booking")]
              }) : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Book Appointment", "appointment-booking")
            })
          })]
        })]
      })]
    })
  });
};


/***/ }),

/***/ "./src/frontend/booking/components/DayButton.jsx":
/*!*******************************************************!*\
  !*** ./src/frontend/booking/components/DayButton.jsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const DayButton = ({
  day,
  isSelected,
  isToday,
  onClick
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("button", {
    type: "button",
    className: `day-button ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`,
    onClick: () => onClick(day.date_jalali),
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "day-name",
      children: day?.weekday
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "day-number",
      children: day?.day_number
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
      className: "month-name",
      children: day?.month_name
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DayButton);

/***/ }),

/***/ "./src/frontend/booking/components/TimeSlotButton.jsx":
/*!************************************************************!*\
  !*** ./src/frontend/booking/components/TimeSlotButton.jsx ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

const TimeSlotButton = ({
  slot,
  isSelected,
  onClick
}) => {
  const {
    start,
    end,
    status
  } = slot;
  const isReserved = status === "reserved";
  const timeText = `${start} - ${end}`;
  if (isReserved) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
      className: "time-slot-button reserved",
      disabled: true,
      children: timeText
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
    type: "button",
    className: `time-slot-button ${status} ${isSelected ? "selected" : ""}`,
    onClick: () => onClick(slot),
    disabled: status === "unavailable",
    dir: "ltr",
    children: timeText
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TimeSlotButton);

/***/ }),

/***/ "./src/frontend/booking/components/TimeSlotSelector.jsx":
/*!**************************************************************!*\
  !*** ./src/frontend/booking/components/TimeSlotSelector.jsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _DayButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DayButton */ "./src/frontend/booking/components/DayButton.jsx");
/* harmony import */ var _TimeSlotButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./TimeSlotButton */ "./src/frontend/booking/components/TimeSlotButton.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const TimeSlotSelector = ({
  schedule,
  onSlotSelect
}) => {
  const [selectedDate, setSelectedDate] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selectedSlot, setSelectedSlot] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const handleDateClick = date => {
    setSelectedDate(date);
    // Clear selected slot when changing date
    setSelectedSlot(null);
  };
  const handleSlotClick = slot => {
    setSelectedSlot(slot);
  };

  // Notify parent component when slot selection changes
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedDate && selectedSlot) {
      onSlotSelect?.({
        date: selectedDate,
        timeSlot: `${selectedSlot.start}-${selectedSlot.end}`,
        slotData: selectedSlot
      });
    } else {
      onSlotSelect?.(null);
    }
  }, [selectedDate, selectedSlot]);

  // Return early if no schedule or no timeslots
  if (!schedule || !schedule.timeslots || schedule.timeslots.length === 0) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "no-slots",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("No available dates", "appointment-booking")
    });
  }

  // const isToday = (dateString) => {
  //   const today = new Date();
  //   const checkDate = new Date(dateString);
  //   return (
  //     today.getDate() === checkDate.getDate() &&
  //     today.getMonth() === checkDate.getMonth() &&
  //     today.getFullYear() === checkDate.getFullYear()
  //   );
  // };

  // Get the selected day's data
  const selectedDayData = selectedDate ? schedule.timeslots.find(day => day.date_jalali === selectedDate) : null;

  // Filter out slots marked as unavailable for the selected day
  const visibleSlots = selectedDayData ? (selectedDayData.slots || []).filter(slot => slot.status !== "unavailable") : [];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "appointment-selector",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "week-days-selector",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "week-days-grid",
        children: schedule.timeslots.map(dayData => {
          if (dayData.slots.length === 0) return;
          const isSelected = selectedDate === dayData.date_jalali;
          // const isTodayDate = isToday(dayData.date);

          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_DayButton__WEBPACK_IMPORTED_MODULE_2__["default"], {
            day: dayData,
            isSelected: isSelected,
            isToday: false,
            onClick: handleDateClick
          }, dayData.date_jalali);
        })
      })
    }), selectedDayData && visibleSlots.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "time-slots-container",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
        className: "date-selector-label",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Available Hours", "appointment-booking")
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "time-slots-grid",
        children: visibleSlots.map((slot, index) => {
          const isSlotSelected = selectedSlot && selectedSlot.start === slot.start && selectedSlot.end === slot.end;
          return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_TimeSlotButton__WEBPACK_IMPORTED_MODULE_3__["default"], {
            slot: slot,
            isSelected: isSlotSelected,
            onClick: handleSlotClick
          }, `${slot.start}-${slot.end}-${index}`);
        })
      })]
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TimeSlotSelector);

/***/ }),

/***/ "./src/frontend/booking/components/index.js":
/*!**************************************************!*\
  !*** ./src/frontend/booking/components/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BookingForm: () => (/* reexport safe */ _BookingForm__WEBPACK_IMPORTED_MODULE_0__.BookingForm)
/* harmony export */ });
/* harmony import */ var _BookingForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BookingForm */ "./src/frontend/booking/components/BookingForm.jsx");


/***/ }),

/***/ "./src/frontend/booking/frontend.scss":
/*!********************************************!*\
  !*** ./src/frontend/booking/frontend.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/frontend/booking/hooks/index.js":
/*!*********************************************!*\
  !*** ./src/frontend/booking/hooks/index.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAvailableSchedule: () => (/* reexport safe */ _useAvailableSchedule__WEBPACK_IMPORTED_MODULE_1__.useAvailableSchedule),
/* harmony export */   useBookingForm: () => (/* reexport safe */ _useBookingForm__WEBPACK_IMPORTED_MODULE_0__.useBookingForm)
/* harmony export */ });
/* harmony import */ var _useBookingForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useBookingForm */ "./src/frontend/booking/hooks/useBookingForm.js");
/* harmony import */ var _useAvailableSchedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useAvailableSchedule */ "./src/frontend/booking/hooks/useAvailableSchedule.js");



/***/ }),

/***/ "./src/frontend/booking/hooks/useAvailableSchedule.js":
/*!************************************************************!*\
  !*** ./src/frontend/booking/hooks/useAvailableSchedule.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAvailableSchedule: () => (/* binding */ useAvailableSchedule)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Custom hook for fetching and managing active schedule data
 * @returns {Object} - { schedule, loading, error, refetch }
 */
const useAvailableSchedule = scheduleId => {
  const [schedule, setSchedule] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const fetchActiveSchedule = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const path = scheduleId ? `/wp-json/appointment-booking/v1/schedule/${encodeURIComponent(scheduleId)}` : `/wp-json/appointment-booking/v1/schedule/available`;
      console.log("path", path);
      const response = await fetch(path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
          //   // Provided by wp_localize_script in admin enqueue
          //   ...(typeof window !== "undefined" &&
          //     window.location.pathname.includes("/wp-admin/") &&
          //     typeof wpApiSettings !== "undefined" && {
          //       "X-WP-Nonce": wpApiSettings.nonce,
          //     }),
        }
      });
      if (!response.ok) {
        // if (response.status === 404) {
        // throw new Error(
        //   "No active schedule found. Please contact the administrator."
        // );
        // setSchedule(null)
        // }
        // const errorData = await response.json().catch(() => ({}));
        // throw new Error(errorData.message || "Failed to fetch active schedule");
      }
      const data = await response.json();
      setSchedule(data);
    } catch (err) {
      console.error("Error fetching active schedule:", err);
      const errorMessage = err.message || "Failed to load schedule";
      setError(errorMessage);
      setSchedule(null);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchActiveSchedule();
  }, [fetchActiveSchedule]);
  return {
    schedule,
    loading,
    error,
    refetch: fetchActiveSchedule
  };
};

/***/ }),

/***/ "./src/frontend/booking/hooks/useBookingForm.js":
/*!******************************************************!*\
  !*** ./src/frontend/booking/hooks/useBookingForm.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useBookingForm: () => (/* binding */ useBookingForm)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Custom hook for managing booking form state and validation
 * @returns {Object} - Form state and handlers
 */
const useBookingForm = () => {
  const [formData, setFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({
    client_name: "",
    client_phone: "",
    appointment_date: "",
    time_slot: ""
  });
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [message, setMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [messageType, setMessageType] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)("success");
  const [bookedAppointment, setBookedAppointment] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const handleInputChange = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (bookedAppointment) {
      setBookedAppointment(null);
    }
  }, [bookedAppointment]);
  const validateForm = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    // Basic validation
    if (!formData.client_name || !formData.client_phone || !formData.appointment_date || !formData.time_slot) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return false;
    }

    // Phone number validation (Iranian format: 09xxxxxxxxx)
    // const phoneRegex = /^09\d{9}$/;
    // if (!phoneRegex.test(formData.client_phone.replace(/\s/g, ""))) {
    //   setMessage("Please enter a valid phone number");
    //   setMessageType("error");
    //   return false;
    // }

    return true;
  }, [formData]);
  const submitBooking = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    if (!validateForm()) {
      return false;
    }
    try {
      setLoading(true);
      const response = await fetch("/wp-json/appointment-booking/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }
      const data = await response.json();
      // console.log("API response data:", data);

      // Store the booked appointment data for the ticket
      const appointmentData = {
        ...formData,
        appointment_date_jalali: formData.appointment_date,
        // The form date is already in Jalali format
        id: data.id || Date.now()
      };
      // console.log("Setting booked appointment:", appointmentData);
      setBookedAppointment(appointmentData);

      // Reset form
      setFormData({
        client_name: "",
        client_phone: "",
        appointment_date: "",
        time_slot: ""
      });
      return true;
    } catch (err) {
      console.error("Booking error:", err);
      setMessage(err.message || "Failed to book appointment. Please try again.");
      setMessageType("error");
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);
  const clearMessage = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setMessage(null);
  }, []);
  const resetForm = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setFormData({
      client_name: "",
      client_phone: "",
      appointment_date: "",
      time_slot: ""
    });
    setBookedAppointment(null);
    setMessage(null);
  }, []);
  const getMinDate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  // Reactive form validation that updates when formData changes
  const isFormValid = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return !!(formData.client_name && formData.client_phone && formData.appointment_date && formData.time_slot);
  }, [formData.client_name, formData.client_phone, formData.appointment_date, formData.time_slot]);
  return {
    formData,
    loading,
    message,
    messageType,
    bookedAppointment,
    handleInputChange,
    submitBooking,
    clearMessage,
    resetForm,
    getMinDate,
    isFormValid
  };
};

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
/*!***************************************!*\
  !*** ./src/frontend/booking/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _frontend_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./frontend.scss */ "./src/frontend/booking/frontend.scss");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ "./src/frontend/booking/components/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default()(() => {
  console.log("BookingForm");
  const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createRoot)(document.getElementById("appointment-booking-form"));
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.BookingForm, {}));
});
})();

/******/ })()
;
//# sourceMappingURL=booking.js.map