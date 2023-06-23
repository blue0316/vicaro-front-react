import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, TextInput } from "flowbite-react"
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaRegTimesCircle } from 'react-icons/fa';
import { FiPlusSquare } from "react-icons/fi";
import { registerWineMenu, setCurrentWineMenu, removeAllSelectedMenusOfCart } from '../../redux/menuReducer';
import { removeAllProductInCart } from '../../redux/locationReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import { createWineMenuSearchText } from '../../utils'
import { useTranslation } from "react-i18next";

function NewMenuFromCart(props) {
    const { t } = useTranslation();
    const { authState, globalState, locationState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { carts } = locationState;
    const { condition } = globalState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
    }, [])


    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [search, setSearch] = useState("");   //search bar text 

    const changeSearch = (e) => {
        setSearch(e.target.value);
    }

    const createWineMenu = async () => {
        if (search) {
            const formData = new FormData();
            const { name } = userInfo;

            let search_field = createWineMenuSearchText({ menu_name: search, user_name: name, created_at: new Date().toLocaleString() });
            let sentProduct = [];
            carts.map(cart => {
                sentProduct = [...sentProduct, { product: cart._id, product_type: cart.product_type._id, category: cart.category, sub_category: cart.sub_category }]
            });

            formData.append("user_id", condition.user_id);
            formData.append("company", condition.company);
            formData.append("isGlobal", condition.isGlobal);
            formData.append("role", condition.role);
            formData.append("menu_name", search);
            formData.append("search_field", search_field);
            formData.append("products", JSON.stringify(sentProduct));

            const res = await dispatch(registerWineMenu(formData))
            if (res !== false) {
                dispatch(openSnackBar({ message: t("msg_success_create_menu"), status: 'success' }));

                setSearch("");
                dispatch(removeAllProductInCart("not alert"));
                dispatch(setCurrentWineMenu(res.menu));
                dispatch(removeAllSelectedMenusOfCart());

                navigate('/menuedit');
                setModalShow(false);
                props.closePrevModal(false);
                props.closeParentModal(false);
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_menu_exist") }));
            }
        } else {
            dispatch(openSnackBar({ message: t("msg_fill_menu"), status: 'error' }));
        }
    }

    const closeModal = () => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_leave_page"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_leave")
        })
            .then(result => {
                if (result.isConfirmed) {
                    close();
                }
            });

    }

    function close() {
        setModalShow(false);
    }

    return (
        <>
            <div className="py-2">
                <Button color={'red'}
                    className="w-full"
                    onClick={() => setModalShow(true)}
                >
                    <FiPlusSquare className="mr-2 h-5 w-5" />
                    {t("create_new_wine_menu")}
                </Button>
            </div>
            <Modal
                show={modalShow}
                size="md"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("create_new_wine_menu")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6">
                        <div className="m-2 ml-2 text-sm block">
                            {t("wine_menu_name")}<span className='text-red-700'>*</span>
                        </div>
                        <TextInput
                            id="searchmenu"
                            type="search"
                            sizing="lg"
                            // placeholder="Wine Menu Name"
                            required={true}
                            // icon={HiOutlineSearch}
                            value={search}
                            onChange={(e) => changeSearch(e)}
                        />
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button color={'red'} onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <Button color={'red'} onClick={() => createWineMenu()} outline={true} className="bg-sitebg-50" >
                                <HiOutlineBookOpen className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("create_new_wine_menu")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default NewMenuFromCart;
