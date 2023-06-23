import { createSlice } from "@reduxjs/toolkit";
import { locationService } from '../services/locations.service'
import { openSnackBar } from "./snackBarReducer";

export const locationSlice = createSlice({
    name: "location",
    initialState: {
        insertProductInCartState: false,
        removeProductInCartState: false,
        removeAllProductInCartState: false,
        setCartItemActiveState: false,
        carts: [],
        getAllCountryState: false,
        countries: [],
        getAllRegionState: false,
        regions: [],
        getTotalRegionState: false,
        total_regions: [],
        getAllSubRegionState: false,
        subregions: [],
        getTotalSubRegionState: false,
        total_subregions: [],
        getAllCateogryState: false,
        categories: [],
        getAllWineColorState: false,
        winecolors: [],
        getAllBottleSizeState: false,
        bottlesizes: [],
        getAllGrapeState: false,
        grapes: [],
        getAllAromaState: false,
        aromas: [],
        getAllFoodState: false,
        foods: [],
        getAllAllergyState: false,
        allergies: [],
        getAllClosureTypeState: false,
        closureTypes: [],
        getAllTasteState: false,
        tastes: [],
        getAllGlobalProductTypeState: false,
        global_product_types: [],
        getAllCompany: false,
        companies: [],
    },
    reducers: {
        insertProductInCartRequest: state => {
            state.insertProductInCartState = true
        },
        insertProductInCartSuccess: (state, action) => {
            state.insertProductInCartState = false;
            state.carts = [...state.carts, action.payload];
        },
        insertProductInCartFailed: (state, action) => {
            state.insertProductInCartState = false;
        },
        removeProductInCartRequest: state => {
            state.removeProductInCartState = true
        },
        removeProductInCartSuccess: (state, action) => {
            state.removeProductInCartState = false;
            state.carts.splice(action.payload, 1);
        },
        removeProductInCartFailed: (state, action) => {
            state.removeProductInCartState = false;
        },
        removeAllProductInCartRequest: state => {
            state.removeAllProductInCartState = true
        },
        removeAllProductInCartSuccess: (state, action) => {
            state.removeAllProductInCartState = false;
            state.carts = [];
        },
        removeAllProductInCartFailed: (state, action) => {
            state.removeAllProductInCartState = false;
        },
        setCartItemActiveRequest: state => {
            state.setCartItemActiveState = true
        },
        setCartItemActiveSuccess: (state, action) => {
            state.setCartItemActiveState = false;
            const { type, dozen, list } = action.payload;
            if (dozen === "multi") {
                state.carts.map(data => {
                    data.active = type;
                })
            } else if (dozen === "single") {
                state.carts.map(data => {
                    if (data._id === list[0])
                        data.active = type;
                })
            }

        },
        setCartItemActiveFailed: (state, action) => {
            state.setCartItemActiveState = false;
        },
        getAllCountryRequest: state => {
            state.getAllCountryState = true
        },
        getAllCountrySuccess: (state, action) => {
            state.getAllCountryState = false;
            state.countries = action.payload.countries;
        },
        getAllCountryFailed: (state, action) => {
            state.getAllCountryState = false;
        },
        getAllRegionRequest: state => {
            state.getAllRegionState = true
        },
        getAllRegionSuccess: (state, action) => {
            state.getAllRegionState = false;
            state.regions = action.payload.regions;
        },
        getAllRegionFailed: (state, action) => {
            state.getAllRegionState = false;
        },
        getTotalRegionRequest: state => {
            state.getTotalRegionState = true
        },
        getTotalRegionSuccess: (state, action) => {
            state.getTotalRegionState = false;
            state.total_regions = action.payload.total_regions;
        },
        getTotalRegionFailed: (state, action) => {
            state.getTotalRegionState = false;
        },
        getAllSubRegionRequest: state => {
            state.getAllSubRegionState = true
        },
        getAllSubRegionSuccess: (state, action) => {
            state.getAllSubRegionState = false;
            state.subregions = action.payload.subregions;
        },
        getAllSubRegionFailed: (state, action) => {
            state.getAllSubRegionState = false;
        },
        getTotalSubRegionRequest: state => {
            state.getTotalSubRegionState = true
        },
        getTotalSubRegionSuccess: (state, action) => {
            state.getTotalSubRegionState = false;
            state.total_subregions = action.payload.total_subregions;
        },
        getTotalSubRegionFailed: (state, action) => {
            state.getTotalSubRegionState = false;
        },
        getAllCategoryRequest: state => {
            state.getAllCategoryState = true
        },
        getAllCategorySuccess: (state, action) => {
            state.getAllCategoryState = false;
            state.categories = action.payload.categories;
        },
        getAllCategoryFailed: (state, action) => {
            state.getAllCategoryState = false;
        },
        getAllWineColorRequest: state => {
            state.getAllWineColorState = true
        },
        getAllWineColorSuccess: (state, action) => {
            state.getAllWineColorState = false;
            state.winecolors = action.payload.winecolors;
        },
        getAllWineColorFailed: (state, action) => {
            state.getAllWineColorState = false;
        },
        getAllBottleSizeRequest: state => {
            state.getAllBottleSizeState = true
        },
        getAllBottleSizeSuccess: (state, action) => {
            state.getAllBottleSizeState = false;
            state.bottlesizes = action.payload.bottlesizes;
        },
        getAllBottleSizeFailed: (state, action) => {
            state.getAllBottleSizeState = false;
        },
        getAllGrapeRequest: state => {
            state.getAllGrapeState = true
        },
        getAllGrapeSuccess: (state, action) => {
            state.getAllGrapeState = false;
            state.grapes = action.payload.grapes;
        },
        getAllGrapeFailed: (state, action) => {
            state.getAllGrapeState = false;
        },
        getAllAromaRequest: state => {
            state.getAllAromaState = true
        },
        getAllAromaSuccess: (state, action) => {
            state.getAllAromaState = false;
            state.aromas = action.payload.aromas;
        },
        getAllAromaFailed: (state, action) => {
            state.getAllAromaState = false;
        },
        getAllFoodRequest: state => {
            state.getAllFoodState = true
        },
        getAllFoodSuccess: (state, action) => {
            state.getAllFoodState = false;
            state.foods = action.payload.foods;
        },
        getAllFoodFailed: (state, action) => {
            state.getAllFoodState = false;
        },
        getAllAllergyRequest: state => {
            state.getAllAllergyState = true
        },
        getAllAllergySuccess: (state, action) => {
            state.getAllAllergyState = false;
            state.allergies = action.payload.allergies;
        },
        getAllAllergyFailed: (state, action) => {
            state.getAllAllergyState = false;
        },
        getAllClosureTypeRequest: state => {
            state.getAllClosureTypeState = true
        },
        getAllClosureTypeSuccess: (state, action) => {
            state.getAllClosureTypeState = false;
            state.closureTypes = action.payload.closureTypes;
        },
        getAllClosureTypeFailed: (state, action) => {
            state.getAllClosureTypeState = false;
        },
        getAllTasteRequest: state => {
            state.getAllTasteState = true
        },
        getAllTasteSuccess: (state, action) => {
            state.getAllTasteState = false;
            state.tastes = action.payload.tastes;
        },
        getAllTasteFailed: (state, action) => {
            state.getAllTasteState = false;
        },
        getAllGlobalProductTypeRequest: state => {
            state.getAllGlobalProductTypeState = true
        },
        getAllGlobalProductTypeSuccess: (state, action) => {
            state.getAllGlobalProductTypeState = false;
            state.global_product_types = action.payload.globalProductTypes;
        },
        getAllGlobalProductTypeFailed: (state, action) => {
            state.getAllGlobalProductTypeState = false;
        },
        getAllCompanyRequest: state => {
            state.getAllCompanyState = true
        },
        getAllCompanySuccess: (state, action) => {
            state.getAllCompanyState = false;
            state.companies = action.payload.companies;
        },
        getAllCompanyFailed: (state, action) => {
            state.getAllCompanyState = false;
        },
    }
});

