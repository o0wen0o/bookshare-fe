var placeholderSets = {};

function setTablePlaceholders(tableName, placeholders) {
    if (!placeholderSets[tableName]) {
        placeholderSets[tableName] = {};
    }
    Object.assign(placeholderSets[tableName], placeholders);
}

function getTablePlaceholder(filterId) {
    // Get prefix from filterId
    var prefix = filterId.substring(0, filterId.indexOf('_'));

    // Get column name from filterId
    var columnName = filterId
        .substring(filterId.indexOf('_') + 1)
        .split('Filter')[0];

    return placeholderSets[prefix][columnName] || 'Enter Value';
}

function createTextInputFilter(cell, filterId, table) {
    // Create a text input filter for the specified column
    var input = $('<input type="text" placeholder="' + getTablePlaceholder(filterId) + '" />')
        .attr('id', filterId)
        .appendTo(cell)
        .on('change', function () {
            table.draw();
        });
}

function createDropdownFilter(cell, options, filterId, table) {
    // Create a dropdown filter for the specified column
    var select = $('<select><option value="">All</option></select>')
        .attr('id', filterId)
        .appendTo(cell)
        .on('change', function () {
            table.draw();
        });

    // Populate the dropdown options
    options.forEach(function (value) {
        select.append('<option value="' + value + '">' + value + '</option>');
    });
}

function createDateRangePickerFilter(cell, filterId, is_datetime, table) {
    // Create a container div to hold the date range inputs
    var container = $('<div class="range-filter-container"></div>').appendTo(cell);

    var startInput = $('<input type="text" class="range-filter-input" placeholder="Start">')
        .attr('id', filterId + 'Start');
    var hyphen = $('<span style="margin: 0 5px"> - </span>');
    var endInput = $('<input type="text" class="range-filter-input" placeholder="End">')
        .attr('id', filterId + 'End');

    container.append(startInput).append(hyphen).append(endInput);

    // Initialize datepickers for 'Start' and 'End' inputs
    if (is_datetime) {
        initializeDatetimepicker(startInput, table);
        initializeDatetimepicker(endInput, table);
    } else {
        initializeDatepicker(startInput, table);
        initializeDatepicker(endInput, table);
    }
}

function initializeDatepicker(input, table) {
    input.datetimepicker({
        format: 'd-m-Y',
        defaultTime: '00:00',
        timepicker: false,
        onChangeDateTime: function () {
            table.draw();
        }
    }).on("input", function () {
        table.draw();
    });
}

function initializeDatetimepicker(input, table) {
    input.datetimepicker({
        format: 'd-m-Y H:i:s',
        step: 15, // Time step in minutes
        defaultTime: '00:00',
        timepicker: true,
        onChangeDateTime: function () {
            table.draw();
        }
    }).on("input", function () {
        table.draw();
    });
}

// Common rendering function to display hyphen for null values
function renderWithHyphenIfNull(data) {
    return data !== null ? data : '-';
}

// Capitalize the first letter of the string
function capitalizeFirstLetter(str) {
    return (str !== null) ? str.charAt(0).toUpperCase() + str.slice(1) : renderWithHyphenIfNull(str);
}

// Date formatting function
function formatDate(date) {
    return (date !== null) ? moment(date).format('DD-MM-YYYY') : null;
}

// Datetime formatting function
function formatDatetime(date) {
    return (date !== null) ? moment(date).format('DD-MM-YYYY HH:mm:ss') : null;
}

// Get view action
function getViewAction(route) {
    var baseUrl = '';

    const view = $('<a>', {
        href: `${baseUrl}/${route}`,
        class: 'btn btn-sm btn-warning actionButton',
        style: 'padding: 5px 10px',
    }).append($('<i>', {
        class: 'voyager-eye',
    })).append($('<span>', {
        text: ' View',
    })).prop('outerHTML');

    return view;
}

// Get Resend action
function getResendAction(route) {
    var baseUrl = '';

    const view = $('<a>', {
        href: `${baseUrl}/${route}`,
        class: 'btn btn-sm btn-primary actionButton',
    }).append($('<i>', {
        class: 'voyager-mail',
    })).append($('<span>', {
        text: ' Resend',
    })).prop('outerHTML');

    return view;
}

function getCancelAction(route) {
    var baseUrl = '';

    const view = $('<a>', {
        href: `${baseUrl}/${route}`,
        class: 'btn btn-sm btn-danger actionButton',
        style: 'margin-top:5px',
    }).append($('<i>', {
        class: 'voyager-x',
    })).append($('<span>', {
        text: ' Cancel',
    })).prop('outerHTML');

    return view;
}
// Combine action buttons
function combineActionButtons(actions) {
    if (!Array.isArray(actions)) {
        throw new Error('Actions should be provided as an array.');
    }

    const combinedActions = $('<div class="actionButtons">');
    actions.forEach(action => {
        combinedActions.append(action);
    });

    return combinedActions.prop('outerHTML');
}

function setupTableExportButtons(table, prefix) {
    // Create a div for the export buttons
    var customExportButtons = $('<div>', {
        class: 'customExportButtons',
    });

    // Create the export buttons elements
    var exportCSVButton = $('<button>', {
        id: prefix + '_exportCSVButton',
        class: 'btn btn-success',
        text: 'CSV',
    });

    var exportExcelButton = $('<button>', {
        id: prefix + '_exportExcelButton',
        class: 'btn btn-success',
        text: 'Excel',
    });

    var exportPDFButton = $('<button>', {
        id: prefix + '_exportPDFButton',
        class: 'btn btn-success',
        text: 'PDF',
    });

    // Add click event handlers to the export buttons
    exportCSVButton.on('click', function () {
        table.buttons(0).trigger();
    });

    exportExcelButton.on('click', function () {
        table.buttons(1).trigger();
    });

    exportPDFButton.on('click', function () {
        table.buttons(2).trigger();
    });

    customExportButtons
        .append(exportCSVButton)
        .append(exportExcelButton)
        .append(exportPDFButton);

    $(table.table().container())
        .closest('.panel-body')
        .siblings('.panel-heading')
        .find('.customButtons')
        .append(customExportButtons);
}

function setupClearFiltersButton(table, prefix) {
    // Create the clear filters button
    var clearFiltersButton = $('<button>', {
        id: prefix + '_clearFiltersButton',
        class: 'btn btn-primary clearFiltersButton',
        text: 'Clear Filters',
    });

    // Add click event handler to the clear filters button
    clearFiltersButton.on('click', function () {
        // Clear input values and set select elements to 'All'
        $('.' + prefix + '_filters input').val('');
        $('.' + prefix + '_filters select').val('');
        table.draw();
    });

    $(table.table().container())
        .closest('.panel-body')
        .siblings('.panel-heading')
        .find('.customButtons')
        .append(clearFiltersButton);
}
