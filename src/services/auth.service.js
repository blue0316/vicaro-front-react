import { API_BASE } from '../config/constants';
import { handleResponse } from '../utils';

const login = async (email, password) => {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email, password})
    };

    const response = await fetch(`${API_BASE}/users/login`, requestOptions);
    const user = await handleResponse(response);
    localStorage.setItem('user', JSON.stringify(user.api_token));
    return user;
}

const logout = () => {
    localStorage.removeItem('user');
}

// const registerUser = async (user) => {
//     const requestOptions = {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
//         },
//         body: JSON.stringify(user)
//     };

//     const response = fetch(`${API_BASE}/users/register`, requestOptions);
//     return await handleResponse(response, logout);
// }

const forgotPassword = async (email) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify({email})
    };

    const response = fetch(`${API_BASE}/users/forgotpassword`, requestOptions);
    return await handleResponse(response);
}

export const authService = {
    login,
    logout,
    // registerUser,
    forgotPassword
}