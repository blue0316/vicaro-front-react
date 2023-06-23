import { createSlice } from "@reduxjs/toolkit";
import { authService } from '../services/auth.service'
import { openSnackBar } from "./snackBarReducer";
import jwt_decode from "jwt-decode";

let userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
let userInfo = userToken ? jwt_decode(userToken) : {};

export const authSlice = createSlice({
    name: "authentication",
    initialState: {
        loggingIn: false,
        loggedIn: userToken ? true : false,
        userToken,
        // registering: false,
        forgoting: false,
        userInfo
    },
    reducers: {
        loginRequest: state => {
            state.loggingIn = true
        },
        loginSuccess: (state, action) => {
            state.loggingIn = false;
            state.loggedIn = true;
            state.userToken = action.payload.api_token;
            state.userInfo = jwt_decode(action.payload.api_token);
        },
        loginFailure: state => {
            state.loggingIn = false;
            state.loggedIn = false
        },
        // registerRequest: state => {
        //     state.registering = true;
        // },
        // registerEnd : state => {
        //     state.registering =  false;
        // },
        forgotRequest: state => {
            state.forgoting = false;
        },
        forgotEnd: state => {
            state.forgoting = true;
        },
        logoutRequest: state => {
            localStorage.removeItem('user');
            state.loggedIn = false;
            state.userToken = null;
            state.userInfo = null;
        }
    }
});

const {
    loginRequest, loginSuccess, loginFailure,
    // registerRequest, registering, registerEnd, 
    forgotRequest, forgotEnd, logoutRequest } = authSlice.actions;

export const login = (email, password) => async (dispatch) => {

    dispatch(loginRequest());

    try {
        var payload = await authService.login(email, password);
        dispatch(loginSuccess(payload));
    } catch (error) {
        dispatch(loginFailure());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

// export const registerUser = (user) => async (dispatch) => {
//     dispatch(registerRequest());

//     try {
//         await authService.registerUser(user);
//         dispatch(openSnackBar({message: `We've set an email to ${user.email}. Please check your email to verify and continue`, status: 'success'}));
//         dispatch(registerEnd());
//     } catch (error) {
//         dispatch(registerEnd());
//         dispatch(openSnackBar({message: error["message"], status: 'error'}));
//         throw new Error(error);
//     }
// }

export const forgotPassword = (email) => async (dispatch) => {
    dispatch(forgotRequest());

    try {
        await authService.forgotPassword(email);
        dispatch(openSnackBar({ message: `We've set an email to ${email}. Please check your email to get the password.`, status: 'success' }));
        dispatch(forgotEnd());
    } catch (error) {
        console.log(error)
        dispatch(forgotEnd());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const logout = () => async (dispatch) => {
    dispatch(logoutRequest());

    try {
        await authService.logout();
    } catch (error) {
        console.log(error);
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export default authSlice.reducer;