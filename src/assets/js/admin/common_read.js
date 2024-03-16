// modify route name for sending request
const getRouteNameForApi = (name) => {
    const words = name.split('-');
    const removedLastWord = words.slice(0, -1);
    return removedLastWord.join('-');
}


export {
    getRouteNameForApi
}