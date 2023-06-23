import  { handleResponse } from '../utils';
import { API_BASE } from '../config/constants';
import apiCall from './apiCall';

const getAllProducer = async (search) => {
    if(search){
        let url = new URL(`${API_BASE}/producer/getallproducer`);
        const params = { search: search };
        url.search = new URLSearchParams(params);
        
        const requestOptions = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(url, requestOptions);
        const producers = await handleResponse(response);
        return producers;
    }
    
}

const getTotalProducer = async (search) => {
        let url = new URL(`${API_BASE}/producer/gettotalproducer`);
        
        const requestOptions = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(url, requestOptions);
        const total_producers = await handleResponse(response);
        return total_producers;
}

const registerProducer = async (formData) => {
    try{
        const producer = await apiCall.post(`${API_BASE}/producer/register`, formData);
        return producer.data;
    }catch(err){
        const error = (err.response.data && err.response.data.message) || "No";
        throw new Error(error);
    }
}

export const producerService = {
    getAllProducer,
    registerProducer,
    getTotalProducer
}