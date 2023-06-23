import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { HiOutlineMinus } from "react-icons/hi";
import { openSnackBar } from '../../redux/snackBarReducer';
import styled from 'styled-components';
import Select from 'react-tailwindcss-select';
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

    const [existAttr, setExistAttr] = useState(props.data.attr);
    const [existOrder, setExistOrder] = useState(props.data.order);
    const [existCheck, setExistCheck] = useState(props.data.is_group);
    const [existCheckVisible, setExistCheckVisible] = useState(props.data.attr.value === 6 ? false : true)
    const [exist_order_options, setExistOrderOptions] = useState([]);

    var sortType = ["Product-Category", "Product-Sub-Category", "Country", "Region", "Sub-Region", "Producer", "Product-Name", "Grape Variaty"];
    var orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "Classic"]

    useEffect(() => {
        if (props.data.attr.value < 2) {
            orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "Classic"];
        } else if (props.data.attr.value < 6) {
            orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)", "North to South"];
        } else {
            orderType = ["Alphabetical (a to z)", "Alphabetical (z to a)"];
        }

        let order = [];

        orderType && orderType.map((data, index) => {
            order[index] = { value: index, label: data }
        });

        setExistOrderOptions(order);

        setExistAttr(props.data.attr);
        setExistOrder(props.data.order);
        setExistCheck(props.data.is_group);
        setExistCheckVisible(props.data.attr.value === 6 ? false : true)
    }, [props.data, props.sort_array])

    var sort_options = [];

    sortType && sortType.map((data, index) => {
        sort_options[index] = { value: index, label: data }
    });


    const selectExistAttr = (value, pos) => {
        let flag = false;
        const { sort_array, mainAttr, setAttr, setOrder, setGroup } = props;

        if (value.value === 6) {   //if product name ignore group
            setExistCheckVisible(false);
            setExistCheck(false)

            let temp = [];
            if (sort_array.length > pos) {
                sort_array.map((sort, index) => {
                    if (index > pos)
                        sort_array[index].is_group = false;
                    temp.push(sort_array[index]);
                })
                props.setArray(temp)
            }
        } else {
            setExistCheckVisible(true);
        }

        sort_array.map(data => {
            if (sort_array[pos].attr.value !== value.value && data.attr.value === value.value)
                flag = true
        })
        if (mainAttr?.value === value.value) {
            flag = true;
        }

        if (!flag) {
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
            setExistOrderOptions(order);

            setExistAttr(value);
            setExistOrder(order[0]);
            setAttr(value, pos);
            setGroup(false, pos);
            setOrder(order[0], pos);
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_already_exist") }));
        }
    }

    const selectExistOrder = (value, pos) => {
        props.setOrder(value, pos);
    }

    const clickExistCheck = (pos) => {
        const { sort_array, mainCheck, mainCheckVisible } = props;

        let flag = false;
        if (pos === 0) {
            if (mainCheckVisible) {// product case
                if (sort_array.length > 1) {
                    if (mainCheck && !sort_array[pos + 1].is_group) {
                        flag = true;
                    } else {
                        if (!mainCheck) {
                            dispatch(openSnackBar({ status: "error", message: t("msg_check_main_item") }));
                        } else if (sort_array[pos + 1].is_group) {
                            dispatch(openSnackBar({ status: "error", message: t("msg_uncheck_next_item") }));
                        }
                    }
                } else {
                    if (mainCheck) {
                        flag = true;
                    } else {
                        dispatch(openSnackBar({ status: "error", message: t("msg_check_main_item") }));
                    }
                }
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_cant_check_bcos_product_name") }));
            }
        } else {
            if (pos !== sort_array.length - 1) {
                if (!sort_array[pos + 1].is_group && sort_array[pos - 1].is_group) {
                    flag = true
                } else {
                    dispatch(openSnackBar({ status: "error", message: t("msg_check_down_item") }));
                }
            } else {
                if (sort_array[pos - 1].is_group) {
                    flag = true
                } else {
                    dispatch(openSnackBar({ status: "error", message: t("msg_check_prev_item") }));
                }
            }
        }

        if (flag) {
            setExistCheck(!existCheck);
            props.setGroup(!existCheck, pos);
        }
    }

    const removeSortItem = (pos) => {
        props.remove(pos);
    }

    return (
        <div className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "1.5fr 3fr 3fr 0.5fr 1fr" }}>
            <div className="m-auto text-sm font-bold block text-sitetx-200">And then:</div>
            <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">
                <div>
                    <SelectCustomStyle>
                        <Select
                            value={existAttr}
                            onChange={value => selectExistAttr(value, props.pos)}
                            options={sort_options}
                        />
                    </SelectCustomStyle>
                </div>
            </div>
            <div className="m-2 ml-2 text-sm font-bold block text-sitetx-200">
                <div>
                    <SelectCustomStyle>
                        <Select
                            value={existOrder}
                            onChange={value => selectExistOrder(value, props.pos)}
                            options={exist_order_options}
                        />
                    </SelectCustomStyle>
                </div>
            </div>
            <input type="checkbox" onChange={() => clickExistCheck(props.pos)} checked={existCheck} className={`${existCheckVisible ? "visible" : "collapse"} w-4 h-4 m-auto text-sitebg-50 rounded border-gray-300 focus:ring-sitebg-50 dark:focus:ring-sitebg-50 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600`} />
            <div onClick={() => removeSortItem(props.pos)} className="m-2 text-sm font-bold block text-sitetx-200">
                <div className="bg-red-300 p-2 rounded-xl flex justify-center">
                    <HiOutlineMinus className="h-6 w-6 text-red-500" />
                </div>
            </div>
        </div>
    );
}

export default SortModal;
