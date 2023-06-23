import { createSlice } from "@reduxjs/toolkit";
import { menuService } from '../services/menu.service';
import { openSnackBar } from "./snackBarReducer";


export const menuSlice = createSlice({
    name: "menu",
    initialState: {
        getAllMenuState: false,
        getMenuTotalCountState: false,
        menus: [],
        count: 0,
        my_count: 0,
        getMenusByFilterState: false,
        menusByFilter: {},
        filter_count: 0,
        registerWineMenuState: false,
        setCurrentWineMenuState: false,
        currentWineMenu: {},
        removeMenuState: false,
        selectMenuOfCartState: false,
        unselectMenuOfCartState: false,
        removeAllSelectedMenusOfCartState: false,
        selectedMenusOfCart: [],
        addProductToMenusState: false,
        addPriceState: false,
        deletePriceState: false,
        deleteProductFromMenuState: false,
        duplicateProductFromMenuState: false,
        saveSortableTreeState: false,
    },
    reducers: {
        getAllMenuRequest: state => {
            state.getAllMenuState = true
        },
        getAllMenuSuccess: (state, action) => {
            state.getAllMenuState = false;
            state.menus = action.payload.menus;
        },
        getAllMenuFailed: (state, action) => {
            state.getAllMenuState = false;
        },
        getMenuTotalCountRequest: state => {
            state.getMenuTotalCountState = true
        },
        getMenuTotalCountSuccess: (state, action) => {
            state.getMenuTotalCountState = false;
            state.count = action.payload.count;
            state.my_count = action.payload.my_count;
        },
        getMenuTotalCountFailed: (state, action) => {
            state.getMenuTotalCountState = false;
        },
        registerWineMenuRequest: state => {
            state.registerWineMenuState = true
        },
        registerWineMenuSuccess: (state, action) => {
            state.registerWineMenuState = false;
            state.currentWineMenu = action.payload.menu;
            state.count += 1;
            state.my_count += 1;
        },
        registerWineMenuFailed: (state, action) => {
            state.registerWineMenuState = false;
        },
        setCurrentWineMenuRequest: state => {
            state.setCurrentWineMenuState = true
        },
        setCurrentWineMenuSuccess: (state, action) => {
            state.setCurrentWineMenuState = false;
            state.currentWineMenu = action.payload;
        },
        setCurrentWineMenuFailed: (state, action) => {
            state.setCurrentWineMenuState = false;
        },
        getMenusByFilterRequest: state => {
            state.getMenusByFilterState = true
        },
        getMenusByFilterSuccess: (state, action) => {
            state.getMenusByFilterState = false;
            state.menusByFilter = action.payload.menusByFilter;
            state.filter_count = action.payload.filter_count;
        },
        getMenusByFilterFailed: (state, action) => {
            state.getMenusByFilterState = false;
        },
        removeMenuRequest: state => {
            state.removeMenuState = true
        },
        removeMenuSuccess: (state, action) => {
            state.removeMenuState = false;
            state.count -= 1;
            state.my_count -= 1;
        },
        removeMenuFailed: (state, action) => {
            state.removeMenuState = false;
        },
        duplicateMenuRequest: state => {
            state.duplicateMenuState = true
        },
        duplicateMenuSuccess: (state, action) => {
            state.duplicateMenuState = false;
            state.currentWineMenu = action.payload.menu;
            state.count += 1;
            state.my_count += 1;
        },
        duplicateMenuFailed: (state, action) => {
            state.duplicateMenuState = false;
        },
        selectMenuOfCartRequest: state => {
            state.selectMenuOfCartState = true
        },
        selectMenuOfCartSuccess: (state, action) => {
            state.selectMenuOfCartState = false;
            let flag = false;

            state.selectedMenusOfCart.length > 0 && state.selectedMenusOfCart.map(data => {
                if (data === action.payload) {
                    flag = true;
                }
            })
            if (!flag) {
                state.selectedMenusOfCart = [...state.selectedMenusOfCart, action.payload];
            }
        },
        selectMenuOfCartFailed: (state, action) => {
            state.selectMenuOfCartState = false;
        },
        unselectMenuOfCartRequest: state => {
            state.unselectMenuOfCartState = true
        },
        unselectMenuOfCartSuccess: (state, action) => {
            state.unselectMenuOfCartState = false;
            let flag = -1;

            state.selectedMenusOfCart.length > 0 && state.selectedMenusOfCart.map((data, index) => {
                if (data === action.payload) {
                    flag = index;
                }
            })
            if (flag !== -1) {
                state.selectedMenusOfCart.splice(flag, 1);
            }
        },
        unselectMenuOfCartFailed: (state, action) => {
            state.unselectMenuOfCartState = false;
        },
        removeAllSelectedMenusOfCartRequest: state => {
            state.removeAllSelectedMenusOfCartState = true
        },
        removeAllSelectedMenusOfCartSuccess: (state, action) => {
            state.removeAllSelectedMenusOfCartState = false;
            state.selectedMenusOfCart = [];
        },
        removeAllSelectedMenusOfCartFailed: (state, action) => {
            state.removeAllSelectedMenusOfCartState = false;
        },
        addProductToMenusRequest: state => {
            state.addProductToMenusState = true
        },
        addProductToMenusSuccess: (state, action) => {
            state.addProductToMenusState = false;
        },
        addProductToMenusFailed: (state, action) => {
            state.addProductToMenusState = false;
        },
        addPriceRequest: state => {
            state.addPriceState = true
        },
        addPriceSuccess: (state, action) => {
            state.addPriceState = false;
            state.currentWineMenu.products.map(product => {
                if (product._id === action.payload.product_id) {
                    product.price = [...product.price, { bottle_size: action.payload.priceData.bottle_size.value, price: action.payload.priceData.price, price_unit: "€" }]
                }
            })
        },
        addPriceFailed: (state, action) => {
            state.addPriceState = false;
        },
        deletePriceRequest: state => {
            state.deletePriceState = true
        },
        deletePriceSuccess: (state, action) => {
            state.deletePriceState = false;
            state.currentWineMenu.products.map(product => {
                if (product._id === action.payload.product_id) {
                    product.price.splice(action.payload.price_index, 1);
                }
            })
        },
        deletePriceFailed: (state, action) => {
            state.deletePriceState = false;
        },
        deleteProductFromMenuRequest: state => {
            state.deleteProductFromMenuState = true
        },
        deleteProductFromMenuSuccess: (state, action) => {
            state.deleteProductFromMenuState = false;
            let pos = -1;
            state.currentWineMenu.products.map((product, index) => {
                if (product._id === action.payload.product_id) {
                    pos = index;
                }
            })
            if (pos !== -1) {
                state.currentWineMenu.products.splice(pos, 1);
            }
        },
        deleteProductFromMenuFailed: (state, action) => {
            state.deleteProductFromMenuState = false;
        },
        duplicateProductFromMenuRequest: state => {
            state.duplicateProductFromMenuState = true
        },
        duplicateProductFromMenuSuccess: (state, action) => {
            state.duplicateProductFromMenuState = false;
            state.currentWineMenu.products.map(product => {
                if (product._id === action.payload.product_id) {
                    state.currentWineMenu.products = [...state.currentWineMenu.products, product];
                }
            })
        },
        duplicateProductFromMenuFailed: (state, action) => {
            state.duplicateProductFromMenuState = false;
        },
        saveSortableTreeRequest: state => {
            state.saveSortableTreeState = true
        },
        saveSortableTreeSuccess: (state, action) => {
            state.saveSortableTreeState = false;
        },
        saveSortableTreeFailed: (state, action) => {
            state.saveSortableTreeState = false;
        },
    }
});

