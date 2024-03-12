import moment from 'moment';

// Creation
function createItem(router) {
    router.push(`${router.currentRoute.value.path}/create`);
}

// View action
function viewItem(router, id) {
    router.push(`${router.currentRoute.value.path}/${id}`);
}

// Edit action
function editItem(router, id) {
    router.push(`${router.currentRoute.value.path}/${id}/edit`);
}

// Prepares delete action (opens dialog)
function prepareDeleteItem(deleteItemId, dialog, id) {
    deleteItemId.value = id;
    dialog.value = true;
}

const formatDate = (date) => {
    return moment(date).format('DD-MM-YYYY HH:mm:ss');
};

export {
    createItem,
    viewItem,
    editItem,
    prepareDeleteItem,
    formatDate
};