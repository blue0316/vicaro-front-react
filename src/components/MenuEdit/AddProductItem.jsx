import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { API_BASE } from '../../config/constants';

function AddProductItem(props) {
    const { globalState } = useSelector((state) => state);

    useEffect(() => {
    }, []);

    var check_state = false;
    if (props.selectedProducts?.length > 0) {
        props.selectedProducts.map((data, index) => {
            if (data._id === props?.data._id) {
                check_state = true;
            }
        })
    }

    const checkCart = () => {
        var flag = false;
        var pos = 0;
        if (props.selectedProducts?.length > 0) {
            props.selectedProducts.map((data, index) => {
                if (data._id === props?.data._id) {
                    flag = true;
                    pos = index;
                }
            })
        }
        if (flag) {
            props.removeProduct(pos);
        } else {
            props.addProduct(props.data);
        }
    }

    const { country, region, product_name, vintage, bottle_size,
        product_type, wine_color, category, producer, active, article_nr, bottle_image, _id } = props.data;

    return (
        <>
            <div className="grid grid-cols-12 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <div className="col-span-1 p-4 w-4 m-auto">
                    <div className="flex items-center">
                        <input id={`checkbox-table-search-${_id}`} onChange={() => { checkCart() }} checked={check_state} type="checkbox" className="w-6 h-6 text-sitebg-50 rounded border-gray-300 focus:ring-sitebg-50 dark:focus:ring-sitebg-50 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor={`checkbox-table-search-${_id}`} className="sr-only">checkbox</label>
                    </div>
                </div>
                <div onClick={() => checkCart()} scope="row" className="col-span-3 flex items-center py-4 px-2 text-gray-900 dark:text-white">
                    <img className="w-auto h-20 rounded-full" src={`${API_BASE}/public/${bottle_image.changed_name ? bottle_image.changed_name : "empty.png"}`} alt="empty" />
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{producer?.name}</div>
                        <div className="text-base font-semibold">{product_name}</div>
                    </div>
                </div>
                <div onClick={() => checkCart()} className="col-span-2 py-4 px-6 m-auto">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{vintage ? vintage : "N/A"}</div>
                        <div className="text-base font-semibold">{bottle_size?.bottle_size + bottle_size?.unit}</div>
                    </div>
                </div>
                <div onClick={() => checkCart()} className="col-span-2 py-4 px-6 m-auto">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{product_type?.name}</div>
                        {
                            wine_color ?
                                <div className="text-base font-semibold">{wine_color?.name + ", " + product_type?.sub[category - 1][`${globalState.language}`] + " " + product_type?.name}</div>
                                : <div className="text-base font-semibold">{product_type?.sub[category][`${globalState.language}`] + " " + product_type?.name}</div>
                        }
                    </div>
                </div>
                <div onClick={() => checkCart()} className="col-span-2 py-4 px-6 m-auto">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{country?.name[`${globalState.language}`]}</div>
                        <div className="text-base font-semibold">{region?.name[`${globalState.language}`]}</div>
                    </div>
                </div>
                <div className="col-span-2 py-4 px-6 m-auto">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{article_nr ? article_nr : "N/A"}</div>
                        <div className={`flex items-center text-base font-semibold ${active ? "text-green-400" : "text-red-500"}`}>
                            <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-green-400" : "bg-red-500"} mr-2`}></div> {active ? "active" : "inactive"}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default AddProductItem;