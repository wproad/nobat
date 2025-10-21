/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/cal/cal.scss":
/*!********************************!*\
  !*** ./src/admin/cal/cal.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/admin/cal/components/AppointmentDetailModal.jsx":
/*!*************************************************************!*\
  !*** ./src/admin/cal/components/AppointmentDetailModal.jsx ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppointmentDetailModal: () => (/* binding */ AppointmentDetailModal)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/appointmentUtils */ "./src/lib/appointmentUtils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const AppointmentDetailModal = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [showDeleteModal, setShowDeleteModal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  if (!appointment) return null;
  const handleWhatsAppClick = () => {
    const message = (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.getDefaultWhatsAppMessage)(appointment);
    const whatsappLink = (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.generateWhatsAppLink)(appointment.client_phone, message);
    window.open(whatsappLink, "_blank");
  };
  const handleStatusUpdate = async newStatus => {
    const success = await onStatusUpdate(appointment.id, newStatus);
    if (success) {
      setIsEditing(false);
    }
  };
  const handleDelete = async () => {
    const success = await onDelete(appointment.id);
    if (success) {
      setShowDeleteModal(false);
      onClose();
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Appointment Details", "appointment-booking"),
      isOpen: isOpen,
      onRequestClose: onClose,
      className: "appointment-detail-modal",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "appointment-detail-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "appointment-info",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "info-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Client Name:", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              children: appointment.client_name
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "info-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Phone:", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              children: appointment.client_phone
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "info-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Date:", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              children: (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.formatDate)(appointment.appointment_date)
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "info-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Time Slot:", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              className: "time-slot",
              children: appointment.time_slot
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
            className: "info-row",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("strong", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Status:", "appointment-booking")
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
              className: "status-badge",
              style: {
                backgroundColor: (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.getStatusColor)(appointment.status)
              },
              children: (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.getStatusLabel)(appointment.status)
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "appointment-actions",
          style: {
            display: "flex",
            gap: 8,
            marginTop: 16,
            justifyContent: "flex-end"
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: () => setIsEditing(true),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Edit Status", "appointment-booking")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: handleWhatsAppClick,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Open in WhatsApp", "appointment-booking")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "link",
            isDestructive: true,
            onClick: () => setShowDeleteModal(true),
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Delete", "appointment-booking")
          })]
        })]
      })
    }), isEditing && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Edit Appointment Status", "appointment-booking"),
      onRequestClose: () => setIsEditing(false),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "appointment-edit-form",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Client Name", "appointment-booking"),
          value: appointment.client_name,
          disabled: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Phone", "appointment-booking"),
          value: appointment.client_phone,
          disabled: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Date", "appointment-booking"),
          value: (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.formatDate)(appointment.appointment_date),
          disabled: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Time Slot", "appointment-booking"),
          value: appointment.time_slot,
          disabled: true
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Status", "appointment-booking"),
          value: appointment.status,
          options: _lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.statusOptions,
          onChange: handleStatusUpdate
        })]
      })
    }), showDeleteModal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Delete Appointment", "appointment-booking"),
      onRequestClose: () => setShowDeleteModal(false),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Are you sure you want to delete this appointment? This action cannot be undone.", "appointment-booking")
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "modal-actions",
        style: {
          display: "flex",
          gap: 8,
          marginTop: 16,
          justifyContent: "flex-end"
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "secondary",
          onClick: () => setShowDeleteModal(false),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Cancel", "appointment-booking")
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          variant: "primary",
          isDestructive: true,
          onClick: handleDelete,
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Delete", "appointment-booking")
        })]
      })]
    })]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/AppointmentSlot.jsx":
/*!******************************************************!*\
  !*** ./src/admin/cal/components/AppointmentSlot.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppointmentSlot: () => (/* binding */ AppointmentSlot)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _AppointmentDetailModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./AppointmentDetailModal */ "./src/admin/cal/components/AppointmentDetailModal.jsx");
