import { ElMessage } from "element-plus";
import { post, put } from "@/net/index.js";

// Modify route name for page title
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

const validatePhoneNumber = (rule, value, callback) => {
    const phoneNumberRegex = /^[\d-]+$/;
    if (!phoneNumberRegex.test(value)) {
        callback(new Error('Please enter a valid phone number'));
    } else {
        callback();
    }
}

const previewImage = (files, imgUrl, ossEndpoint) => {
    files.value = [{
        url: ossEndpoint + imgUrl,
    }];
}

function submitForm(dataForm, data, id, isEdit, router, route, files, contentType = 'application/json;charset=utf-8') {
    dataForm.value.validate((valid) => {
        if (valid) {
            const formData = new FormData();

            // Append user data to formData
            Object.keys(data.value).forEach(key => {
                formData.append(key, data.value[key]);
            });

            // Append file data if exists
            if (files && files.value.length > 0 && files.value[0].raw) {
                formData.append('image', files.value[0].raw);
            }

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
                    formData,
                    successCallbackForEdit,
                    errorCallback,
                    contentType
                );
            } else {
                post(
                    `/api/${getRouteNameForApi(route.name)}/create`,
                    formData,
                    successCallbackForAdd,
                    errorCallback,
                    contentType
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
    validatePhoneNumber,
    previewImage,
    submitForm
};