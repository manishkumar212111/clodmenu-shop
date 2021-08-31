import axios from 'axios';
import { BASE_URL, EndPoints } from './config';

const getLoggedInUserToken = () => {
    return typeof localStorage !== 'undefined' && localStorage.getItem('userDetail') && JSON.parse(localStorage.getItem('userDetail')).tokens && JSON.parse(localStorage.getItem('userDetail')).tokens.access.token;
}

const SECONDS = 30;
const MILISECONDS = 1000;
const TIMEOUT = SECONDS * MILISECONDS;

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
        'content-type':'application/json',
        'Authorization' : 'Bearer ' + getLoggedInUserToken()
        //'content-type':'application/x-www-form-urlencoded'
    },
});

const API = {
    get: (key, params = {}, id , cb) => {
        const url = process.env.REACT_APP_SERVER_URL + EndPoints[key].url + (id ? `/${id}` : "");
        return instance.get(url, {
            params,
            headers: {
                'content-type':'application/json',
                'Authorization' : 'Bearer ' + getLoggedInUserToken()
            },
        }).then(res => {
            cb(res);
        }).catch(err => {
            cb(err.response);
        });;
    },

    post: (key, data = {}, id = '' , cb) => {
        const url = process.env.REACT_APP_SERVER_URL + EndPoints[key].url + (id ? `/${id}` : "");
        
        return instance({
            'method': 'POST',
            'url': url,
            'data': data,
            headers: {
                'content-type':'application/json',
                'Authorization' : 'Bearer ' + getLoggedInUserToken()
            },
        }).then(res => {
            cb(res);
        }).catch(err => {
            cb(err.response);

        });
    },

    patch: (key, data = {}, id = '', cb) => {
        const url = process.env.REACT_APP_SERVER_URL + EndPoints[key].url + (id ? `/${id}` : "");
        return instance({
            'method': 'PATCH',
            'url': url,
            'data': data,
            headers: {
                'content-type':'application/json',
                'Authorization' : 'Bearer ' + getLoggedInUserToken()
            },
        }).then(res => {
            cb(res);
        }).catch(err => {
            cb(err.response);

        });
    },

    delete: (key, data = {}, id = '' , cb) => {
        const url = process.env.REACT_APP_SERVER_URL + EndPoints[key].url + (id ? `/${id}` : "");
        return instance({
            'method': 'DELETE',
            'url': url,
            'data': data,
            headers: {
                'content-type':'application/json',
                'Authorization' : 'Bearer ' + getLoggedInUserToken()
            },
        }).then(res => {
            cb(res);
        }).catch(err => {
            cb(err.response);

        });
    },
    // get : function (key, params = {}){
    //     return new Promise((resolve, reject) => {
    //         this._get(key, params = {})
    //         .then( data => resolve(data))
    //         .catch( error => reject(error));
    //     })
    // },

    // post : function (key, data = {}, id = ''){
    //     return new Promise((resolve, reject) => {
    //         this._post(key, data, id)
    //         .then( data => resolve(data))
    //         .catch( error => reject(error));
    //     })
    // }

};
export default API;