/* harmony import */ var _lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../lib/appointmentUtils */ "./src/lib/appointmentUtils.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const AppointmentSlot = ({
  appointment,
  onStatusUpdate,
  onDelete
}) => {
  const [showDetailModal, setShowDetailModal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const handleTimeBlockClick = () => {
    setShowDetailModal(true);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "time-block clickable",
      style: {
        backgroundColor: (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.getStatusColor)(appointment.status),
        borderLeftColor: (0,_lib_appointmentUtils__WEBPACK_IMPORTED_MODULE_3__.getStatusBorderColor)(appointment.status),
        cursor: "pointer"
      },
      onClick: handleTimeBlockClick,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "time-block-content",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "client-name",
          children: appointment.client_name
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "client-phone",
          children: appointment.client_phone
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_AppointmentDetailModal__WEBPACK_IMPORTED_MODULE_2__.AppointmentDetailModal, {
      appointment: appointment,
      isOpen: showDetailModal,
      onClose: () => setShowDetailModal(false),
      onStatusUpdate: onStatusUpdate,
      onDelete: onDelete
    })]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/CalendarError.jsx":
/*!****************************************************!*\
  !*** ./src/admin/cal/components/CalendarError.jsx ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CalendarError)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

function CalendarError({
  children
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
    className: "calendar-error",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      children: children
    })
  });
}

/***/ }),

/***/ "./src/admin/cal/components/CalendarGrid.jsx":
/*!***************************************************!*\
  !*** ./src/admin/cal/components/CalendarGrid.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarGrid: () => (/* binding */ CalendarGrid)
/* harmony export */ });
/* harmony import */ var _TimeColumn__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TimeColumn */ "./src/admin/cal/components/TimeColumn.jsx");
/* harmony import */ var _DayColumn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DayColumn */ "./src/admin/cal/components/DayColumn.jsx");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks/index.js");
/* harmony import */ var _ScheduleNotFound__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ScheduleNotFound */ "./src/admin/cal/components/ScheduleNotFound.jsx");
/* harmony import */ var _hooks_useNormalizedDays__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../hooks/useNormalizedDays */ "./src/admin/cal/hooks/useNormalizedDays.js");
/* harmony import */ var _hooks_useSlotActions__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../hooks/useSlotActions */ "./src/admin/cal/hooks/useSlotActions.js");
/* harmony import */ var _CalendarLoading__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CalendarLoading */ "./src/admin/cal/components/CalendarLoading.jsx");
/* harmony import */ var _CalendarError__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CalendarError */ "./src/admin/cal/components/CalendarError.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);










const CalendarGrid = () => {
  const {
    schedule,
    loading: loadingSchedule,
    error: scheduleError,
    refetch: refetchSchedule
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useSchedule)();
  const scheduleIdFromData = schedule?.id;
  const {
    appointments,
    loading: loadingAppointments,
    error: appointmentsError,
    refetch: refetchAppointments
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppointments)(scheduleIdFromData);
  const {
    handleStatusUpdate,
    handleDelete
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_3__.useAppointmentManagement)();
  const meetingDuration = Number(schedule?.meeting_duration || 30);
  const {
    updateSlotStatus,
    handleStatusUpdateWithRefresh,
    handleDeleteWithRefresh
  } = (0,_hooks_useSlotActions__WEBPACK_IMPORTED_MODULE_6__.useSlotActions)(scheduleIdFromData, {
    refetchSchedule,
    refetchAppointments
  }, {
    handleStatusUpdate,
    handleDelete
  });
  const {
    normalizedDays,
    timeRows
  } = (0,_hooks_useNormalizedDays__WEBPACK_IMPORTED_MODULE_5__.useNormalizedDays)(schedule, appointments, meetingDuration);
  if (loadingSchedule || loadingAppointments) return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_CalendarLoading__WEBPACK_IMPORTED_MODULE_7__["default"], {});
  if (!schedule || !schedule.id) return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_ScheduleNotFound__WEBPACK_IMPORTED_MODULE_4__["default"], {});
  if (appointmentsError || scheduleError) return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_CalendarError__WEBPACK_IMPORTED_MODULE_8__["default"], {
    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Error loading Calendar:", "appointment-booking")
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
    className: "calendar-grid",
    style: {
      gridTemplateColumns: `100px repeat(${normalizedDays.length}, 120px)`
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_TimeColumn__WEBPACK_IMPORTED_MODULE_0__.TimeColumn, {
      timeRows: timeRows
    }), normalizedDays.map(day => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_DayColumn__WEBPACK_IMPORTED_MODULE_1__.DayColumn, {
      day: day,
      onStatusUpdate: handleStatusUpdateWithRefresh,
      onChangeSlotStatus: updateSlotStatus,
      onDelete: handleDeleteWithRefresh
    }, day.date))]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/CalendarHeader.jsx":
