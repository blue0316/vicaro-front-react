import  { handleResponse } from '../utils';
import { API_BASE } from '../config/constants';
import apiCall from './apiCall';

const getCompanyTotalCount = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/company/getcompanytotalcount`, requestOptions);
    return await handleResponse(response);
}

const registerCompany = async (formData) => {
    try{
        const company = await apiCall.post(`${API_BASE}/company/register`, formData);
        return company.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Add Company";
        throw new Error(error);
    }
}

const modifyCompany = async (id, formData) => {
    try{
        const modify_company = await apiCall.put(`${API_BASE}/company/${id}`, formData);
        return modify_company.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "Failed Modify Company";
        throw new Error(error);
    }
}

const getCompaniesByFilter = async (filter) => {
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
        },
        body: JSON.stringify(filter)
    };

    const response = fetch(`${API_BASE}/company/getcompany`, requestOptions);
    return await handleResponse(response);
}

const removeCompany = async (id) => {
    let url = new URL(`${API_BASE}/company/${id}`);
    
    const requestOptions = {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const removeCompany = await handleResponse(response);
    return removeCompany;
}

const setCompanyActive = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/company/setcompanyactive`, requestOptions);
    return await handleResponse(response);
}

export const companyService = {
    getCompanyTotalCount,
    getCompaniesByFilter,
    registerCompany,
    modifyCompany,
    removeCompany,
    setCompanyActive,
}