const {
    insertProductInCartFailed, insertProductInCartRequest, insertProductInCartSuccess,
    removeProductInCartFailed, removeProductInCartRequest, removeProductInCartSuccess,
    removeAllProductInCartFailed, removeAllProductInCartRequest, removeAllProductInCartSuccess,
    setCartItemActiveFailed, setCartItemActiveRequest, setCartItemActiveSuccess,
    getAllCountryFailed, getAllCountryRequest, getAllCountrySuccess,
    getAllRegionFailed, getAllRegionRequest, getAllRegionSuccess,
    getTotalRegionFailed, getTotalRegionRequest, getTotalRegionSuccess,
    getTotalSubRegionFailed, getTotalSubRegionRequest, getTotalSubRegionSuccess,
    getAllSubRegionFailed, getAllSubRegionRequest, getAllSubRegionSuccess,
    getAllCategoryFailed, getAllCategoryRequest, getAllCategorySuccess,
    getAllWineColorFailed, getAllWineColorRequest, getAllWineColorSuccess,
    getAllBottleSizeFailed, getAllBottleSizeRequest, getAllBottleSizeSuccess,
    getAllGrapeFailed, getAllGrapeRequest, getAllGrapeSuccess,
    getAllAromaFailed, getAllAromaRequest, getAllAromaSuccess,
    getAllFoodFailed, getAllFoodRequest, getAllFoodSuccess,
    getAllAllergyFailed, getAllAllergyRequest, getAllAllergySuccess,
    getAllClosureTypeFailed, getAllClosureTypeRequest, getAllClosureTypeSuccess,
    getAllTasteFailed, getAllTasteRequest, getAllTasteSuccess,
    getAllGlobalProductTypeFailed, getAllGlobalProductTypeRequest, getAllGlobalProductTypeSuccess,
    getAllCompanyFailed, getAllCompanyRequest, getAllCompanySuccess,
} = locationSlice.actions;