/*!*****************************************************!*\
  !*** ./src/admin/cal/components/CalendarHeader.jsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarHeader: () => (/* binding */ CalendarHeader)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../hooks */ "./src/hooks/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const CalendarHeader = () => {
  const {
    schedule
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_1__.useSchedule)();
  if (!schedule || !schedule.id) return null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("h2", {
    children: [schedule?.name, " ", schedule ? Number(schedule.is_active) ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("(Active)", "appointment-booking") : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("(Inactive)", "appointment-booking") : null]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/CalendarLoading.jsx":
/*!******************************************************!*\
  !*** ./src/admin/cal/components/CalendarLoading.jsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CalendarLoading)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function CalendarLoading() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "calendar-loading",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Loading calendar...", "appointment-booking")
    })
  });
}

/***/ }),

/***/ "./src/admin/cal/components/CalendarView.jsx":
/*!***************************************************!*\
  !*** ./src/admin/cal/components/CalendarView.jsx ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarView: () => (/* binding */ CalendarView)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CalendarHeader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CalendarHeader */ "./src/admin/cal/components/CalendarHeader.jsx");
/* harmony import */ var _CalendarGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CalendarGrid */ "./src/admin/cal/components/CalendarGrid.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const CalendarView = () => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: "calendar-view",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "calendar-header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_CalendarHeader__WEBPACK_IMPORTED_MODULE_1__.CalendarHeader, {})
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_CalendarGrid__WEBPACK_IMPORTED_MODULE_2__.CalendarGrid, {})]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/DayColumn.jsx":
/*!************************************************!*\
  !*** ./src/admin/cal/components/DayColumn.jsx ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DayColumn: () => (/* binding */ DayColumn)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AppointmentSlot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AppointmentSlot */ "./src/admin/cal/components/AppointmentSlot.jsx");
/* harmony import */ var _Slot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Slot */ "./src/admin/cal/components/Slot.jsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const DayColumn = ({
  day,
  onStatusUpdate,
  onDelete,
  onChangeSlotStatus
}) => {
  const today = new Date().toISOString().split("T")[0];
  const isToday = day.date === today;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
    className: `day-column ${isToday ? "today" : ""}`,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "day-header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: "day-name",
          children: day?.weekday
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "day-number",
            children: day?.day_number
          }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "month-name",
            children: day?.month_name
          }), " ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("span", {
            className: "year-number",
            children: day?.year
          })]
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "time-slots",
      children: (day.slots || []).map((slot, index) => {
        const isUnavailable = slot.status === "unavailable";
        const isReserved = slot.status === "reserved" && slot.appointment;
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          className: `time-slot-container${isUnavailable ? " excluded" : ""}`,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
            className: "time-slot-content",
            children: isReserved ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_AppointmentSlot__WEBPACK_IMPORTED_MODULE_1__.AppointmentSlot, {
              appointment: slot.appointment,
              onStatusUpdate: onStatusUpdate,
              onDelete: onDelete
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_Slot__WEBPACK_IMPORTED_MODULE_2__.Slot, {
              slot: slot,
              date: day.date,
              onChangeStatus: onChangeSlotStatus
            })
          })
        }, index);
      })
    })]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/ScheduleNotFound.jsx":
