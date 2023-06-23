import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlineClose } from "react-icons/ai";
import { removeProductInCart } from '../../redux/locationReducer';
import { API_BASE } from '../../config/constants';
import { useTranslation } from "react-i18next";
import { openSnackBar } from '../../redux/snackBarReducer';

function CartItem(props) {
    const { t } = useTranslation();
    const { globalState } = useSelector((state) => state);

    const dispatch = useDispatch();

    useEffect(() => {
    }, []);

    const removeCartItem = async () => {
        let res = await dispatch(removeProductInCart(props.pos));
        if (res !== false) {
            dispatch(openSnackBar({ message: t("msg_success_remove_product_cart"), status: 'success' }));
        }
    }

    const { country, region, product_name, vintage, bottle_size,
        product_type, wine_color, category, producer, active, article_nr, bottle_image } = props.data;

    return (
        <tr className="bg-white border-b dark:bg-gray-800 max-h-12 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="p-4 w-4">
                <div className="flex items-center">
                    <AiOutlineClose onClick={() => removeCartItem()} className="w-5 h-5" />
                </div>
            </td>
            <th scope="row" className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
                <img className="w-auto h-20 rounded-full" src={`${API_BASE}/public/${bottle_image.changed_name ? bottle_image.changed_name : "empty.png"}`} alt="empty" />
                <div className="pl-3">
                    <div className="font-normal text-gray-500">{producer?.name}</div>
                    <div className="text-base font-semibold">{product_name}</div>
                </div>
            </th>
            <td className="py-4 px-6">
                <div className="pl-3">
                    <div className="font-normal text-gray-500">{vintage ? vintage : "N/A"}</div>
                    <div className="text-base font-semibold">{bottle_size?.bottle_size + bottle_size?.unit}</div>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="pl-3">
                    <div className="font-normal text-gray-500">{product_type?.name}</div>
                    {
                        wine_color ?
                            <div className="text-base font-semibold">{wine_color?.name + ", " + product_type?.sub[category - 1][`${globalState.language}`] + " " + product_type?.name}</div>
                            : <div className="text-base font-semibold">{product_type?.sub[category][`${globalState.language}`] + " " + product_type?.name}</div>
                    }
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="pl-3">
                    <div className="font-normal text-gray-500">{country?.name[`${globalState.language}`]}</div>
                    <div className="text-base font-semibold">{region?.name[`${globalState.language}`]}</div>
                </div>
            </td>
            <td className="py-4 px-6">
                <div className="pl-3">
                    <div className="font-normal text-gray-500">{article_nr ? article_nr : "N/A"}</div>
                    <div className={`flex items-center text-base font-semibold ${active ? "text-green-400" : "text-red-500"}`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${active ? "bg-green-400" : "bg-red-500"} mr-2`}></div> {active ? "active" : "inactive"}
                    </div>
                </div>
            </td>
        </tr>
    );
}

export default CartItem;