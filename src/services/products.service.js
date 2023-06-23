import  { handleResponse } from '../utils';
import { API_BASE } from '../config/constants';
import apiCall from './apiCall';

const getAllProduct = async (data) => {
    let url = new URL(`${API_BASE}/product/getallproduct`);
    
    url.search = new URLSearchParams(data);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const products = await handleResponse(response);
    return products;
}

const getProductTotalCount = async (data) => {
    // let url = new URL(`${API_BASE}/product/getproducttotalcount`);
    
    // url.search = new URLSearchParams(data);
    
    // const requestOptions = {
    //     method: "GET",
    //     headers: { 'Content-Type': 'application/json' },
    // };

    // const response = await fetch(url, requestOptions);
    // const count = await handleResponse(response);
    // return count;
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/product/getproducttotalcount`, requestOptions);
    return await handleResponse(response);
}

const registerProduct = async (formData) => {
    try{
        const product = await apiCall.post(`${API_BASE}/product/register`, formData);
        return product.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Add Product";
        throw new Error(error);
    }
}

const getProductsByFilter = async (filter) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(filter)
    };

    const response = fetch(`${API_BASE}/product/getproduct`, requestOptions);
    return await handleResponse(response);
}

const getProductForMenuEdit = async (filter) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(filter)
    };

    const response = fetch(`${API_BASE}/product/getproductsformenuedit`, requestOptions);
    return await handleResponse(response);
}

const removeProduct = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/product/removeproduct`, requestOptions);
    return await handleResponse(response);

    // let url = new URL(`${API_BASE}/product/${id}`);
    
    // const requestOptions = {
    //     method: "DELETE",
    //     headers: { 'Content-Type': 'application/json' },
    // };

    // const response = await fetch(url, requestOptions);
    // const removeProduct = await handleResponse(response);
    // return removeProduct;
}

const modifyProduct = async (id, formData) => {
    try{
        const modify_product = await apiCall.put(`${API_BASE}/product/${id}`, formData);
        return modify_product.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Modify Product";
        throw new Error(error);
    }
}

const getNextPrevProduct = async (filter, pos, type) => {
    try{
        const formData = new FormData();
        for(let x in filter){
            if(x === "filterArray"){
                // formData.append(x, JSON.stringify(filter[x]))
                for (var i = 0; i < filter[x].length; i++) {
                    formData.append('filterArray[]', JSON.stringify(filter[x][i]));
                }
            }else{
                formData.append(x, filter[x])
            }
        }
        formData.append("pos",pos);
        formData.append("type",type);

        const next_prev_product = await apiCall.post(`${API_BASE}/product/getnextandprev`, formData);
        return next_prev_product.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Get Product";
        throw new Error(error);
    }
}

export const productService = {
    getAllProduct,
    getProductTotalCount,
    registerProduct,
    getProductsByFilter,
    getProductForMenuEdit,
    removeProduct,
    modifyProduct,
    getNextPrevProduct,
}