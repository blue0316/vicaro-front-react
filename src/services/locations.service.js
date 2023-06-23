import  { handleResponse } from '../utils';
import { API_BASE } from '../config/constants';

const getAllCountry = async () => {
    let url = new URL(`${API_BASE}/country/getallcountry`);
    // const params = { search: search };
    // url.search = new URLSearchParams(params);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const countries = await handleResponse(response);
    return countries;
}

const getAllRegion = async (country_id) => {
    if(country_id){
        let url = new URL(`${API_BASE}/region/getallregion`);
        const params = { country_id: parseInt(country_id) };
        url.search = new URLSearchParams(params);
        
        const requestOptions = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(url, requestOptions);
        const regions = await handleResponse(response);
        return regions;
    }
    
}

const getTotalRegion = async () => {
    let url = new URL(`${API_BASE}/region/gettotalregion`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const total_regions = await handleResponse(response);
    return total_regions;
}

const getAllSubRegion = async (country_id, region_id) => {
    if(country_id && region_id){
        let url = new URL(`${API_BASE}/subregion/getallsubregion`);
        const params = { country_id: parseInt(country_id), region_id: parseInt(region_id) };
        url.search = new URLSearchParams(params);
        
        const requestOptions = {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        };

        const response = await fetch(url, requestOptions);
        const subregions = await handleResponse(response);
        return subregions;
    }
    
}

const getTotalSubRegion = async () => {
    let url = new URL(`${API_BASE}/subregion/gettotalsubregion`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const total_subregions = await handleResponse(response);
    return total_subregions;
}

const getAllCategory = async () => {
    let url = new URL(`${API_BASE}/category/getallcategory`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const categories = await handleResponse(response);
    return categories;
}

const getAllWineColor = async () => {
    let url = new URL(`${API_BASE}/winecolor/getallwinecolor`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const winecolors = await handleResponse(response);
    return winecolors;
}

const getAllBottleSize = async () => {
    let url = new URL(`${API_BASE}/bottle/getallbottlesize`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const bottlesizes = await handleResponse(response);
    return bottlesizes;
}

const getAllGrape = async () => {
    let url = new URL(`${API_BASE}/grape/getallgrape`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const grapes = await handleResponse(response);
    return grapes;
}

const getAllAroma = async () => {
    let url = new URL(`${API_BASE}/aroma/getallaroma`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const aromas = await handleResponse(response);
    return aromas;
}

const getAllFood = async () => {
    let url = new URL(`${API_BASE}/food/getallfood`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const foods = await handleResponse(response);
    return foods;
}

const getAllAllergy = async () => {
    let url = new URL(`${API_BASE}/allergy/getallallergy`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const allergies = await handleResponse(response);
    return allergies;
}

const getAllClosureType = async () => {
    let url = new URL(`${API_BASE}/closure/getallclosuretype`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const closureTypes = await handleResponse(response);
    return closureTypes;
}

const getAllTaste = async () => {
    let url = new URL(`${API_BASE}/taste/getalltaste`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const tastes = await handleResponse(response);
    return tastes;
}

const setCartItemActive = async (data) => {
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    const response = fetch(`${API_BASE}/product/setcartitemactive`, requestOptions);
    return await handleResponse(response);
}

const getAllGlobalProductType = async () => {
    let url = new URL(`${API_BASE}/globalproduct/getallglobalproducttype`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const global_product_types = await handleResponse(response);
    return global_product_types;
}

const getAllCompany = async () => {
    let url = new URL(`${API_BASE}/company/getallcompany`);
    
    const requestOptions = {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(url, requestOptions);
    const companies = await handleResponse(response);
    return companies;
}

export const locationService = {
    getAllCountry,
    getAllRegion,
    getTotalRegion,
    getAllCategory,
    getAllWineColor,
    getAllBottleSize,
    getAllSubRegion,
    getTotalSubRegion,
    getAllGrape,
    getAllAroma,
    getAllFood,
    getAllAllergy,
    getAllClosureType,
    getAllTaste,
    setCartItemActive,
    getAllGlobalProductType,
    getAllCompany,
}