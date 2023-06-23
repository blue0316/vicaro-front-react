import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { TextInput } from "flowbite-react"
import { HiPlusCircle, } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";
import { AiOutlineClose, AiFillCloseCircle } from "react-icons/ai";
import { deleteProductFromMenu, duplicateProductFromMenu } from '../../redux/menuReducer';
import swal from 'sweetalert2';
import Select from 'react-tailwindcss-select';
import styled from 'styled-components';
import { openSnackBar } from '../../redux/snackBarReducer';
import { API_BASE } from '../../config/constants';
import { useTranslation } from "react-i18next";

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px;
    border-radius: 99999px !important;
}
`

function MenuProductItem(props) {
    const { t } = useTranslation();
    const { globalState, locationState } = useSelector((state) => state);

    const dispatch = useDispatch();

    const { bottlesizes } = locationState;
    const [showAddPrice, setShowAddPrice] = useState(false);
    const [showPrice, setShowPrice] = useState([...props.data.price]);
    const [priceData, setPriceData] = useState({
        bottle_size: "",
        price: "",
    });

    const bottlesize_options = [];

    //bottlesize
    if (bottlesizes?.length > 0) {
        bottlesizes.map((data, index) => {
            bottlesize_options[index] = { value: data._id, label: data.bottle_size + data.unit }
        })
    }

    useEffect(() => {
        setShowPrice([...props.data.price]);
    }, [props.data.price]);

    const handleInputChange = (key, value) => {
        if(key == "price"){
            value = value.replace('.',',');
        }

        priceData[`${key}`] = value;
        setPriceData({ ...priceData });
    };

    const clickDuplicate = () => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_duplicate_product"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_duplicate")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    let res = await dispatch(duplicateProductFromMenu({ product_id: props.data._id, menu_id: props.menu_id }));
                    if (res !== false) {
                        dispatch(openSnackBar({ message: t("msg_success_duplicate_product"), status: 'success' }));
                    }
                }
            });
    }

    const clickDelete = async () => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_del_product"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_delete")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    let res = await dispatch(deleteProductFromMenu({ product_id: props.data._id, menu_id: props.menu_id }));
                    if (res !== false) {
                        dispatch(openSnackBar({ message: t("msg_success_del_product"), status: 'success' }));
                    }
                }
            });
    }

    const addNewPrice = () => {
        setShowAddPrice(!showAddPrice);
        initData();
    }

    function initData() {
        setPriceData({
            bottle_size: "",
            price: ""
        });
    }

    function validate() {
        const { bottle_size, price } = priceData;
        if (!bottle_size) {
            dispatch(openSnackBar({ message: t("msg_select_bottle_size"), status: 'error' }));
            return false;
        } else if (!price) {
            dispatch(openSnackBar({ message: t("msg_fill_price"), status: 'error' }));
            return false
        }
        return true;
    }

    const createNewPrice = async () => {
        if (validate()) {
            let isExistPrice = false;
            showPrice.map((data, index) => {
                if (data.bottle_size === priceData.bottle_size.value) {
                    isExistPrice = true;
                }
            })
            if (!isExistPrice) {
                // if (props.isNew) {
                props.priceFunc(props.index, [...showPrice, { price_unit: "€", bottle_size: priceData.bottle_size.value, price: priceData.price }]);
                setShowPrice([...showPrice, { price_unit: "€", bottle_size: priceData.bottle_size.value, price: priceData.price }]);
                setShowAddPrice(false);
                initData();
                // } else {
                //     // let result = await dispatch(addPrice({ priceData, product_id: props.data._id, menu_id: props.menu_id }));
                //     // if (result) {
                //     setShowPrice([...showPrice, { price_unit: "€", bottle_size: priceData.bottle_size.value, price: priceData.price }]);
                //     setShowAddPrice(false);
                //     initData();
                //     // }
                // }
            } else {
                dispatch(openSnackBar({ message: t("msg_price_exist"), status: 'error' }));
            }
        }
    }

    const deleteNewPrice = async (price_index) => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_del_price"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_delete")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    // if (props.isNew) {
                    showPrice.splice(price_index, 1)
                    props.priceFunc(props.index, [...showPrice], "remove");
                    setShowPrice([...showPrice]);
                    // } else {
                    //     // let result = await dispatch(deletePrice({ product_id: props.data._id, menu_id: props.menu_id, price_index }));
                    //     // if (result) {
                    //     setShowPrice([...showPrice, showPrice.splice(price_index, 1)]);
                    //     // }
                    // }
                }
            });

    }

    const { product, category, product_type } = props.data;
    const { country, region, product_name, vintage, bottle_size,
        wine_color, producer, active, article_nr, bottle_image } = product;

    return (
        // <>
        <div className="grid grid-cols-12 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" style={{ maxWidth: "1000px" }}>
            {/* <div className="col-span-1 p-4 w-4 m-auto">
                <MdDragIndicator className="w-6 h-6 text-sitetx-200" />
            </div> */}
            <div className="col-span-1 py-4 px-6 m-auto text-gray-900 dark:text-white">
                <img className="w-auto h-20 rounded-full" src={`${API_BASE}/public/${bottle_image.changed_name ? bottle_image.changed_name : "empty.png"}`} alt="empty" />
            </div>
            <div className="col-span-11">
                <div className="grid-rows-2">
                    <div className="row-span-1">
                        <div className="grid grid-cols-12">
                            <div className="col-span-4 py-4 px-6 m-auto text-gray-900">
                                <p className="font-normal text-gray-500">{producer?.name ? producer?.name : "N/A"}</p>
                                <p className="text-base font-semibold">{product_name}</p>
                            </div>
                            <div className="col-span-1 py-4 px-6 m-auto">
                                <div className="font-normal text-gray-500">{vintage ? vintage : "N/A"}</div>
                                <div className="text-base font-semibold">{bottle_size?.bottle_size + bottle_size?.unit}</div>
                            </div>
                            <div className="col-span-3 py-4 px-6 m-auto">
                                <div className="font-normal text-gray-500">{product_type?.name}</div>
                                {
                                    wine_color ?
                                        <div className="text-base font-semibold">{wine_color?.name + ", " + product_type?.sub[category - 1][`${globalState.language}`] + " " + product_type?.name}</div>
                                        : <div className="text-base font-semibold">{product_type?.sub[category][`${globalState.language}`] + " " + product_type?.name}</div>
                                }
                            </div>
                            <div className="col-span-3 py-4 px-6 m-auto">
                                <div className="font-normal text-gray-500">{country?.name[`${globalState.language}`] ? country?.name[`${globalState.language}`] : "N/A"}</div>
                                <div className="text-base font-semibold">{region?.name[`${globalState.language}`] ? region?.name[`${globalState.language}`] : "N/A"}</div>
                            </div>
                            <div className="col-span-1 py-4 px-6 m-auto">
                                <div className="font-normal text-gray-500">{article_nr ? article_nr : "N/A"}</div>
                                <div className={`flex items-center text-base font-semibold ${active ? "text-green-400" : "text-red-500"}`}>
                                    <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-green-400" : "bg-red-500"} mr-2`}></div> {active ? "active" : "inactive"}
                                </div>
                            </div>
                            {/* <div className="col-span-1 py-4 px-6 m-auto">
                                <Tooltip
                                    style="light"
                                    content={
                                        <div>
                                            <div onClick={() => clickDuplicate()} className="flex text-gray-600 p-1 cursor-pointer hover:bg-gray-100">
                                                <HiOutlineDuplicate className="h-6 w-6 mr-2 text-gray-600" />
                                                Duplicate
                                            </div>
                                            <div onClick={() => clickDelete()} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                                <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                                Delete
                                            </div>
                                        </div>
                                    }
                                    placement="left"
                                    arrow={false}
                                    trigger="hover"
                                >
                                    <HiDotsHorizontal className="w-6 h-6 text-sitetx-200" />
                                </Tooltip>
                            </div> */}
                        </div>

                    </div>
                    <div className="row-span-1 flex flex-wrap pb-2 gap-2">
                        <div className="my-auto">
                            {
                                showAddPrice ? <AiFillCloseCircle onClick={() => addNewPrice()} className="w-8 h-8 mx-2 text-sitetx-200" /> :
                                    <HiPlusCircle onClick={() => addNewPrice()} className="w-8 h-8 mx-2 text-sitebg-100" />
                            }
                        </div>
                        {showAddPrice &&
                            <div className="bg-sitebg-100 p-2 flex rounded-full gap-2">
                                <SelectCustomStyle>
                                    <Select
                                        value={priceData.bottle_size}
                                        onChange={value => handleInputChange("bottle_size", value)}
                                        options={bottlesize_options.reverse()}
                                    />
                                </SelectCustomStyle>
                                <TextInput
                                    id="price"
                                    type="text"
                                    onChange={e => handleInputChange("price", e.target.value)}
                                    // placeholder="Producer Name"
                                    className="w-32"
                                    addon="€"
                                    value={priceData.price}
                                />
                                <div className="my-auto">
                                    <FiPlus onClick={() => createNewPrice()} className="w-6 h-6" />
                                </div>
                            </div>
                        }
                        {
                            showPrice?.length > 0 && showPrice.map((data, index) =>
                                <div key={index} className="bg-gray-300 p-2 flex rounded-full gap-2 my-auto">
                                    {showAddPrice == true ? bottlesize_options[bottlesize_options.length - 1 - data.bottle_size].label : bottlesize_options[data.bottle_size].label}
                                    <div className="font-bold pl-4 text-gray-800">{data.price + " " + data.price_unit}</div>
                                    <div className="my-auto">
                                        <AiOutlineClose onClick={() => deleteNewPrice(index)} className="w-4 h-4 text-sitetx-200" />
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
        // </>

    );
}

export default MenuProductItem;