/*!*******************************************************!*\
  !*** ./src/admin/cal/components/ScheduleNotFound.jsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const ScheduleNotFound = () => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "calendar-no-schedule",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "calendar-icon",
      children: "\uD83D\uDCC5"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("No Schedule Found", "appointment-booking")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("You need to create a schedule before you can view the calendar.", "appointment-booking")
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
      href: window.location.origin + "/wp-admin/admin.php?page=appointment-booking-scheduling",
      className: "create-schedule-button",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Create Your First Schedule Here", "appointment-booking")
    })]
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScheduleNotFound);

/***/ }),

/***/ "./src/admin/cal/components/Slot.jsx":
/*!*******************************************!*\
  !*** ./src/admin/cal/components/Slot.jsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Slot: () => (/* binding */ Slot)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const Slot = ({
  slot,
  date,
  onChangeStatus
}) => {
  const [isOpen, setIsOpen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [newStatus, setNewStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(slot?.status || "available");
  const label = slot?.status === "available" ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("available", "appointment-booking") : "";
  const open = () => {
    setNewStatus(slot?.status || "available");
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);
  const handleSave = async () => {
    try {
      if (typeof onChangeStatus === "function") {
        await onChangeStatus(date, `${slot.start}-${slot.end}`, newStatus);
      }
    } finally {
      close();
    }
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
      className: "empty-slot clickable",
      onClick: open,
      children: label
    }), isOpen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Modal, {
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Update Slot Status", "appointment-booking"),
      onRequestClose: close,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "slot-status-modal",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
          style: {
            marginBottom: 12
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("strong", {
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Time:", "appointment-booking"), " ", slot.start, "-", slot.end]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Status", "appointment-booking"),
          value: newStatus,
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("available", "appointment-booking"),
            value: "available"
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("unavailable", "appointment-booking"),
            value: "unavailable"
          }],
          onChange: value => setNewStatus(value)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
          style: {
            display: "flex",
            gap: 8,
            marginTop: 16,
            justifyContent: "flex-end"
          },
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "secondary",
            onClick: close,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Cancel", "appointment-booking")
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "primary",
            onClick: handleSave,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Save", "appointment-booking")
          })]
        })]
      })
    })]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/TimeColumn.jsx":
/*!*************************************************!*\
  !*** ./src/admin/cal/components/TimeColumn.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimeColumn: () => (/* binding */ TimeColumn)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


const TimeColumn = ({
  timeRows
}) => {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "time-column",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "time-header",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Time", "appointment-booking")
    }), timeRows.map((row, index) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "time-slot",
      children: row.key
    }, `slot-${index}`))]
  });
};


/***/ }),

/***/ "./src/admin/cal/components/index.js":
/*!*******************************************!*\
  !*** ./src/admin/cal/components/index.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarView: () => (/* reexport safe */ _CalendarView__WEBPACK_IMPORTED_MODULE_0__.CalendarView)
/* harmony export */ });
/* harmony import */ var _CalendarView__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CalendarView */ "./src/admin/cal/components/CalendarView.jsx");


/***/ }),

/***/ "./src/admin/cal/hooks/useNormalizedDays.js":
/*!**************************************************!*\
  !*** ./src/admin/cal/hooks/useNormalizedDays.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useNormalizedDays: () => (/* binding */ useNormalizedDays)
/* harmony export */ });
/* harmony import */ var _utils_time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/time */ "./src/admin/cal/utils/time.js");

const useNormalizedDays = (schedule, appointments, meetingDuration) => {
  const days = Array.isArray(schedule?.timeslots) ? schedule.timeslots : [];
  const timeRows = (0,_utils_time__WEBPACK_IMPORTED_MODULE_0__.computeTimeRows)(schedule?.timeslots, meetingDuration);
  const appointmentByDateSlot = new Map((Array.isArray(appointments) ? appointments : []).map(apt => [`${apt.appointment_date} ${apt.time_slot}`, apt]));
  const normalizedDays = days.map(day => {
    const slotByKey = new Map((Array.isArray(day?.slots) ? day.slots : []).map(slot => [`${slot.start}-${slot.end}`, slot]));
    const normalizedSlots = timeRows.map(row => {
      const existing = slotByKey.get(row.key);
      if (existing) {
        if (existing.status === "reserved") {
          const aptKey = `${day.date} ${row.key}`;
          const apt = appointmentByDateSlot.get(aptKey);
          return apt ? {
            ...existing,
            appointment: apt
          } : existing;
        }
        return existing;
      }
      return {
        start: row.start,
        end: row.end,
        status: "unavailable"
      };
    });
    return {
      ...day,
      slots: normalizedSlots
    };
  });
  return {
    normalizedDays,
    timeRows
  };
};

