import { createSlice } from "@reduxjs/toolkit";
import { openSnackBar } from "./snackBarReducer";


export const globalSlice = createSlice({
    name: "global",
    initialState: {
        loggingIn: false,
        registering: false,
        forgoting: false,
        language: "de",
        setLanguageState: false,
        condition: {
            filterArray: [],
            showCount: 10,
            sortby: "Categorys",
            currentPage: 0,
            activeState: "active",
            isGlobal: "",
            company: "",
            role: "",
            user_id: ""
        },
        menuCondition: {
            filterArray: [],
            showCount: 10,
            sortby: "Date Created",
            currentPage: 0,
            activeState: "my",
            isGlobal: "",
            company: "",
            role: "",
            user_id: ""
        },
        companyCondition: {
            filterArray: [],
            showCount: 10,
            sortby: "Date Created",
            currentPage: 0,
            activeState: "active",
            isGlobal: "",
            company: "",
            role: "",
            user_id: ""
        },
        userCondition: {
            filterArray: [],
            showCount: 10,
            sortby: "Date Created",
            currentPage: 0,
            activeState: "company",
            isGlobal: "",
            company: "",
            role: "",
            user_id: ""
        },
        setProductSearchConditionState: false,
        setMenuSearchConditionState: false,
        setCompanySearchConditionState: false,
        setUserSearchConditionState: false,

        setCompanyAndGlobalState: false,
        setMenuCompanyAndGlobalState: false,
        setUserCompanyAndGlobalState: false,
        setSelectedCompanyState: false,
        selectedCompany: "",

        noSavedEditedWineMenuPage: true,    //for leave wine edit menu page without save
        setNoSavedEditedWineMenuPageState: false,   //for leave wine edit menu page without save
    },
    reducers: {
        setLanguageRequest: state => {
            state.setLanguageState = true
        },
        setLanguageSuccess: (state, action) => {
            state.setLanguageState = false;
            state.language = action.payload;
        },
        setLanguageFailed: (state, action) => {
            state.setLanguageState = false;
        },
        setProductSearchConditionRequest: state => {
            state.setProductSearchConditionState = true
        },
        setProductSearchConditionSuccess: (state, action) => {
            state.setProductSearchConditionState = false;
            state.condition = action.payload;
        },
        setProductSearchConditionFailed: (state, action) => {
            state.setProductSearchConditionState = false;
        },
        setMenuSearchConditionRequest: state => {
            state.setMenuSearchConditionState = true
        },
        setMenuSearchConditionSuccess: (state, action) => {
            state.setMenuSearchConditionState = false;
            state.menuCondition = action.payload;
        },
        setMenuSearchConditionFailed: (state, action) => {
            state.setMenuSearchConditionState = false;
        },
        setCompanySearchConditionRequest: state => {
            state.setCompanySearchConditionState = true
        },
        setCompanySearchConditionSuccess: (state, action) => {
            state.setCompanySearchConditionState = false;
            state.companyCondition = action.payload;
        },
        setCompanySearchConditionFailed: (state, action) => {
            state.setCompanySearchConditionState = false;
        },
        setUserSearchConditionRequest: state => {
            state.setUserSearchConditionState = true
        },
        setUserSearchConditionSuccess: (state, action) => {
            state.setUserSearchConditionState = false;
            state.userCondition = action.payload;
        },
        setUserSearchConditionFailed: (state, action) => {
            state.setUserSearchConditionState = false;
        },
        setCompanyAndGlobalRequest: state => {
            state.setCompanyAndGlobalState = true
        },
        setCompanyAndGlobalSuccess: (state, action) => {
            state.setCompanyAndGlobalState = false;
            state.condition.company = action.payload.company;
            state.condition.isGlobal = action.payload.isGlobal ? "global" : "company";
            state.condition.currentPage = 0;
            state.selectedCompany = action.payload.position;
        },
        setCompanyAndGlobalFailed: (state, action) => {
            state.setCompanyAndGlobalState = false;
        },
        setMenuCompanyAndGlobalRequest: state => {
            state.setMenuCompanyAndGlobalState = true
        },
        setMenuCompanyAndGlobalSuccess: (state, action) => {
            state.setMenuCompanyAndGlobalState = false;
            state.menuCondition.company = action.payload.company;
            state.menuCondition.isGlobal = action.payload.isGlobal ? "global" : "company";
            state.menuCondition.currentPage = 0;
            state.selectedCompany = action.payload.position;
        },
        setMenuCompanyAndGlobalFailed: (state, action) => {
            state.setMenuCompanyAndGlobalState = false;
        },
        setUserCompanyAndGlobalRequest: state => {
            state.setUserCompanyAndGlobalState = true
        },
        setUserCompanyAndGlobalSuccess: (state, action) => {
            state.setUserCompanyAndGlobalState = false;
            state.userCondition.company = action.payload.company;
            state.userCondition.isGlobal = action.payload.isGlobal ? "global" : "company";
            state.userCondition.currentPage = 0;
            state.selectedCompany = action.payload.position;
        },
        setUserCompanyAndGlobalFailed: (state, action) => {
            state.setUserCompanyAndGlobalState = false;
        },
        setSelectedCompanyRequest: state => {
            state.setSelectedCompanyState = true
        },
        setSelectedCompanySuccess: (state, action) => {
            state.setSelectedCompanyState = false;
            state.selectedCompany = action.payload;
        },
        setSelectedCompanyFailed: (state, action) => {
            state.setSelectedCompanyState = false;
        },

        //for leave wine menu edit page without save
        setNoSavedEditedWineMenuPageRequest: state => {
            state.setNoSavedEditedWineMenuPageState = true
        },
        setNoSavedEditedWineMenuPageSuccess: (state, action) => {
            state.setNoSavedEditedWineMenuPageState = false;
            state.noSavedEditedWineMenuPage = action.payload;
        },
        setNoSavedEditedWineMenuPageFailed: (state, action) => {
            state.setNoSavedEditedWineMenuPageState = false;
        },
    }
});

