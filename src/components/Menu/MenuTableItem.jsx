import { Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { HiDotsHorizontal, HiOutlineTrash } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMenusByFilter, getMenuTotalCount, removeMenu, setCurrentWineMenu } from '../../redux/menuReducer';
// import { insertMenuInCart, removeMenuInCart, setCartItemActive } from '../../redux/locationReducer';
import date from 'date-and-time';
import { useTranslation } from "react-i18next";
import swal from 'sweetalert2';
import { API_BASE } from '../../config/constants';
import { openSnackBar } from '../../redux/snackBarReducer';
import DuplicateMenu from "./DuplicateMenu";

function MenuTableItem(props) {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state);
    const { userInfo } = authState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [permission, setPermission] = useState(false);

    useEffect(() => {
        if (props.condition.role === 0) { // admin 
            setPermission(true);
        } else if (props.condition.role === 1) { // company owner
            if (props.data.company._id === props.condition.company && props.data.is_global === props.condition.isGlobal) {
                setPermission(true);
            } else {
                setPermission(false);
            }
        } else if (props.condition.role === 2) {// company stuff
            if (props.data.company._id === props.condition.company && props.data.is_global === props.condition.isGlobal && props.data.created_by._id === props.condition.user_id) {
                setPermission(true);
            } else {
                setPermission(false);
            }
        }
    }, [props.condition, props.data])

    const clickDelete = async (value) => {

        if (permission) {
            swal.fire({
                title: t("swal_are_you_sure"),
                text: t("swal_del_menu"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: t("swal_delete")
            })
                .then(async result => {
                    if (result.isConfirmed) {
                        let res = await dispatch(removeMenu(value));
                        if (res !== false) {
                            dispatch(openSnackBar({ message: t("msg_success_del_menu"), status: 'success' }));
                            await dispatch(getMenusByFilter(props.condition));
                            await dispatch(getMenuTotalCount(props.condition));
                        }
                    }
                });
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
        }
    }

    const gotoMenuEditPage = () => {
        if (permission) {
            dispatch(setCurrentWineMenu(props.data));
            navigate("/menuedit");
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
        }
    }

    const { name, restaurant_logo, created_by, created_at, modified_at, _id } = props.data;

    return (
        <>
            <tr className={props.last ? "bg-white" : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}>
                <th onClick={() => gotoMenuEditPage()} scope="row" className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex justify-center w-20 h-20">
                        <img className="w-auto rounded-full" src={`${API_BASE}/public/${restaurant_logo.changed_name ? restaurant_logo.changed_name : "menu-empty.png"}`} alt="empty" />
                    </div>
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{created_by?.firstname + created_by?.lastname}</div>
                        <div className="text-base font-semibold">{name ? name : "N/A"}</div>
                    </div>
                </th>
                <td onClick={() => gotoMenuEditPage()} className="py-4 px-6">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{t("created")}</div>
                        <div className="text-base font-semibold">{created_at ? date.format(new Date(created_at), 'YYYY/MM/DD HH:mm:ss') : "N/A"}</div>
                    </div>
                </td>
                <td onClick={() => gotoMenuEditPage()} className="py-4 px-6">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{t("last_modified")}</div>
                        <div className="text-base font-semibold">{modified_at ? date.format(new Date(modified_at), 'YYYY/MM/DD HH:mm:ss') : "N/A"}</div>
                    </div>
                </td>
                <td className="py-4 px-6">
                    <Tooltip
                        style="light"
                        content={
                            <div >
                                <DuplicateMenu product_id={_id} permission={permission} />
                                <div onClick={() => gotoMenuEditPage()} className="flex text-gray-600 p-1 cursor-pointer hover:bg-gray-100">
                                    <FaRegEdit className="h-5 w-5 ml-1 mr-2 text-gray-600" />
                                    Edit
                                </div>
                                <div onClick={() => clickDelete(_id)} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                    <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                    Delete
                                </div>
                            </div>
                        }
                        placement="left"
                        arrow={false}
                        trigger="hover"
                    >
                        <HiDotsHorizontal className="w-6 h-6" />
                    </Tooltip>
                </td>
            </tr>
        </ >

    );
}

export default MenuTableItem;