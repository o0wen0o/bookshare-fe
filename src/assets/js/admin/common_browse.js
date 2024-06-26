import { ElMessage } from "element-plus";
import { get, _delete } from "@/net/index.js";
import moment from 'moment';

// Modify route name for page title
const capitalizeRouteName = (name) => {
    const words = name.split('-');
    const capitalizedWords = words.map(word => {
        // Capitalize the first character of each word
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalizedWords.join(' ');
};

// Prepares delete action (opens dialog)
function prepareDeleteItem(deleteItemId, dialog, ids) {
    deleteItemId.value = ids;
    dialog.value = true;
}

const performSearch = (page, fetchItems) => {
    page.value = 1; // Reset to first page
    fetchItems();
};

// Update the items per page for data table
const updateItemsPerPage = (itemsPerPage, newItemsPerPage, fetchItems) => {
    itemsPerPage.value = newItemsPerPage;
    fetchItems();
};

// Update the page for data table
const updatePage = (page, newPage, fetchItems) => {
    page.value = newPage;
    fetchItems();
};

// Fetch items for data table
const fetchItems = (loading, items, totalItems, page, itemsPerPage, search, routePath) => {
    loading.value = true;
    const params = {
        current: page.value,
        size: itemsPerPage.value,
        filter: search.value,
    };

    get(
        `/api${routePath}/`,
        (data) => {
            items.value = data.records;
            totalItems.value = data.total;
            loading.value = false;
        },
        (message) => {
            ElMessage.warning(message);
        },
        params
    );
};

// Bulk delete after confirmation dialog
const bulkDelete = (route, ids, dialog, fetchItems) => {
    _delete(`/api${route.path}/delete`, ids, () => {
        ElMessage.success("Items deleted successfully");
        dialog.value = false; // Close the dialog
        fetchItems();
    });
};

const formatDatetime = (timestamp) => {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
};

export {
    capitalizeRouteName,
    prepareDeleteItem,
    performSearch,
    updateItemsPerPage,
    updatePage,
    fetchItems,
    bulkDelete,
    formatDatetime,
    formatDate
};