/***/ }),

/***/ "./src/admin/cal/hooks/useSlotActions.js":
/*!***********************************************!*\
  !*** ./src/admin/cal/hooks/useSlotActions.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSlotActions: () => (/* binding */ useSlotActions)
/* harmony export */ });
// src/admin/cal/hooks/useSlotActions.js
const useSlotActions = (scheduleId, {
  refetchSchedule,
  refetchAppointments
}, {
  handleStatusUpdate,
  handleDelete
}) => {
  const updateSlotStatus = async (date, timeSlot, status) => {
    try {
      const response = await fetch(`/wp-json/appointment-booking/v1/schedule/slot`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpApiSettings.nonce
        },
        body: JSON.stringify({
          schedule_id: scheduleId,
          date,
          time_slot: timeSlot,
          status
        })
      });
      if (!response.ok) throw new Error("Failed to update slot status");
      await response.json().catch(() => ({}));
      refetchSchedule();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };
  const handleStatusUpdateWithRefresh = async (id, newStatus) => {
    const ok = await handleStatusUpdate(id, newStatus);
    if (ok) refetchAppointments();
    return ok;
  };
  const handleDeleteWithRefresh = async id => {
    const ok = await handleDelete(id);
    if (ok) {
      refetchAppointments();
      refetchSchedule();
    }
    return ok;
  };
  return {
    updateSlotStatus,
    handleStatusUpdateWithRefresh,
    handleDeleteWithRefresh
  };
};

/***/ }),

/***/ "./src/admin/cal/utils/time.js":
/*!*************************************!*\
  !*** ./src/admin/cal/utils/time.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   computeTimeRows: () => (/* binding */ computeTimeRows),
