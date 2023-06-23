import { createSlice } from "@reduxjs/toolkit";
import { productService } from '../services/products.service'

import { openSnackBar } from "./snackBarReducer";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        getAllProductState: false,
        getProductTotalCountState: false,
        products: [],
        count: 0,
        active_count: 0,
        inactive_count: 0,
        global_count: 0,
        registerProductState: false,
        product: {},
        getProductsByFilterState: false,
        productsByFilter: {},
        filter_count: 0,
        removeProductState: false,
        modifyProductState: false,
        getNextPrevProductState: false,
        getProductForMenuEditState: false,
        productsForMenuEdit: [],
    },
    reducers: {
        getAllProductRequest: state => {
            state.getAllProductState = true
        },
        getAllProductSuccess: (state, action) => {
            state.getAllProductState = false;
            state.products = action.payload.products;
        },
        getAllProductFailed: (state, action) => {
            state.getAllProductState = false;
        },
        getProductTotalCountRequest: state => {
            state.getProductTotalCountState = true
        },
        getProductTotalCountSuccess: (state, action) => {
            state.getProductTotalCountState = false;
            state.count = action.payload.count;
            state.active_count = action.payload.active_count;
            state.inactive_count = action.payload.inactive_count;
        },
        getProductTotalCountFailed: (state, action) => {
            state.getProductTotalCountState = false;
        },
        registerProductRequest: state => {
            state.registerProductState = true
        },
        registerProductSuccess: (state, action) => {
            state.registerProductState = false;
            state.product = action.payload.product;
            state.count += 1;
            if (action.payload.product.active) {
                state.active_count += 1;
            } else {
                state.inactive_count += 1;
            }
        },
        registerProductFailed: (state, action) => {
            state.registerProductState = false;
        },
        getProductsByFilterRequest: state => {
            state.getProductsByFilterState = true
        },
        getProductsByFilterSuccess: (state, action) => {
            state.getProductsByFilterState = false;
            state.productsByFilter = action.payload.productsByFilter;
            state.filter_count = action.payload.filter_count;
        },
        getProductsByFilterFailed: (state, action) => {
            state.getProductsByFilterState = false;
        },
        removeProductRequest: state => {
            state.removeProductState = true
        },
        removeProductSuccess: (state, action) => {
            state.removeProductState = false;
            // state.count -= 1;
            // if(action.payload.active_state === true){
            //     state.active_count -= 1;
            // }else{
            //     state.inactive_count -= 1;
            // }
        },
        removeProductFailed: (state, action) => {
            state.removeProductState = false;
        },
        modifyProductRequest: state => {
            state.removeProductState = true
        },
        modifyProductSuccess: (state, action) => {
            state.modifyProductState = false;
        },
        modifyProductFailed: (state, action) => {
            state.modifyProductState = false;
        },
        getNextPrevProductRequest: state => {
            state.getNextPrevProductState = true
        },
        getNextPrevProductSuccess: (state, action) => {
            state.getNextPrevProductState = false;
        },
        getNextPrevProductFailed: (state, action) => {
            state.getNextPrevProductState = false;
        },
        getProductForMenuEditRequest: state => {
            state.getProductForMenuEditState = true
        },
        getProductForMenuEditSuccess: (state, action) => {
            state.getProductForMenuEditState = false;
            state.productsForMenuEdit = action.payload.products;
            state.count = action.payload.count;
            state.active_count = action.payload.active_count;
            state.inactive_count = action.payload.inactive_count;
        },
        getProductForMenuEditFailed: (state, action) => {
            state.getProductForMenuEditState = false;
        },
    }
});

const { getAllProductRequest, getAllProductSuccess, getAllProductFailed,
    getProductTotalCountSuccess, getProductTotalCountRequest, getProductTotalCountFailed,
    registerProductFailed, registerProductRequest, registerProductSuccess,
    getProductsByFilterFailed, getProductsByFilterRequest, getProductsByFilterSuccess,
    removeProductFailed, removeProductRequest, removeProductSuccess,
    modifyProductFailed, modifyProductRequest, modifyProductSuccess,
    getNextPrevProductFailed, getNextPrevProductRequest, getNextPrevProductSuccess,
    getProductForMenuEditFailed, getProductForMenuEditRequest, getProductForMenuEditSuccess,
} = productSlice.actions;

export const getProductTotalCount = (data) => async (dispatch) => {

    dispatch(getProductTotalCountRequest());

    try {
        var payload = await productService.getProductTotalCount(data);
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getProductTotalCountSuccess(payload));
    } catch (error) {
        dispatch(getProductTotalCountFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllProduct = (data) => async (dispatch) => {

    dispatch(getAllProductRequest());

    try {
        if (data.search) {
            var payload = await productService.getAllProduct(data);
            // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
            dispatch(getAllProductSuccess(payload));
        }
    } catch (error) {
        dispatch(getAllProductFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const registerProduct = (form) => async (dispatch) => {

    dispatch(registerProductRequest());

    try {
        var payload = await productService.registerProduct(form);
        dispatch(registerProductSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(registerProductFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const getProductsByFilter = (filter) => async (dispatch) => {

    dispatch(getProductsByFilterRequest());

    try {
        var payload = await productService.getProductsByFilter(filter);
        // dispatch(openSnackBar({message: t("msg_success_add_product"), status: 'success'}));
        dispatch(getProductsByFilterSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getProductsByFilterFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const getProductForMenuEdit = (filter) => async (dispatch) => {

    dispatch(getProductForMenuEditRequest());

    try {
        var payload = await productService.getProductForMenuEdit(filter);
        // dispatch(openSnackBar({message: t("msg_success_add_product"), status: 'success'}));
        dispatch(getProductForMenuEditSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getProductForMenuEditFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const removeProduct = (data) => async (dispatch) => {

    dispatch(removeProductRequest());

    try {
        var payload = await productService.removeProduct(data);
        dispatch(removeProductSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(removeProductFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const modifyProduct = (id, form) => async (dispatch) => {

    dispatch(modifyProductRequest());

    try {
        var payload = await productService.modifyProduct(id, form);
        dispatch(modifyProductSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(modifyProductFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const getNextPrevProduct = (filter, pos, type) => async (dispatch) => {

    dispatch(getNextPrevProductRequest());

    try {
        var payload = await productService.getNextPrevProduct(filter, pos, type);
        // dispatch(openSnackBar({message: t("msg_success_modify_product"), status: 'success'}));
        dispatch(getNextPrevProductSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getNextPrevProductFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export default productSlice.reducer;