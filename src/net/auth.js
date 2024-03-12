import { ElMessage } from "element-plus";

const authItemName = "authorize"

function takeAccessToken() {
    const str = localStorage.getItem(authItemName) || sessionStorage.getItem(authItemName);

    if (!str) return null;

    const authObj = JSON.parse(str);

    if (new Date(authObj.expire) <= new Date()) {
        deleteAccessToken();
        ElMessage.warning("Login status has expired, please login again!");
        return null;
    }
    return authObj.token;
}

function storeAccessToken(remember, token, expire) {
    const authObj = {
        token: token,
        expire: expire
    }
    const str = JSON.stringify(authObj);

    if (remember)
        localStorage.setItem(authItemName, str);
    else
        sessionStorage.setItem(authItemName, str);
}

function deleteAccessToken() {
    localStorage.removeItem(authItemName);
    localStorage.removeItem('loginInfo');
    sessionStorage.removeItem(authItemName);
}

export { takeAccessToken, storeAccessToken, deleteAccessToken }