import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { Button, Modal, Tooltip } from "flowbite-react"
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { FaQuestionCircle } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import styled from 'styled-components';
import Select from 'react-tailwindcss-select';
import SortItem from './SortItem';
import { useTranslation } from "react-i18next";

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
    height: 42px;
    width: 200px;
}
`

function SortModal(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [mainAttr, setMainAttr] = useState();
    const [mainOrder, setMainOrder] = useState();
    const [mainCheck, setMainCheck] = useState(false);
    const [mainCheckVisible, setMainCheckVisible] = useState(true);
    const [main_order_options, setMainOrderOptions] = useState([]);
    const [otherAttr, setOtherAttr] = useState();
    const [otherOrder, setOtherOrder] = useState();
    const [otherCheck, setOtherCheck] = useState(false);
    const [otherCheckVisible, setOtherCheckVisible] = useState(true);
    const [other_order_options, setOtherOrderOptions] = useState([]);
    const [sort_array, setSortArray] = useState([]);

    var sortType = ["Product-Category", "Product-Sub-Category", "Country", "Region", "Sub-Region", "Producer", "Product-Name", "Grape Variaty"];
    var orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "Classic"]

    useEffect(() => {
        let order = [];
        orderType && orderType.map((data, index) => {
            order[index] = { value: index, label: data }
        });
        setMainOrderOptions(order);
        // setOtherOrderOptions(order);
    }, [])

    var sort_options = [];

    sortType && sortType.map((data, index) => {
        sort_options[index] = { value: index, label: data }
    });

    //////////////main sort info/////////////////////////////////
    const selectMainAttr = (value) => {
        let flag = false;
        sort_array.map(data => {
            if (data.attr.value === value.value)
                flag = true
        })
        if (mainAttr?.value === value.value) {
            flag = true;
        }

        if (!flag) {
            setMainAttr(value);

            if (value.value === 6) {   //if product name dont show the group check
                setMainCheckVisible(false);
                setMainCheck(false);

                if (sort_array.length > 0) {
                    sort_array.map((sort, index) => {
                        sort_array[index].is_group = false;
                    })
                    setSortArray([...sort_array]);
                }
            } else {
                setMainCheckVisible(true);
            }

            if (value.value < 2) {
                orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "Classic"];
            } else if (value.value < 6) {
                orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "North to South"];
            } else {
                orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)"];
            }

            let order = [];

            orderType && orderType.map((data, index) => {
                order[index] = { value: index, label: data }
            });

            setMainOrderOptions(order);
            setMainOrder(order[0]);
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_already_exist") }));
        }
    }

    const setSortArrayFromItem = (data) => {// need for select the product name sort
        setSortArray([...data]);
        setOtherAttr("");
        setOtherOrder("");
        setOtherOrderOptions([]);
        setOtherCheck(false);
    }

    const selectMainOrder = (value) => {
        setMainOrder(value);
    }

    const clickMainCheck = () => {
        if (sort_array.length > 0) {
            if (sort_array[0].is_group) {
                dispatch(openSnackBar({ status: "error", message: t("msg_uncheck_all") }));
            } else {
                setMainCheck(!mainCheck);
            }
        } else {
            setMainCheck(!mainCheck);
        }
    }

    ////////////////////other sort info///////////////////////////////////
    const selectOtherAttr = (value) => {
        setOtherAttr(value);

        if (value.value === 6) {   //if product name dont show the group check
            setOtherCheckVisible(false);
            setOtherCheck(false);
        } else {
            setOtherCheckVisible(true);
        }

        if (value.value < 2) {
            orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "Classic"];
        } else if (value.value < 6) {
            orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "North to South"];
        } else {
            orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)"];
        }

        let order = [];

        orderType && orderType.map((data, index) => {
            order[index] = { value: index, label: data }
        });

        setOtherOrderOptions(order);
        setOtherOrder(order[0]);
    }

    const selectOtherOrder = (value) => {
        setOtherOrder(value);
    }

    const clickOtherCheck = () => {
        if (mainAttr.value === 6) { // product
            dispatch(openSnackBar({ status: "error", message: t("msg_cant_check_bcos_product_name") }));
        } else {
            if (mainCheck) {
                if (sort_array.length > 0) {
                    if (sort_array[sort_array.length - 1].is_group) {
                        setOtherCheck(!otherCheck);
                    } else {
                        dispatch(openSnackBar({ status: "error", message: t("msg_check_prev_item") }));
                    }
                } else {
                    setOtherCheck(!otherCheck);
                }
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_check_main_item") }));
            }
        }
    }

    //////////////////////exist sort info//////////////////////////////
    const selectExistAttr = (value, pos) => {
        sort_array[pos].attr = value;
        setSortArray([...sort_array]);
    }

    const selectExistOrder = (value, pos) => {
        sort_array[pos].order = value
        setSortArray([...sort_array]);
    }

    const clickExistCheck = (value, pos) => {
        sort_array[pos].is_group = value;
        setSortArray([...sort_array]);
    }

    const addSort = () => {
        if (mainAttr && mainOrder) {
            if (otherAttr && otherOrder) {
                let flag = false;
                sort_array.map(data => {
                    if (data.attr.value === otherAttr.value)
                        flag = true
                })
                if (mainAttr?.value === otherAttr.value) {
                    flag = true;
                }

                if (!flag) {
                    setSortArray([...sort_array, { attr: otherAttr, order: otherOrder, is_group: otherCheck }]);
                    removeSort();
                } else {
                    dispatch(openSnackBar({ status: "error", message: t("msg_already_exist") }));
                }
            } else {
                if (!otherAttr) {
                    dispatch(openSnackBar({ status: "error", message: t("msg_select_attribute") }));
                } else if (!otherOrder) {
                    dispatch(openSnackBar({ status: "error", message: t("msg_select_order") }));
                }
            }
        } else {
            if (!mainAttr) {
                dispatch(openSnackBar({ status: "error", message: t("msg_select_main_attribute") }));
            } else if (!mainOrder) {
                dispatch(openSnackBar({ status: "error", message: t("msg_select_main_order") }));
            }
        }
    }

    const removeSort = () => {
        setOtherAttr("");
        setOtherOrder("");
        setOtherOrderOptions([]);
        setOtherCheck(false);
    }

    const removeSortItem = (pos) => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_remove_sort"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_remove")
        })
            .then(result => {
                if (result.isConfirmed) {
                    sort_array.splice(pos, 1)
                    setSortArray([...sort_array]);
                }
            });
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
        setMainAttr("");
        setMainOrder("");
        setMainCheck(false);
        removeSort();
        setSortArray([]);
    }

    const clearSort = () => {
        removeSort();
        setMainAttr("");
        setMainOrder("");
        setMainCheck(false);
        setSortArray([]);
    }

    const applySort = () => {
        if (mainAttr && mainOrder) {
            swal.fire({
                title: t("swal_are_you_sure"),
                text: t("swal_apply_sort"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtnColor: '#d33',
                confirmButtonText: t("swal_apply")
            })
                .then(result => {
                    if (result.isConfirmed) {
                        if (otherAttr) {
                            props.setData([{ attr: mainAttr, order: mainOrder, is_group: mainCheck }, ...sort_array, { attr: otherAttr, order: otherOrder, is_group: otherCheck }])
                        } else {
                            props.setData([{ attr: mainAttr, order: mainOrder, is_group: mainCheck }, ...sort_array])
                        }
                        close();
                    }
                });
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_cant_sort_bcos_main") }));
        }
    }


    return (
        <>
            <Button onClick={() => setModalShow(true)} outline={true} className="bg-sitebg-50" >
                <MdFilterList className="mr-2 h-6 w-6 text-sitebg-50" />
                {t("group_sort_product")}
            </Button>
            <Modal
                show={modalShow}
                size="3xl"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("group_sort_product")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6">
                        <div>
                            <div className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "1.5fr 3fr 2.5fr 2fr" }}>
                                <div className="m-2 ml-2 text-sm block"></div>
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">Attribute</div>
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">Order</div>
                                <div className="m-2 ml-2 text-sm font-bold flex text-sitetx-200">Group
                                    <Tooltip
                                        style="dark"
                                        content={t("menu_edit_sort_help")}
                                        placement="top"
                                        arrow={true}
                                        trigger="hover"
                                    >
                                        <FaQuestionCircle className="ml-2 w-4 h-4 my-auto text-orange-500" />
                                    </Tooltip>
                                </div>
                                {/* <div className="m-2 ml-2 text-sm block"></div> */}
                            </div>
                            <div className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "1.5fr 3fr 3fr 0.5fr 1fr" }}>
                                <div className="m-auto text-sm font-bold block text-sitetx-200">Sort for:</div>
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">
                                    <div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={mainAttr}
                                                onChange={value => selectMainAttr(value)}
                                                options={sort_options}
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                </div>
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">
                                    <div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={mainOrder}
                                                onChange={value => selectMainOrder(value)}
                                                options={main_order_options}
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                </div>
                                <input type="checkbox" onChange={() => clickMainCheck()} checked={mainCheck} className={`${mainCheckVisible ? "visible" : "collapse"} w-4 h-4 m-auto text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`} />
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200"></div>
                            </div>
                            {
                                sort_array?.length > 0 && sort_array.map((sort, index) =>
                                    <SortItem
                                        sort_array={sort_array}
                                        mainAttr={mainAttr}
                                        mainCheck={mainCheck}
                                        mainCheckVisible={mainCheckVisible}
                                        setArray={setSortArrayFromItem}
                                        key={index}
                                        data={sort}
                                        remove={removeSortItem}
                                        setAttr={selectExistAttr}
                                        setOrder={selectExistOrder}
                                        setGroup={clickExistCheck}
                                        pos={index}
                                    />
                                )
                            }
                            <div className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "1.5fr 3fr 3fr 0.5fr 1fr" }}>
                                <div className="m-auto text-sm font-bold block text-sitetx-200">{t("and_then")}</div>
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">
                                    <div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={otherAttr}
                                                onChange={value => selectOtherAttr(value)}
                                                options={sort_options}
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                </div>
                                <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">
                                    <div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={otherOrder}
                                                onChange={value => selectOtherOrder(value)}
                                                options={other_order_options}
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                </div>
                                <input type="checkbox" onChange={() => clickOtherCheck()} checked={otherCheck} className={`${otherCheckVisible ? "visible" : "collapse"} w-4 h-4 m-auto text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`} />
                                <div onClick={() => removeSort()} className="m-2 text-sm font-bold block text-sitetx-200">
                                    <div className="bg-red-300 p-2 rounded-xl flex justify-center">
                                        <HiOutlineMinus className="w-6 h-6 text-red-500 visi" />
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => addSort()} className="m-2 text-sm font-bold block text-sitebg-100">
                                <div className="bg-sitebg-50 bg-opacity-10 p-2 w-full h-14 rounded-xl flex justify-center items-center">
                                    <HiOutlinePlus className="w-5 h-5 mr-2 text-sitebg-100" />
                                    {t("add_sorting_level")}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button onClick={() => clearSort()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <HiOutlineTrash className="mr-2 h-5 w-5" />
                                {t("clear_sorting")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => applySort()} className="bg-sitebg-50" >
                                <MdFilterList className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("apply_sort")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SortModal;
