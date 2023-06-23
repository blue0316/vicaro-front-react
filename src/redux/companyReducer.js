import { createSlice } from "@reduxjs/toolkit";
import { companyService } from '../services/company.service'
import { openSnackBar } from "./snackBarReducer";

export const companySlice = createSlice({
    name: "company",
    initialState: {
        getCompanyTotalCountState: false,
        count: 0,
        active_count: 0,
        inactive_count: 0,
        getCompaniesByFilterState: false,
        companiesByFilter: {},
        filter_count: 0,
        registerCompanyState: false,
        removeCompanyState: false,
        modifyCompanyState: false,
        setCompanyActiveState: false,
    },
    reducers: {
        getCompanyTotalCountRequest: state => {
            state.getCompanyTotalCountState = true
        },
        getCompanyTotalCountSuccess: (state, action) => {
            state.getCompanyTotalCountState = false;
            state.active_count = action.payload.active_count;
            state.inactive_count = action.payload.inactive_count;
            state.count = action.payload.count;
        },
        getCompanyTotalCountFailed: (state, action) => {
            state.getCompanyTotalCountState = false;
        },
        setCompanyActiveRequest: state => {
            state.setCompanyActiveState = true
        },
        setCompanyActiveSuccess: (state, action) => {
            state.setCompanyActiveState = false;
        },
        setCompanyActiveFailed: (state, action) => {
            state.setCompanyActiveState = false;
        },
        registerCompanyRequest: state => {
            state.registerCompanyState = true
        },
        registerCompanySuccess: (state, action) => {
            state.registerCompanyState = false;
            state.count += 1;
            state.active_count += 1;
        },
        registerCompanyFailed: (state, action) => {
            state.registerCompanyState = false;
        },
        modifyCompanyRequest: state => {
            state.modifyCompanyState = true
        },
        modifyCompanySuccess: (state, action) => {
            state.modifyCompanyState = false;
        },
        modifyCompanyFailed: (state, action) => {
            state.modifyCompanyState = false;
        },
        getCompaniesByFilterRequest: state => {
            state.getCompaniesByFilterState = true
        },
        getCompaniesByFilterSuccess: (state, action) => {
            state.getCompaniesByFilterState = false;
            state.companiesByFilter = action.payload.companiesByFilter;
            state.filter_count = action.payload.filter_count;
        },
        getCompaniesByFilterFailed: (state, action) => {
            state.getCompaniesByFilterState = false;
        },
        removeCompanyRequest: state => {
            state.removeCompanyState = true
        },
        removeCompanySuccess: (state, action) => {
            state.removeCompanyState = false;
            state.active_count -= 1;
            state.inactive_count -= 1;
            state.count -= 1;
        },
        removeCompanyFailed: (state, action) => {
            state.removeCompanyState = false;
        },
    }
});

const {
    getCompanyTotalCountSuccess, getCompanyTotalCountRequest, getCompanyTotalCountFailed,
    getCompaniesByFilterFailed, getCompaniesByFilterRequest, getCompaniesByFilterSuccess,
    registerCompanyFailed, registerCompanyRequest, registerCompanySuccess,
    modifyCompanyFailed, modifyCompanyRequest, modifyCompanySuccess,
    removeCompanyFailed, removeCompanyRequest, removeCompanySuccess,
    setCompanyActiveFailed, setCompanyActiveRequest, setCompanyActiveSuccess,
} = companySlice.actions;

export const getCompanyTotalCount = (data) => async (dispatch) => {

    dispatch(getCompanyTotalCountRequest());

    try {
        var payload = await companyService.getCompanyTotalCount(data);
        dispatch(getCompanyTotalCountSuccess(payload));
    } catch (error) {
        dispatch(getCompanyTotalCountFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getCompaniesByFilter = (filter) => async (dispatch) => {

    dispatch(getCompaniesByFilterRequest());

    try {
        var payload = await companyService.getCompaniesByFilter(filter);
        dispatch(getCompaniesByFilterSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getCompaniesByFilterFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        return false;
    }
}

export const removeCompany = (id) => async (dispatch) => {


    dispatch(removeCompanyRequest());

    try {
        var payload = await companyService.removeCompany(id);
        dispatch(removeCompanySuccess(payload));
        return payload;
    } catch (error) {
        dispatch(removeCompanyFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const setCompanyActive = (data) => async (dispatch) => {

    dispatch(setCompanyActiveRequest());

    try {
        var payload = await companyService.setCompanyActive(data);
        dispatch(setCompanyActiveSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(setCompanyActiveFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const registerCompany = (companyData) => async (dispatch) => {


    dispatch(registerCompanyRequest());

    try {
        var payload = await companyService.registerCompany(companyData);
        dispatch(registerCompanySuccess(payload));
        return payload;
    } catch (error) {
        dispatch(registerCompanyFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const modifyCompany = (id, companyData) => async (dispatch) => {


    dispatch(modifyCompanyRequest());

    try {
        var payload = await companyService.modifyCompany(id, companyData);
        dispatch(modifyCompanySuccess(payload));
        return payload;
    } catch (error) {
        dispatch(modifyCompanyFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export default companySlice.reducer;