export const insertProductInCart = (data) => async (dispatch) => {

    dispatch(insertProductInCartRequest());

    try {
        // var payload = await locationService.getAllCountry();
        dispatch(insertProductInCartSuccess(data));
        return true;
    } catch (error) {
        dispatch(insertProductInCartFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const removeProductInCart = (pos) => async (dispatch) => {

    dispatch(removeProductInCartRequest());

    try {
        // var payload = await locationService.getAllCountry();
        dispatch(removeProductInCartSuccess(pos));
        return true;
    } catch (error) {
        dispatch(removeProductInCartFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const removeAllProductInCart = (isAlert) => async (dispatch) => {

    dispatch(removeAllProductInCartRequest());

    try {
        // var payload = await locationService.getAllCountry();
        dispatch(removeAllProductInCartSuccess());
        return true;
    } catch (error) {
        dispatch(removeAllProductInCartFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const setCartItemActive = (data) => async (dispatch) => {
    const { list, type, dozen } = data
    dispatch(setCartItemActiveRequest());

    try {
        await locationService.setCartItemActive(data);
        dispatch(setCartItemActiveSuccess({ type, dozen, list }));
        return true;
    } catch (error) {
        dispatch(setCartItemActiveFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const getAllCountry = () => async (dispatch) => {

    dispatch(getAllCountryRequest());

    try {
        var payload = await locationService.getAllCountry();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllCountrySuccess(payload));

    } catch (error) {
        dispatch(getAllCountryFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllRegion = (country_id) => async (dispatch) => {

    dispatch(getAllRegionRequest());

    try {
        if (country_id) {
            var payload = await locationService.getAllRegion(country_id);
            // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
            dispatch(getAllRegionSuccess(payload));
        }

    } catch (error) {
        dispatch(getAllRegionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getTotalRegion = () => async (dispatch) => {

    dispatch(getTotalRegionRequest());

    try {
        var payload = await locationService.getTotalRegion();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getTotalRegionSuccess(payload));
    } catch (error) {
        dispatch(getTotalRegionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllSubRegion = (country_id, region_id) => async (dispatch) => {

    dispatch(getAllSubRegionRequest());

    try {
        if (country_id && region_id) {
            var payload = await locationService.getAllSubRegion(country_id, region_id);
            // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
            dispatch(getAllSubRegionSuccess(payload));
        }

    } catch (error) {
        dispatch(getAllSubRegionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getTotalSubRegion = () => async (dispatch) => {

    dispatch(getTotalSubRegionRequest());

    try {
        var payload = await locationService.getTotalSubRegion();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getTotalSubRegionSuccess(payload));
    } catch (error) {
        dispatch(getTotalSubRegionFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllCategory = () => async (dispatch) => {

    dispatch(getAllCategoryRequest());

    try {
        var payload = await locationService.getAllCategory();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllCategorySuccess(payload));
    } catch (error) {
        dispatch(getAllCategoryFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllWineColor = () => async (dispatch) => {

    dispatch(getAllWineColorRequest());

    try {
        var payload = await locationService.getAllWineColor();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllWineColorSuccess(payload));
    } catch (error) {
        dispatch(getAllWineColorFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllBottleSize = () => async (dispatch) => {

    dispatch(getAllBottleSizeRequest());

    try {
        var payload = await locationService.getAllBottleSize();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllBottleSizeSuccess(payload));
    } catch (error) {
        dispatch(getAllBottleSizeFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllGrape = () => async (dispatch) => {

    dispatch(getAllGrapeRequest());

    try {
        var payload = await locationService.getAllGrape();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllGrapeSuccess(payload));
    } catch (error) {
        dispatch(getAllGrapeFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllAroma = () => async (dispatch) => {

    dispatch(getAllAromaRequest());

    try {
        var payload = await locationService.getAllAroma();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllAromaSuccess(payload));
    } catch (error) {
        dispatch(getAllAromaFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllFood = () => async (dispatch) => {

    dispatch(getAllFoodRequest());

    try {
        var payload = await locationService.getAllFood();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllFoodSuccess(payload));
    } catch (error) {
        dispatch(getAllFoodFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllAllergy = () => async (dispatch) => {

    dispatch(getAllAllergyRequest());

    try {
        var payload = await locationService.getAllAllergy();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllAllergySuccess(payload));
    } catch (error) {
        dispatch(getAllAllergyFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllClosureType = () => async (dispatch) => {

    dispatch(getAllClosureTypeRequest());

    try {
        var payload = await locationService.getAllClosureType();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllClosureTypeSuccess(payload));
    } catch (error) {
        dispatch(getAllClosureTypeFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllTaste = () => async (dispatch) => {

    dispatch(getAllTasteRequest());

    try {
        var payload = await locationService.getAllTaste();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllTasteSuccess(payload));
    } catch (error) {
        dispatch(getAllTasteFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllGlobalProductType = () => async (dispatch) => {

    dispatch(getAllGlobalProductTypeRequest());

    try {
        var payload = await locationService.getAllGlobalProductType();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllGlobalProductTypeSuccess(payload));
    } catch (error) {
        dispatch(getAllGlobalProductTypeFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllCompany = () => async (dispatch) => {

    dispatch(getAllCompanyRequest());

    try {
        var payload = await locationService.getAllCompany();
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllCompanySuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getAllCompanyFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export default locationSlice.reducer;