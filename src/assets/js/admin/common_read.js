import moment from 'moment';

const capitalizeRouteName = (name) => {
    const words = name.split('-');
    const capitalizedWords = words.slice(0, -1).map(word => {
        // Remove the last character only if it's 's'
        const trimmedWord = word.endsWith('s') ? word.slice(0, -1) : word;
        // Capitalize the first character of each word
        return trimmedWord.charAt(0).toUpperCase() + trimmedWord.slice(1);
    });
    return capitalizedWords.join(' ');
};

// modify route name for sending request
const getRouteNameForApi = (name) => {
    const words = name.split('-');
    const removedLastWord = words.slice(0, -1);
    return removedLastWord.join('-');
}

const formatDatetime = (timestamp) => {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const formatDate = (date) => {
    return moment(date).format('YYYY-MM-DD');
};

export {
    capitalizeRouteName,
    getRouteNameForApi,
    formatDatetime,
    formatDate
}