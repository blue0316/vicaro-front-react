import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, TextInput } from "flowbite-react"
import { FiPlusSquare } from "react-icons/fi";
import { HiOutlineBackspace, HiOutlineSearch, HiOutlinePlus } from "react-icons/hi";
import { getProductForMenuEdit } from '../../redux/productReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import AddProductItem from "./AddProductItem";
import { useTranslation } from "react-i18next";

function AddProductsModal(props) {
    const { t } = useTranslation();
    const { globalState, productState } = useSelector((state) => state);
    // const { id, company, name } = userInfo;
    const { count, active_count, inactive_count, productsForMenuEdit } = productState;

    const dispatch = useDispatch();
    const type_string = ["active", "inactive", "global"];
    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [search, setSearch] = useState("");   //search bar text 
    const [selectTab, setSelectTab] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        dispatch(getProductForMenuEdit({
            product_name: search, type: type_string[selectTab], company: globalState.menuCondition.company,
            isGlobal: globalState.menuCondition.isGlobal, user_id: globalState.menuCondition.user_id, role: globalState.menuCondition.role
        }));
        // dispatch(getProductForMenuEdit({ product_name: search, type: "active" }));
    }, [search, selectTab])

    var activeStyle = "flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 base active text-blue-600 rounded-t-lg border-b-2 border-sitebg-200 active dark:text-blue-500 dark:border-sitebg-300";
    var inactiveStyle = "flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 base active border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300";

    const changeSearch = (e) => {
        setSearch(e.target.value);
        // dispatch(getProductForMenuEdit({ product_name: search, type: type_string[selectTab] }));
    }

    const addProducts = () => {
        if (selectedProducts?.length > 0) {
            props.addProducts(selectedProducts);
            close();
        } else {
            dispatch(openSnackBar({ message: t("msg_select_product_for_menu"), status: 'error' }));
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
        setSearch("");
        setSelectedProducts([]);
    }

    const selectState = (value) => {
        setSelectTab(value);
        // dispatch(getProductForMenuEdit({ product_name: search, type: type_string[selectTab] }));
    }

    const removeProduct = (pos) => {
        setSelectedProducts(selectedProducts.splice(pos, 1))
    }

    const addProduct = (data) => {
        setSelectedProducts([...selectedProducts, data])
    }

    return (
        <>
            <div>
                <Button onClick={() => setModalShow(true)} outline={true} className="bg-sitebg-200" >
                    <FiPlusSquare className="mr-2 h-6 w-6 text-sitebg-50" />
                    {t("add_product")}
                </Button>
            </div>
            <Modal
                show={modalShow}
                size="4xl"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("add_product")}
                </Modal.Header>
                <hr />
                <Modal.Body className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                    <div className="py-6">
                        <TextInput
                            id="searchmenu"
                            type="search"
                            sizing="lg"
                            placeholder="Search Products"
                            required={true}
                            icon={HiOutlineSearch}
                            value={search}
                            onChange={(e) => changeSearch(e)}
                        />
                    </div>

                    <div aria-label="Tabs with underline" role="tablist" className="col-span-3 flex text-center flex-wrap -mb-px  pl-8">
                        <button
                            onClick={() => selectState(0)}
                            type="button"
                            className={selectTab === 0 ? activeStyle : inactiveStyle}
                        >
                            <div className="flex text-sitebg-50 gap-4">
                                {t("active")}
                                <div className="bg-sitebg-50 text-white px-2 rounded-full">
                                    {active_count}
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => selectState(1)}
                            type="button"
                            className={selectTab === 1 ? activeStyle : inactiveStyle}
                        >
                            <div className="flex text-sitebg-50 gap-4">
                                {t("inactive")}
                                <div className="bg-sitebg-50 text-white px-2 rounded-full">
                                    {inactive_count}
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => selectState(2)}
                            type="button"
                            className={selectTab === 2 ? activeStyle : inactiveStyle}
                        >
                            <div className="flex text-sitebg-50 gap-4">
                                {t("global")}
                                <div className="bg-sitebg-50 text-white px-2 rounded-full">
                                    {count}
                                </div>
                            </div>
                        </button>
                    </div>

                    {productsForMenuEdit?.length > 0 && productsForMenuEdit.map((data, index) =>
                        <AddProductItem key={index} data={data} selectedProducts={selectedProducts} removeProduct={removeProduct} addProduct={addProduct} />
                    )
                    }
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex items-center gap-4 m-auto">
                        <div>
                            <Button onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <HiOutlineBackspace className="mr-2 h-5 w-5" />
                                {t("deselect_all_products")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => addProducts()} className="bg-sitebg-50" >
                                <HiOutlinePlus className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("add_selected_product_to_menu")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddProductsModal;
