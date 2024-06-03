import axios from 'axios'
import { ElMessage } from 'element-plus'
import {setToken,refreshToken, getToken} from './request'
import { useRouter} from 'vue-router'



// const baseUrl = process.env.VUE_APP_BASE_API;
const baseUrl = '';

export default {
    get: get,
    post: post,
    put: put,
    postImg: postImg
}

function get(url, params) {
    return send('GET', url, params);
}
function put(url, params, data) {
    return send('PUT', url, params, data);
}

function post(url, params, data) {
    return send('POST', url, params, data);
}

function postImg(url, formData) {
    return send('POST', url, {}, {}, formData);
}

function send(method, url, params, data, fd) {
    params = params || {};
    params.t = new Date().getTime();
    return axios({
        method: method,
        url: url,
        baseURL: baseUrl,
        params: params,
        data: fd ? getFormData(fd) : data ? JSON.stringify(data) : JSON.stringify({}),
        headers: { 
            'Content-Type': fd ? 'application/x-www-form-urlencoded' : 'application/json; charset=utf-8',
            'token':sessionStorage.getItem('token')
        }
    }).then(function (res) {
        res = res.data;
        if (res.IsSuccess) {
            return res.Data;
        } else {
            if(res.Data == "-99999"){
                const router = useRouter();
                router.push({
                    path:'/test-computer-akd-login'
                });
            }else{
                ElMessage.error(res.Message);
            }
            
            return Promise.reject(res);
        }
    }).catch(function (error) {
        if (error && error.response) {
            ElMessage.error(error.response);
        } 
        return Promise.reject(error);
    }).catch(err => {
        return Promise.reject(err);
    });
}

function getFormData(fd) {
    const formData = new FormData();
    Object.keys(fd).map(f => {
        formData.append(f, fd[f]);
    });
    return formData;
}