/* harmony export */   formatTime: () => (/* binding */ formatTime),
/* harmony export */   getDisplayRange: () => (/* binding */ getDisplayRange),
/* harmony export */   parseTimeToMinutes: () => (/* binding */ parseTimeToMinutes)
/* harmony export */ });
// src/admin/cal/utils/time.js
const formatTime = totalMinutes => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const pad = n => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}`;
};
const parseTimeToMinutes = hhmm => {
  if (!hhmm || typeof hhmm !== "string") return null;
  const [h, m] = hhmm.split(":").map(n => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};
const getDisplayRange = timeslots => {
  let earliest = Infinity;
  let latest = -Infinity;
  if (Array.isArray(timeslots)) {
    timeslots.forEach(day => {
      const slots = Array.isArray(day?.slots) ? day.slots : [];
      slots.forEach(slot => {
        const sMin = parseTimeToMinutes(slot?.start);
        const eMin = parseTimeToMinutes(slot?.end);
        if (sMin != null && eMin != null) {
          if (sMin < earliest) earliest = sMin;
          if (eMin > latest) latest = eMin;
        }
      });
    });
  }
  if (!Number.isFinite(earliest) || !Number.isFinite(latest) || earliest >= latest) {
    return {
      start: 0,
      end: 24 * 60
    };
  }
  return {
    start: earliest,
    end: latest
  };
};
const computeTimeRows = (timeslots, meetingDuration) => {
  const rows = [];
  if (meetingDuration <= 0) return rows;
  const {
    start: rangeStart,
    end: rangeEnd
  } = getDisplayRange(timeslots);
  let start = rangeStart;
  while (start + meetingDuration <= rangeEnd) {
    const end = start + meetingDuration;
    rows.push({
      start: formatTime(start),
      end: formatTime(end),
      key: `${formatTime(start)}-${formatTime(end)}`
    });
    start = end;
  }
  return rows;
};

/***/ }),

/***/ "./src/hooks/ScheduleContext.js":
/*!**************************************!*\
  !*** ./src/hooks/ScheduleContext.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleProvider: () => (/* binding */ ScheduleProvider),
/* harmony export */   useSchedule: () => (/* binding */ useSchedule)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _useActiveSchedule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useActiveSchedule */ "./src/hooks/useActiveSchedule.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const ScheduleContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
const ScheduleProvider = ({
  scheduleId,
  children
}) => {
  const scheduleState = (0,_useActiveSchedule__WEBPACK_IMPORTED_MODULE_1__.useActiveSchedule)(scheduleId);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(ScheduleContext.Provider, {
    value: scheduleState,
    children: children
  });
};
const useSchedule = () => {
  const ctx = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useContext)(ScheduleContext);
  if (!ctx) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return ctx;
};

/***/ }),

/***/ "./src/hooks/index.js":
/*!****************************!*\
  !*** ./src/hooks/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleProvider: () => (/* reexport safe */ _ScheduleContext__WEBPACK_IMPORTED_MODULE_3__.ScheduleProvider),
/* harmony export */   useActiveSchedule: () => (/* reexport safe */ _useActiveSchedule__WEBPACK_IMPORTED_MODULE_2__.useActiveSchedule),
/* harmony export */   useAppointmentManagement: () => (/* reexport safe */ _useAppointmentManagement__WEBPACK_IMPORTED_MODULE_1__.useAppointmentManagement),
/* harmony export */   useAppointments: () => (/* reexport safe */ _useAppointments__WEBPACK_IMPORTED_MODULE_0__.useAppointments),
/* harmony export */   useSchedule: () => (/* reexport safe */ _ScheduleContext__WEBPACK_IMPORTED_MODULE_3__.useSchedule)
/* harmony export */ });
/* harmony import */ var _useAppointments__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./useAppointments */ "./src/hooks/useAppointments.js");
/* harmony import */ var _useAppointmentManagement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./useAppointmentManagement */ "./src/hooks/useAppointmentManagement.js");
/* harmony import */ var _useActiveSchedule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./useActiveSchedule */ "./src/hooks/useActiveSchedule.js");
/* harmony import */ var _ScheduleContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ScheduleContext */ "./src/hooks/ScheduleContext.js");





/***/ }),

/***/ "./src/hooks/useActiveSchedule.js":
/*!****************************************!*\
  !*** ./src/hooks/useActiveSchedule.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useActiveSchedule: () => (/* binding */ useActiveSchedule)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


/**
 * Custom hook for fetching and managing active schedule data
 * @returns {Object} - { schedule, loading, error, refetch }
 */
const useActiveSchedule = scheduleId => {
  const [schedule, setSchedule] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const fetchActiveSchedule = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const path = scheduleId ? `/wp-json/appointment-booking/v1/schedule/${encodeURIComponent(scheduleId)}` : `/wp-json/appointment-booking/v1/schedule/active`;
      console.log("path", path);
      const response = await fetch(path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Provided by wp_localize_script in admin enqueue
          ...(typeof window !== "undefined" && window.location.pathname.includes("/wp-admin/") && typeof wpApiSettings !== "undefined" && {
            "X-WP-Nonce": wpApiSettings.nonce
          })
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

/***/ "./src/hooks/useAppointmentManagement.js":
/*!***********************************************!*\
  !*** ./src/hooks/useAppointmentManagement.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAppointmentManagement: () => (/* binding */ useAppointmentManagement)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const useAppointmentManagement = () => {
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const handleStatusUpdate = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async (id, newStatus) => {
    try {
      setError(null);
      const response = await fetch(`/wp-json/appointment-booking/v1/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpApiSettings.nonce
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
      return true;
    } catch (err) {
      setError("Failed to update appointment status");
      console.error("Error updating appointment status:", err);
      return false;
    }
  }, []);
  const handleDelete = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async id => {
    try {
      setError(null);
      const response = await fetch(`/wp-json/appointment-booking/v1/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "X-WP-Nonce": wpApiSettings.nonce
        }
      });
      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }
      return true;
    } catch (err) {
      setError("Failed to delete appointment");
      console.error("Error deleting appointment:", err);
      return false;
    }
  }, []);
  return {
    handleStatusUpdate,
    handleDelete,
    error
  };
};

/***/ }),

/***/ "./src/hooks/useAppointments.js":
/*!**************************************!*\
  !*** ./src/hooks/useAppointments.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAppointments: () => (/* binding */ useAppointments)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

const useAppointments = scheduleId => {
  const [appointments, setAppointments] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const fetchAppointments = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = scheduleId ? `?schedule_id=${encodeURIComponent(scheduleId)}` : "";
      const response = await fetch(`/wp-json/appointment-booking/v1/appointments${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpApiSettings.nonce
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
      // eslint-disable-next-line no-console
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [scheduleId]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchAppointments();
  }, [fetchAppointments]);
  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments
  };
};

