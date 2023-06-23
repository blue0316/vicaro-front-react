import { combineReducers, configureStore } from "@reduxjs/toolkit";
import globalReducer from './globalReducer';

import authReducer from './authReducer';
import productReducer from './productReducer';
import menuReducer from './menuReducer';
import companyReducer from './companyReducer';
import userReducer from './userReducer';
import producerReducer from './producerReducer';
import locationReducer from './locationReducer';
import snackBarReducer from "./snackBarReducer";
import { composeWithDevTools } from "redux-devtools-extension";

const rootReducer = combineReducers({
    globalState: globalReducer,

    authState: authReducer,
    productState: productReducer,
    menuState: menuReducer,
    companyState: companyReducer,
    userState: userReducer,
    producerState: producerReducer,
    locationState: locationReducer,
    snackBarState: snackBarReducer
})


export default configureStore({
    reducer: rootReducer
}, composeWithDevTools);