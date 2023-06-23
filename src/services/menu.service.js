import  { handleResponse } from '../utils';
import { API_BASE } from '../config/constants';
import apiCall from './apiCall';

const getAllMenu = async (filter) => {
    let url = new URL(`${API_BASE}/winemenu/getallwinemenu`);
    url.search = new URLSearchParams(filter);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const menus = await handleResponse(response);
    return menus;
}

const getMenuTotalCount = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/getmenutotalcount`, requestOptions);
    return await handleResponse(response);
}

const registerWineMenu = async (formData) => {
    try{
        const menu = await apiCall.post(`${API_BASE}/winemenu/register`, formData);
        return menu.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Add Menu";
        throw new Error(error);
    }
}

const getMenusByFilter = async (filter) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(filter)
    };

    const response = fetch(`${API_BASE}/winemenu/getmenu`, requestOptions);
    return await handleResponse(response);
}

const removeMenu = async (id) => {
    let url = new URL(`${API_BASE}/winemenu/${id}`);
    
    const requestOptions = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const removeMenu = await handleResponse(response);
    return removeMenu;
}

const duplicateMenu = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/duplicatemenu`, requestOptions);
    return await handleResponse(response);
}

const addProductToMenus = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/addproducttomenus`, requestOptions);
    return await handleResponse(response);
}

const addPrice = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/addprice`, requestOptions);
    return await handleResponse(response);
}

const deletePrice = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/deleteprice`, requestOptions);
    return await handleResponse(response);
}

const deleteProductFromMenu = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/deleteproductfrommenu`, requestOptions);
    return await handleResponse(response);
}

const duplicateProductFromMenu = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/duplicateproductfrommenu`, requestOptions);
    return await handleResponse(response);
}

const saveSortableTree = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/winemenu/savetree`, requestOptions);
    return await handleResponse(response);
}

// const modifyMenu = async (id, formData) => {
//     try{
//         const modify_menu = await apiCall.put(`${API_BASE}/winemenu/${id}`, formData);
//         return modify_menu.data;
//     }catch(err){
//         const error = (err.response.data && err.response.data.message) || "Failed Modify Menu";
//         throw new Error(error);
//     }
// }

// const getNextPrevMenu = async (filter, pos, type) => {
//     try{
//         const formData = new FormData();
//         for(let x in filter){
//             if(x === "filterArray"){
//                 // formData.append(x, JSON.stringify(filter[x]))
//                 for (var i = 0; i < filter[x].length; i++) {
//                     formData.append('filterArray[]', JSON.stringify(filter[x][i]));
//                 }
//             }else{
//                 formData.append(x, filter[x])
//             }
//         }
//         formData.append("pos",pos);
//         formData.append("type",type);

//         const next_prev_menu = await apiCall.post(`${API_BASE}/winemenu/getnextandprev`, formData);
//         return next_prev_menu.data;
//     }catch(err){
//         const error = (err.response.data && err.response.data.message) || "Failed Get Menu";
//         throw new Error(error);
//     }
// }

export const menuService = {
    getAllMenu,
    getMenuTotalCount,
    // registerMenu,
    getMenusByFilter,
    registerWineMenu,
    removeMenu,
    duplicateMenu,
    addProductToMenus,
    addPrice,
    deletePrice,
    deleteProductFromMenu,
    duplicateProductFromMenu,
    saveSortableTree
    // modifyMenu,
    // getNextPrevMenu,
}