const {
    getAllMenuRequest, getAllMenuSuccess, getAllMenuFailed,
    getMenuTotalCountSuccess, getMenuTotalCountRequest, getMenuTotalCountFailed,
    getMenusByFilterFailed, getMenusByFilterRequest, getMenusByFilterSuccess,
    registerWineMenuFailed, registerWineMenuRequest, registerWineMenuSuccess,
    setCurrentWineMenuFailed, setCurrentWineMenuRequest, setCurrentWineMenuSuccess,
    removeMenuFailed, removeMenuRequest, removeMenuSuccess,
    duplicateMenuFailed, duplicateMenuRequest, duplicateMenuSuccess,
    selectMenuOfCartFailed, selectMenuOfCartRequest, selectMenuOfCartSuccess,
    unselectMenuOfCartFailed, unselectMenuOfCartRequest, unselectMenuOfCartSuccess,
    removeAllSelectedMenusOfCartFailed, removeAllSelectedMenusOfCartRequest, removeAllSelectedMenusOfCartSuccess,
    addProductToMenusFailed, addProductToMenusRequest, addProductToMenusSuccess,
    addPriceFailed, addPriceRequest, addPriceSuccess,
    deletePriceFailed, deletePriceRequest, deletePriceSuccess,
    deleteProductFromMenuFailed, deleteProductFromMenuRequest, deleteProductFromMenuSuccess,
    duplicateProductFromMenuFailed, duplicateProductFromMenuRequest, duplicateProductFromMenuSuccess,
    saveSortableTreeFailed, saveSortableTreeRequest, saveSortableTreeSuccess,
} = menuSlice.actions;