/***/ }),

/***/ "./src/lib/appointmentUtils.js":
/*!*************************************!*\
  !*** ./src/lib/appointmentUtils.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatDate: () => (/* binding */ formatDate),
/* harmony export */   generateWhatsAppLink: () => (/* binding */ generateWhatsAppLink),
/* harmony export */   getDefaultWhatsAppMessage: () => (/* binding */ getDefaultWhatsAppMessage),
/* harmony export */   getStatusBorderColor: () => (/* binding */ getStatusBorderColor),
/* harmony export */   getStatusColor: () => (/* binding */ getStatusColor),
/* harmony export */   getStatusLabel: () => (/* binding */ getStatusLabel),
/* harmony export */   statusOptions: () => (/* binding */ statusOptions)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);

const getStatusColor = status => {
  switch (status) {
    case "pending":
      return "#f0ad4e";
    // Orange
    case "confirmed":
      return "#5cb85c";
    // Green
    case "completed":
      return "#337ab7";
    // Blue
    case "cancelled":
      return "#d9534f";
    // Red
    default:
      return "#777";
    // Gray
  }
};
const getStatusBorderColor = status => {
  switch (status) {
    case "pending":
      return "#d58512";
    case "confirmed":
      return "#449d44";
    case "completed":
      return "#286090";
    case "cancelled":
      return "#b52b27";
    default:
      return "#333333";
  }
};
const getStatusLabel = status => {
  switch (status) {
    case "pending":
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Pending", "appointment-booking");
    case "confirmed":
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Confirmed", "appointment-booking");
    case "completed":
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Completed", "appointment-booking");
    case "cancelled":
      return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Cancelled", "appointment-booking");
    default:
      return status;
  }
};
const statusOptions = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Pending", "appointment-booking"),
  value: "pending"
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Confirmed", "appointment-booking"),
  value: "confirmed"
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Completed", "appointment-booking"),
  value: "completed"
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Cancelled", "appointment-booking"),
  value: "cancelled"
}];
const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};
const getDefaultWhatsAppMessage = appointment => {
  return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)("Hello {name}, this is regarding your appointment on {date} at {time}.", "appointment-booking").replace("{name}", appointment.client_name).replace("{date}", formatDate(appointment.appointment_date)).replace("{time}", appointment.time_slot);
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
/*!********************************!*\
  !*** ./src/admin/cal/index.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cal_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cal.scss */ "./src/admin/cal/cal.scss");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components */ "./src/admin/cal/components/index.js");
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../hooks */ "./src/hooks/index.js");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default()(() => {
  const root = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createRoot)(document.getElementById("appointment-booking-cal"));

  // Read schedule_id from the current admin page URL if present
  const params = new URL(window.location.href).searchParams;
  const scheduleIdParam = params.get("schedule_id");
  const scheduleId = scheduleIdParam ? Number(scheduleIdParam) : undefined;
  root.render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_hooks__WEBPACK_IMPORTED_MODULE_4__.ScheduleProvider, {
    scheduleId: scheduleId,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components__WEBPACK_IMPORTED_MODULE_3__.CalendarView, {})
  }));
});
})();

/******/ })()
;
//# sourceMappingURL=cal.js.map