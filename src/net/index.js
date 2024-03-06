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

function internalGet(url, headers, success, failure, error = defaultError) {
    axios.get(url, { headers: headers }).then(({ data }) => {
        if (data.code === 200)
            success(data.data);
        else
            failure(data.message, data.code, url);
    }).catch(err => error(err));
}

function post(url, data, success, failure = defaultFailure) {
    internalPost(url, data, accessHeader(), success, failure);
}

function get(url, success, failure = defaultFailure) {
    internalGet(url, accessHeader(), success, failure);
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
        storeAccessToken(remember, data.token, data.expire);
        ElMessage.success(`Login successful, welcome ${data.username} to our system!`);
        success(data.roles);
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

export { post, get, login, logout, unauthorized }
