import http from "./http"
import {getToken} from './index'

export function doLogin(data){
    return http.post('/api/User/DoLogin',{},data);
}

export function refreshToken(){
    return http.post('/api/User/RefreshToken',{},{
        Name:getToken()
    })
}

export function getToken(){
    return sessionStorage.getItem('token');
}

export function setToken(token){
    sessionStorage.setItem('token',token);
}