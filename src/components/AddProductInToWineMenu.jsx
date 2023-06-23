import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, TextInput } from "flowbite-react"
import { HiOutlineBookOpen, HiOutlineArrowNarrowRight, HiOutlineArrowNarrowLeft, HiOutlineSearch } from "react-icons/hi";
import { removeAllProductInCart } from '../redux/locationReducer';
import { getAllMenu, addProductToMenus, removeAllSelectedMenusOfCart } from '../redux/menuReducer';
// import CartItem from "./Global/CartItem";
import swal from 'sweetalert2';
import { openSnackBar } from '../redux/snackBarReducer';
import MenuItem from "../components/Global/MenuItem"
import NewMenuFromCart from "./Global/NewMenuFromCart";
import { useTranslation } from "react-i18next";

function AddProductInToWineMenu(props) {
    const { t } = useTranslation();
    const { globalState, locationState, menuState } = useSelector((state) => state);

    const { carts } = locationState;
    const { condition } = globalState;
    const { selectedMenusOfCart, menus } = menuState;

    const dispatch = useDispatch();

    useEffect(() => {
        if (condition.company) {
            dispatch(getAllMenu({
                search: "", isGlobal: condition.isGlobal,
                company: condition.company, role: condition.role, user_id: condition.user_id
            }));
        }
    }, [condition])

    const [modalShow, setModalShow] = useState(false);
    const [search, setSearch] = useState("");

    const changeSearch = (e) => {
        setSearch(e.target.value);

        dispatch(getAllMenu({
            search: e.target.value, isGlobal: condition.isGlobal,
            company: condition.company, role: condition.role, user_id: condition.user_id
        }));
    }

    const addProductToSelectedMenus = async () => {
        if (selectedMenusOfCart?.length > 0) {
            let sentProduct = [];
            carts.map(cart => {
                sentProduct = [...sentProduct, { product: cart._id, product_type: cart.product_type._id, category: cart.category, sub_category: cart.sub_category }]
            });

            swal.fire({
                title: t("swal_are_you_sure"),
                text: t("swal_duplicate_product_menu"),
                icon: "warning",
                showDenyButton: true,
                showCancelButton: true,
                denyButtonText: t("swal_no_duplicate"),
                confirmButtonText: t("swal_duplicate")
            })
                .then(async result => {
                    let res;
                    if (result.isConfirmed) {
                        res = await dispatch(addProductToMenus({ menus: selectedMenusOfCart, products: sentProduct, isDuplicate: true }));
                    } else if (result.isDenied) {
                        res = await dispatch(addProductToMenus({ menus: selectedMenusOfCart, products: sentProduct, isDuplicate: false }));
                    }

                    if (res?.status === "success") {
                        dispatch(openSnackBar({ message: t("msg_success_add_product_menu"), status: 'success' }));
                        // navigate('/menuedit');
                        dispatch(removeAllProductInCart("not alert"));
                        dispatch(removeAllSelectedMenusOfCart());

                        setModalShow(false);
                        props.closePrevModal(false);
                    }
                });


        } else {
            dispatch(openSnackBar({ status: "error", message: "There is no selected menu." }));
        }
    }

    const openModal = () => {
        if (carts.length > 0) {
            setModalShow(true)
        } else {
            dispatch(openSnackBar({ status: "error", message: "There is no product in basket." }));
        }
    }

    return (

        <>
            <div className="absolute right-8">
                <Button
                    onClick={() => openModal()}
                >
                    {t("add_to_wine_menu")}
                    <HiOutlineBookOpen className="ml-2 h-5 w-5" />
                </Button>
            </div>
            <Modal
                show={modalShow}
                size="4xl"
                popup={true}
                onClose={() => setModalShow(false)}
            >
                <Modal.Header>
                    {t("add_products_into_wine_menu")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6">
                        <NewMenuFromCart closePrevModal={setModalShow} closeParentModal={props.closePrevModal} />
                        <div className="py-2">
                            <TextInput
                                id="searchproduct"
                                type="search"
                                className="w-full"
                                placeholder="Search your existing Wine Menus"
                                required={true}
                                icon={HiOutlineSearch}
                                value={search}
                                onChange={(e) => changeSearch(e)}
                            />
                        </div>
                        <div className="max-h-96 overflow-auto">
                            {
                                menus?.length > 0 ? menus.map((data, index) =>
                                    <MenuItem key={index} data={data} />
                                ) : t("nodata")
                            }
                        </div>
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex justify-center m-auto gap-4">
                        <Button
                            onClick={() => setModalShow(false)}
                        >
                            <HiOutlineArrowNarrowLeft className="mr-2 h-5 w-5" />
                            {t("back_to_basket")}
                        </Button>
                        <Button
                            onClick={() => addProductToSelectedMenus()}
                            disabled={selectedMenusOfCart.length > 0 ? false : true}
                        >
                            {t("add_to_selected_wine_menus")}
                            <HiOutlineArrowNarrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddProductInToWineMenu;
