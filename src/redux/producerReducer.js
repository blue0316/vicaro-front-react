import { createSlice } from "@reduxjs/toolkit";
import { producerService } from '../services/producers.service'

import { openSnackBar } from "./snackBarReducer";

export const producerSlice = createSlice({
    name: "producer",
    initialState: {
        getAllProducerState: false,
        producers: [],
        getTotalProducerState: false,
        total_producers: [],
        registerProducerState: false,
        newProducer: null,
        // count: 0,
    },
    reducers: {
        getAllProducerRequest: state => {
            state.getAllProducerState = true
        },
        getAllProducerSuccess: (state, action) => {
            state.getAllProducerState = false;
            state.producers = action.payload.producers;
        },
        getAllProducerFailed: (state) => {
            state.getAllProducerState = false;
        },
        getTotalProducerRequest: state => {
            state.getTotalProducerState = true
        },
        getTotalProducerSuccess: (state, action) => {
            state.getTotalProducerState = false;
            state.total_producers = action.payload.total_producers;
        },
        getTotalProducerFailed: (state) => {
            state.getTotalProducerState = false;
        },
        registerProducerRequest: state => {
            state.registerProducerState = true
        },
        registerProducerSuccess: (state, action) => {
            state.registerProducerState = false;
            state.newProducer = action.payload.producer;
            // state.producers = [...state.producers, action.payload.producer];
        },
        registerProducerFailed: (state) => {
            state.registerProducerState = false;
            state.newProducer = null;
        },
    }
});

const {
    getAllProducerRequest, getAllProducerSuccess, getAllProducerFailed,
    getTotalProducerFailed, getTotalProducerRequest, getTotalProducerSuccess,
    registerProducerFailed, registerProducerRequest, registerProducerSuccess
} = producerSlice.actions;

export const registerProducer = (form) => async (dispatch) => {

    dispatch(registerProducerRequest());

    try {
        var payload = await producerService.registerProducer(form);
        dispatch(registerProducerSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(registerProducerFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const getAllProducer = (search) => async (dispatch) => {

    dispatch(getAllProducerRequest());

    try {
        if (search) {
            var payload = await producerService.getAllProducer(search);
            // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
            dispatch(getAllProducerSuccess(payload));
        }

    } catch (error) {
        dispatch(getAllProducerFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getTotalProducer = () => async (dispatch) => {

    dispatch(getTotalProducerRequest());

    try {
        var payload = await producerService.getTotalProducer();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getTotalProducerSuccess(payload));
    } catch (error) {
        dispatch(getTotalProducerFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export default producerSlice.reducer;