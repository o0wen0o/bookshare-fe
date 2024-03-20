import { ElMessage } from "element-plus";
import { post, put } from "@/net/index.js";

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

const getTextRequiredRule = (message, triggers = ['blur']) => {
    return {
        required: true,
        message: message || "Field is required",
        trigger: triggers
    };
}

const validateNumber = (rule, value, callback) => {
    const phoneNumberRegex = /^\d+$/;
    if (!phoneNumberRegex.test(value)) {
        callback(new Error('Please enter a valid phone number'));
    } else {
        callback();
    }
}

const previewImage = (imagePreview, imgUrl) => {
    // Set imagePreview to the URL entered by the user
    imagePreview.value = imgUrl;
}

function submitForm(bookForm, book, id, isEdit, router, route) {
    bookForm.value.validate((valid) => {
        if (valid) {
            const successCallbackForEdit = () => {
                ElMessage.success("Updated successfully");
                router.push(`/${getRouteNameForApi(route.name)}/${id.value}`);
            };

            const successCallbackForAdd = () => {
                ElMessage.success("Created successfully");
                router.push(`/${getRouteNameForApi(route.name)}`);
            };

            const errorCallback = (error) => {
                ElMessage.error(error);
            };

            if (isEdit.value) {
                put(
                    `/api/${getRouteNameForApi(route.name)}/${id.value}/update`,
                    book.value,
                    successCallbackForEdit,
                    errorCallback
                );
            } else {
                post(
                    `/api/${getRouteNameForApi(route.name)}/create`,
                    book.value,
                    successCallbackForAdd,
                    errorCallback
                );
            }
        } else {
            ElMessage.error("Please correct the errors in the form");
            return false;
        }
    });
}

export {
    capitalizeRouteName,
    getRouteNameForApi,
    getTextRequiredRule,
    validateNumber,
    previewImage,
    submitForm
};