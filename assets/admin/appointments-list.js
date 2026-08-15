(function () {
	function getSelectedIds() {
		return Array.prototype.map.call(
			document.querySelectorAll('#the-list input[name="appointment[]"]:checked'),
			function (el) {
				return el.value;
			}
		);
	}

	function getBulkAction(submitter) {
		if (submitter && submitter.id === 'doaction2') {
			var bottom = document.getElementById('bulk-action-selector-bottom');
			return bottom ? bottom.value : '-1';
		}
		var top = document.getElementById('bulk-action-selector-top');
		return top ? top.value : '-1';
	}

	function showBulkEdit() {
		var ids = getSelectedIds();
		var i18n = window.nobatAppointmentsList || {};

		if (!ids.length) {
			window.alert(i18n.selectAppointments || 'Please select one or more appointments.');
			return;
		}

		var form = document.getElementById('nobat-bulk-edit-form');
		var idsWrap = document.getElementById('nobat-bulk-edit-ids');
		var countEl = document.getElementById('nobat-bulk-edit-count');
		if (!form || !idsWrap) {
			return;
		}

		idsWrap.innerHTML = ids
			.map(function (id) {
				return '<input type="hidden" name="appointment[]" value="' + String(id).replace(/"/g, '') + '" />';
			})
			.join('');

		if (countEl) {
			var template = i18n.selectedCount || '%d appointment(s) selected.';
			countEl.textContent = template.replace('%d', String(ids.length));
		}

		form.hidden = false;
		form.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function hideBulkEdit() {
		var form = document.getElementById('nobat-bulk-edit-form');
		if (form) {
			form.hidden = true;
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		var filterForm = document.getElementById('nobat-appointments-filter');
		if (!filterForm) {
			return;
		}

		filterForm.addEventListener('submit', function (e) {
			var submitter = e.submitter;
			if (submitter && submitter.name === 'filter_action') {
				return;
			}

			var action = getBulkAction(submitter);
			var i18n = window.nobatAppointmentsList || {};

			if (action === 'edit') {
				e.preventDefault();
				showBulkEdit();
				return;
			}

			if (action === 'delete') {
				if (!getSelectedIds().length) {
					e.preventDefault();
					window.alert(i18n.selectAppointments || 'Please select one or more appointments.');
					return;
				}
				if (!window.confirm(i18n.confirmDelete || 'Delete the selected appointments?')) {
					e.preventDefault();
				}
			}
		});

		var cancel = document.getElementById('nobat-bulk-edit-cancel');
		if (cancel) {
			cancel.addEventListener('click', hideBulkEdit);
		}
	});
})();
