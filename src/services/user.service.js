import  { handleResponse } from '../utils';
import { API_BASE } from '../config/constants';
import apiCall from './apiCall';

const getUserTotalCount = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/users/getusertotalcount`, requestOptions);
    return await handleResponse(response);
}

const registerUser = async (formData) => {
    try{
        const user = await apiCall.post(`${API_BASE}/users/register`, formData);
        return user.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Add User";
        throw new Error(error);
    }
}

const modifyUser = async (id, formData) => {
    try{
        const modify_user = await apiCall.put(`${API_BASE}/users/${id}`, formData);
        return modify_user.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Modify User";
        throw new Error(error);
    }
}

const getUsersByFilter = async (filter) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(filter)
    };

    const response = fetch(`${API_BASE}/users/getusers`, requestOptions);
    return await handleResponse(response);
}

const removeUser = async (id) => {
    let url = new URL(`${API_BASE}/users/${id}`);
    
    const requestOptions = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const removeUser = await handleResponse(response);
    return removeUser;
}

// const setUserActive = async (data) => {
//     const requestOptions = {
//         method: "POST",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data)
//     };

//     const response = fetch(`${API_BASE}/user/setuseractive`, requestOptions);
//     return await handleResponse(response);
// }

export const userService = {
    getUserTotalCount,
    getUsersByFilter,
    registerUser,
    modifyUser,
    removeUser,
    // setUserActive,
}