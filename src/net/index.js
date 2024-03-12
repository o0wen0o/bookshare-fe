import axios from "axios";
import { ElMessage } from "element-plus";
import { takeAccessToken, storeAccessToken, deleteAccessToken } from "./auth";

const accessHeader = () => {
    return {
        'Authorization': `Bearer ${takeAccessToken()}`
    }
}

const defaultError = (error) => {
    console.error(error);
    ElMessage.error('发生了一些错误，请联系管理员');
}

const defaultFailure = (message, status, url) => {
    console.warn(`请求地址: ${url}, 状态码: ${status}, 错误信息: ${message}`);
    ElMessage.warning(message);
}

function internalPost(url, data, headers, success, failure, error = defaultError) {
    axios.post(url, data, { headers: headers }).then(({ data }) => {
        if (data.code === 200)
            success(data.data); // data after 'then' is the response data
        else
            failure(data.message, data.code, url);
    }).catch(err => error(err));
}

function post(url, data, success, failure = defaultFailure) {
    internalPost(url, data, accessHeader(), success, failure);
}

function internalGet(url, success, failure, params, error = defaultError) {
    axios.get(url, {
        headers: accessHeader(),
        params: params
    }).then(({ data }) => {
        if (data.code === 200)
            success(data.data);
        else
            failure(data.message, data.code, url);
    }).catch(err => error(err));
}

function get(url, success, failure = defaultFailure, params = {}) {
    internalGet(url, success, failure, params);
}

function internalDelete(url, ids, success, failure, error = defaultError) {
    axios.delete(url, {
        headers: accessHeader(),
        ids: ids
    }).then(({ data }) => {
        if (data.code === 200)
            success();
        else
            failure(data.message, data.code, url);
    }).catch(err => error(err));
}

function _delete(url, ids, success, failure = defaultFailure) {
    internalDelete(url, ids, success, failure);
}

// remember is the checkbox
function login(email, password, remember, success, failure = defaultFailure) {
    internalPost('/api/auth/login', {
        // username and password for SpringSecurity
        username: email,
        password: password
    }, {
        'Content-Type': 'application/x-www-form-urlencoded'
    }, (data) => {
        // Store the access token to the local/session storage
        storeAccessToken(remember, data.token, data.expire);

        ElMessage.success(`Login successful, welcome ${data.username} to our system!`);
        success(data);
    }, failure);
}

function logout(success, failure = defaultFailure) {
    get('/api/auth/logout', () => {
        deleteAccessToken();
        ElMessage.success(`Logout successfully, welcome again!`);
        success();
    }, failure);
}

function unauthorized() {
    return !takeAccessToken();
}

export { post, get, _delete, login, logout, unauthorized }