export const getMenuTotalCount = (data) => async (dispatch) => {

    dispatch(getMenuTotalCountRequest());

    try {
        var payload = await menuService.getMenuTotalCount(data);
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getMenuTotalCountSuccess(payload));
    } catch (error) {
        dispatch(getMenuTotalCountFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getAllMenu = (filter) => async (dispatch) => {

    dispatch(getAllMenuRequest());

    try {
        // if(filter?.search){
        var payload = await menuService.getAllMenu(filter);
        // dispatch(openSnackBar({message: t("msg_success"), status: 'success'}));
        dispatch(getAllMenuSuccess(payload));
        // }
    } catch (error) {
        dispatch(getAllMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        throw new Error(error);
    }
}

export const getMenusByFilter = (filter) => async (dispatch) => {

    dispatch(getMenusByFilterRequest());

    try {
        var payload = await menuService.getMenusByFilter(filter);
        // dispatch(openSnackBar({message: "Success add Menu!", status: 'success'}));
        dispatch(getMenusByFilterSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(getMenusByFilterFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const removeMenu = (id) => async (dispatch) => {

    dispatch(removeMenuRequest());

    try {
        var payload = await menuService.removeMenu(id);
        dispatch(removeMenuSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(removeMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const duplicateMenu = (data) => async (dispatch) => {

    dispatch(duplicateMenuRequest());

    try {
        var payload = await menuService.duplicateMenu(data);
        dispatch(duplicateMenuSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(duplicateMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const registerWineMenu = (menuData) => async (dispatch) => {

    dispatch(registerWineMenuRequest());

    try {
        var payload = await menuService.registerWineMenu(menuData);
        dispatch(registerWineMenuSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(registerWineMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const setCurrentWineMenu = (menuData) => async (dispatch) => {

    dispatch(setCurrentWineMenuRequest());

    try {
        // var payload = await menuService.setCurrentWineMenu(menuData); 
        // dispatch(openSnackBar({message: t("msg_success_create_menu"), status: 'success'}));
        dispatch(setCurrentWineMenuSuccess(menuData));
        // return menuData;
    } catch (error) {
        dispatch(setCurrentWineMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const selectMenuOfCart = (menu_id) => async (dispatch) => {

    dispatch(selectMenuOfCartRequest());

    try {
        // var payload = await menuService.setCurrentWineMenu(menuData); 
        // dispatch(openSnackBar({message: t("msg_success_create_menu"), status: 'success'}));
        dispatch(selectMenuOfCartSuccess(menu_id));
        // return menuData;
    } catch (error) {
        dispatch(selectMenuOfCartFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const unselectMenuOfCart = (menu_id) => async (dispatch) => {

    dispatch(unselectMenuOfCartRequest());

    try {
        // var payload = await menuService.setCurrentWineMenu(menuData); 
        // dispatch(openSnackBar({message: t("msg_success_create_menu"), status: 'success'}));
        dispatch(unselectMenuOfCartSuccess(menu_id));
        // return menuData;
    } catch (error) {
        dispatch(unselectMenuOfCartFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const removeAllSelectedMenusOfCart = () => async (dispatch) => {

    dispatch(removeAllSelectedMenusOfCartRequest());

    try {
        // var payload = await menuService.setCurrentWineMenu(menuData); 
        // dispatch(openSnackBar({message: t("msg_success_create_menu"), status: 'success'}));
        dispatch(removeAllSelectedMenusOfCartSuccess());
        // return menuData;
    } catch (error) {
        dispatch(removeAllSelectedMenusOfCartFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const addProductToMenus = (data) => async (dispatch) => {

    dispatch(addProductToMenusRequest());

    try {
        var payload = await menuService.addProductToMenus(data);
        dispatch(addProductToMenusSuccess(payload));
        return payload;
    } catch (error) {
        dispatch(addProductToMenusFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const addPrice = (data) => async (dispatch) => {

    dispatch(addPriceRequest());

    try {
        await menuService.addPrice(data);
        dispatch(addPriceSuccess(data));
        return true;
    } catch (error) {
        dispatch(addPriceFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const deletePrice = (data) => async (dispatch) => {

    dispatch(deletePriceRequest());

    try {
        await menuService.deletePrice(data);
        dispatch(deletePriceSuccess(data));
        return true;
    } catch (error) {
        dispatch(deletePriceFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const deleteProductFromMenu = (data) => async (dispatch) => {

    dispatch(deleteProductFromMenuRequest());

    try {
        var payload = await menuService.deleteProductFromMenu(data);
        dispatch(deleteProductFromMenuSuccess(data));
        return payload;
    } catch (error) {
        dispatch(deleteProductFromMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const duplicateProductFromMenu = (data) => async (dispatch) => {

    dispatch(duplicateProductFromMenuRequest());

    try {
        var payload = await menuService.duplicateProductFromMenu(data);
        dispatch(duplicateProductFromMenuSuccess(data));
        return payload;
    } catch (error) {
        dispatch(duplicateProductFromMenuFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export const saveSortableTree = (data) => async (dispatch) => {

    dispatch(saveSortableTreeRequest());

    try {
        var payload = await menuService.saveSortableTree(data);
        dispatch(saveSortableTreeSuccess(data));
        return payload;
    } catch (error) {
        dispatch(saveSortableTreeFailed());
        dispatch(openSnackBar({ message: error["message"], status: 'error' }));
        // throw new Error(error);
        return false;
    }
}

export default menuSlice.reducer;