const {
    setLanguageFailed, setLanguageRequest, setLanguageSuccess,
    setProductSearchConditionFailed, setProductSearchConditionRequest, setProductSearchConditionSuccess,
    setCompanyAndGlobalFailed, setCompanyAndGlobalRequest, setCompanyAndGlobalSuccess,
    setCompanySearchConditionFailed, setCompanySearchConditionRequest, setCompanySearchConditionSuccess,
    setUserSearchConditionFailed, setUserSearchConditionRequest, setUserSearchConditionSuccess,
    setSelectedCompanyFailed, setSelectedCompanyRequest, setSelectedCompanySuccess,
    setMenuSearchConditionFailed, setMenuSearchConditionRequest, setMenuSearchConditionSuccess,
    setMenuCompanyAndGlobalRequest, setMenuCompanyAndGlobalSuccess, setMenuCompanyAndGlobalFailed,
    setUserCompanyAndGlobalFailed, setUserCompanyAndGlobalRequest, setUserCompanyAndGlobalSuccess,
    setNoSavedEditedWineMenuPageFailed, setNoSavedEditedWineMenuPageRequest, setNoSavedEditedWineMenuPageSuccess,
} = globalSlice.actions;

export const setCurrentLanguage = (lang) => async (dispatch) => {

    dispatch(setLanguageRequest());

    try {
        dispatch(setLanguageSuccess(lang));
    } catch (error) {
        dispatch(setLanguageFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setProductSearchCondition = (condition) => async (dispatch) => {

    dispatch(setProductSearchConditionRequest());

    try {
        // var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success_remove_product_cart"), status: 'success'}));
        dispatch(setProductSearchConditionSuccess(condition));

    } catch (error) {
        dispatch(setProductSearchConditionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setMenuSearchCondition = (condition) => async (dispatch) => {

    dispatch(setMenuSearchConditionRequest());

    try {
        // var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success_remove_product_cart"), status: 'success'}));
        dispatch(setMenuSearchConditionSuccess(condition));

    } catch (error) {
        dispatch(setMenuSearchConditionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setCompanySearchCondition = (condition) => async (dispatch) => {

    dispatch(setCompanySearchConditionRequest());

    try {
        dispatch(setCompanySearchConditionSuccess(condition));
    } catch (error) {
        dispatch(setCompanySearchConditionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setUserSearchCondition = (condition) => async (dispatch) => {

    dispatch(setUserSearchConditionRequest());

    try {
        dispatch(setUserSearchConditionSuccess(condition));
    } catch (error) {
        dispatch(setUserSearchConditionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setCompanyAndGlobal = (data) => async (dispatch) => {

    dispatch(setCompanyAndGlobalRequest());

    try {
        // var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success_remove_product_cart"), status: 'success'}));
        dispatch(setCompanyAndGlobalSuccess(data));

    } catch (error) {
        dispatch(setCompanyAndGlobalFailed());
        // dispatch(openSnackBar({message: error["message"], status: 'error'}));
        throw new Error(error);
    }
}

export const setMenuCompanyAndGlobal = (data) => async (dispatch) => {

    dispatch(setMenuCompanyAndGlobalRequest());

    try {
        // var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success_remove_product_cart"), status: 'success'}));
        dispatch(setMenuCompanyAndGlobalSuccess(data));

    } catch (error) {
        dispatch(setMenuCompanyAndGlobalFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setUserCompanyAndGlobal = (data) => async (dispatch) => {

    dispatch(setUserCompanyAndGlobalRequest());

    try {
        // var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success_remove_product_cart"), status: 'success'}));
        dispatch(setUserCompanyAndGlobalSuccess(data));

    } catch (error) {
        dispatch(setUserCompanyAndGlobalFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setSelectedCompany = (data) => async (dispatch) => {

    dispatch(setSelectedCompanyRequest());

    try {
        // var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success_remove_product_cart"), status: 'success'}));
        dispatch(setSelectedCompanySuccess(data));

    } catch (error) {
        dispatch(setSelectedCompanyFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const setNoSavedEditedWineMenuPage = (type) => async (dispatch) => {
    dispatch(setNoSavedEditedWineMenuPageRequest());

    try {
        dispatch(setNoSavedEditedWineMenuPageSuccess(type));
    } catch (error) {
        dispatch(setNoSavedEditedWineMenuPageFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export default globalSlice.reducer;