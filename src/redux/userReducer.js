import { createSlice } from "@reduxjs/toolkit";
import { userService } from '../services/user.service'
import { openSnackBar } from "./snackBarReducer";


export const userSlice = createSlice({
    name: "user",
    initialState: {
        getUserTotalCountState: false,
        count: 0,
        company_count: 0,
        // getUsersByFilterState: false,
        // usersByFilter: {},
        // filter_count: 0,
        registerUserState: false,
        removeUserState: false,
        modifyUserState: false,
        // setUserActiveState: false,
    },
    reducers: {
        getUserTotalCountRequest: state => {
            state.getUserTotalCountState = true
        },
        getUserTotalCountSuccess: (state, action) => {
            state.getUserTotalCountState = false;
            state.company_count = action.payload.company_count;
            state.count = action.payload.count;
        },
        getUserTotalCountFailed: (state, action) => {
            state.getUserTotalCountState = false;
        },
        // setUserActiveRequest: state => {
        //     state.setUserActiveState = true
        // },
        // setUserActiveSuccess: (state, action) => {
        //     state.setUserActiveState = false;
        // },
        // setUserActiveFailed: (state, action) => {
        //     state.setUserActiveState = false;
        // },
        registerUserRequest: state => {
            state.registerUserState = true
        },
        registerUserSuccess: (state, action) => {
            state.registerUserState = false;
        },
        registerUserFailed: (state, action) => {
            state.registerUserState = false;
        },
        modifyUserRequest: state => {
            state.modifyUserState = true
        },
        modifyUserSuccess: (state, action) => {
            state.modifyUserState = false;
        },
        modifyUserFailed: (state, action) => {
            state.modifyUserState = false;
        },
        getUsersByFilterRequest: state => {
            state.getUsersByFilterState = true
        },
        getUsersByFilterSuccess: (state, action) => {
            state.getUsersByFilterState = false;
            state.usersByFilter = action.payload.usersByFilter;
            state.filter_count = action.payload.filter_count;
        },
        getUsersByFilterFailed: (state, action) => {
            state.getUsersByFilterState = false;
        },
        removeUserRequest: state => {
            state.removeUserState = true
        },
        removeUserSuccess: (state, action) => {
            state.removeUserState = false;
        },
        removeUserFailed: (state, action) => {
            state.removeUserState = false;
        },
    }
});

const {
    getUserTotalCountSuccess, getUserTotalCountRequest, getUserTotalCountFailed,
    getUsersByFilterFailed, getUsersByFilterRequest, getUsersByFilterSuccess,
    registerUserFailed, registerUserRequest, registerUserSuccess,
    modifyUserFailed, modifyUserRequest, modifyUserSuccess,
    removeUserFailed, removeUserRequest, removeUserSuccess,
    // setUserActiveFailed, setUserActiveRequest, setUserActiveSuccess,
} = userSlice.actions;

export const getUserTotalCount = (data) => async (dispatch) => {

    dispatch(getUserTotalCountRequest());

    try {
        var payload = await userService.getUserTotalCount(data);
        dispatch(getUserTotalCountSuccess(payload));
    } catch (error) {
        dispatch(getUserTotalCountFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getUsersByFilter = (filter) => async (dispatch) => {

    dispatch(getUsersByFilterRequest());

    try {
        var payload = await userService.getUsersByFilter(filter);
        dispatch(getUsersByFilterSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getUsersByFilterFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        return false;
    }
}

export const removeUser = (id) => async (dispatch) => {

    dispatch(removeUserRequest());

    try {
        var payload = await userService.removeUser(id);
        dispatch(removeUserSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(removeUserFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

// export const setUserActive = (data) => async (dispatch) => {
//     const {id, type} = data

//     dispatch(setUserActiveRequest());

//     try {
//         var payload = await userService.setUserActive(data);
//         dispatch(openSnackBar({message: `Success ${type === true ? "active" : "inactive"} all product in cart !`, status: 'success'}));
//         dispatch(setUserActiveSuccess(payload));
//         return payload;
//     } catch (error) {
//         dispatch(setUserActiveFailed());
//         dispatch(openSnackBar({message: error["message"], status: 'error'}));
//         // throw new Error(error);
//         return false;
//     }
// }

export const registerUser = (userData) => async (dispatch) => {

    dispatch(registerUserRequest());

    try {
        var payload = await userService.registerUser(userData);
        dispatch(registerUserSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(registerUserFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const modifyUser = (id, userData) => async (dispatch) => {

    dispatch(modifyUserRequest());

    try {
        var payload = await userService.modifyUser(id, userData);
        dispatch(modifyUserSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(modifyUserFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export default userSlice.reducer;