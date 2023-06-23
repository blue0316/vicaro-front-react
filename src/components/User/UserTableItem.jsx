import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip, Modal, } from "flowbite-react"
import { HiDotsHorizontal, HiOutlineOfficeBuilding, HiOutlineMail, HiOutlinePhone, HiOutlineTrash } from "react-icons/hi";
import { MdOutlineLocationOn } from "react-icons/md";
import { removeUser, getUsersByFilter, getUserTotalCount } from '../../redux/userReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import date from 'date-and-time';
import { API_BASE } from '../../config/constants';
import EditUser from './EditUser';
import { useTranslation } from "react-i18next";

function UserTableItem(props) {
    const { t } = useTranslation();
    const { authState, globalState } = useSelector((state) => state);
    const { userInfo } = authState;

    const dispatch = useDispatch();

    const [permission, setPermission] = useState(false);
    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide

    useEffect(() => {
        if (props.condition.role === 0) { // admin 
            setPermission(true);
        } else if (props.condition.role === 1) { // user owner
            if (props.data.company === props.condition.company) {
                setPermission(true);
            } else {
                setPermission(false);
            }
        } else if (props.condition.role === 2) {// user stuff
            if (props.data._id === props.condition.user_id) {
                setPermission(true);
            } else {
                setPermission(false);
            }
        }
    }, [props.condition, props.data])

    // const gotoUserEditPage = () => {
    //     if (permission) {
    //         // dispatch(setCurrentUser(props.data));
    //         // navigate("/useredit");
    //     } else {
    //         dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
    //     }
    // }

    const clickDelete = async (value) => {

        if (permission) {
            swal.fire({
                title: t("swal_are_you_sure"),
                text: t("swal_del_user"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: t("swal_delete")
            })
                .then(async result => {
                    if (result.isConfirmed) {
                        let res = await dispatch(removeUser(value));
                        if (res !== false) {
                            dispatch(openSnackBar({ message: t("msg_success_del_user"), status: 'success' }));
                            await dispatch(getUsersByFilter(props.condition));
                            await dispatch(getUserTotalCount(props.condition));
                        }
                    }
                });
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
        }
    }

    // const setActive = (value) => {
    //     swal.fire({
    //         title: t("swal_are_you_sure"),
    //         text: t("swal_active_user"),
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: t("swal_active")
    //     })
    //         .then(async result => {
    //             if (result.isConfirmed) {
    //                 // await dispatch(setUserActive({ id: value, type: true, user_id: props.condition.user_id }));
    //                 // await dispatch(getUsersByFilter(props.condition));
    //                 // await dispatch(getUserTotalCount(props.condition));
    //             }
    //         });
    // }

    // const setInActive = (value) => {
    //     swal.fire({
    //         title: t("swal_are_you_sure"),
    //         text: t("swal_inactive_user"),
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: t("swal_inactive")
    //     })
    //         .then(async result => {
    //             if (result.isConfirmed) {
    //                 // await dispatch(setUserActive({ id: value, type: false, user_id: props.condition.user_id }));
    //                 // await dispatch(getUsersByFilter(props.condition));
    //                 // await dispatch(getUserTotalCount(props.condition));
    //             }
    //         });
    // }

    const { firstname, lastname, address, email, phone, company, role, avatar, created_at, _id } = props.data;
    const roleString = ["Admin", "Company Onwer", "Company stuff"];

    return (
        <>
            <tr className={props.last ? "bg-white" : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}>
                <th onClick={() => setModalShow(true)} scope="row" className="flex items-center py-4 px-6 text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex justify-center w-20 h-20">
                        <img className="w-auto rounded-full" src={`${API_BASE}/public/${avatar.changed_name ? avatar.changed_name : "user-empty.png"}`} alt="empty" />
                    </div>
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{firstname + " " + lastname}</div>
                        <div className="text-base font-semibold">{email ? email : "N/A"}</div>
                    </div>
                </th>
                <td onClick={() => setModalShow(true)} className="py-4 px-2">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{company.name}</div>
                        <div className="text-base font-semibold">{roleString[role]}</div>
                    </div>
                </td>
                <td onClick={() => setModalShow(true)} className="py-4 px-2">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{t("created")}</div>
                        <div className="text-base font-semibold">{created_at ? date.format(new Date(created_at), 'YYYY/MM/DD HH:mm:ss') : "N/A"}</div>
                    </div>
                </td>
                {/* <td className="py-4 px-2">
                    <Tooltip
                        style="light"
                        content={
                            <div>
                                <div onClick={() => setActive(_id)} className="flex items-center text-base font-semibold text-green-400 cursor-pointer p-2">
                                    <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                                    Active
                                </div>
                                <div onClick={() => setInActive(_id)} className="flex items-center text-base font-semibold text-red-500 cursor-pointer p-2">
                                    <AiOutlineCloseCircle className="mr-2 h-5 w-5" />
                                    Inactive
                                </div>
                            </div>
                        }
                        placement="right"
                        arrow={false}
                        trigger="hover"
                    >
                        <div className="pl-3">
                            <div className="font-normal text-gray-500">{phone ? phone : "N/A"}</div>
                            <div className={`flex items-center text-base font-semibold ${is_active ? "text-green-400" : "text-red-500"}`}>
                                <div className={`h-2.5 w-2.5 rounded-full ${is_active ? "bg-green-400" : "bg-red-500"} mr-2`}></div> {is_active ? "active" : "inactive"}
                            </div>
                        </div>
                    </Tooltip>
                </td> */}
                <td className="py-4 px-2">
                    <Tooltip
                        style="light"
                        content={
                            <div >
                                <EditUser user={props.data} condition={props.condition} />
                                {/* 
                                <div onClick={() => gotoUserEditPage()} className="flex text-gray-600 p-1 cursor-pointer hover:bg-gray-100">
                                    <FaRegEdit className="h-5 w-5 ml-1 mr-2 text-gray-600" />
                                    Edit
                                </div> */}
                                {
                                    userInfo.role === 0 &&
                                    <div onClick={() => clickDelete(_id)} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                        <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                        {t("delete")}
                                    </div>
                                }
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
            <Modal
                show={modalShow}
                size="2xl"
                popup={true}
                onClose={() => setModalShow(false)}
            >
                <Modal.Header>
                    {t("user_info")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6 text-sitetx-200">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-1 m-auto">
                                <img className="w-auto h-auto rounded-full" src={`${API_BASE}/public/${avatar.changed_name ? avatar.changed_name : "user-empty.png"}`} alt="empty" />
                            </div>
                            <div className="col-span-4">
                                <div className="text-base font-semibold">{address?.postalcode + " " + address?.city}</div>
                                <div className="text-3xl font-bold">{firstname + " " + lastname}</div>

                                <div className="text-2xl font-bold pt-8 pb-2 flex"><HiOutlineOfficeBuilding className="w-6 h-6 my-auto" /> {t("company")}</div>
                                <div className="text-base">{company.name + ">" + roleString[role]}</div>

                                <div className="text-2xl font-bold pt-8 pb-2 flex"><MdOutlineLocationOn className="w-6 h-6 my-auto" /> {t("location")}</div>
                                <div className="text-base">{address.country.name[`${globalState.language}`] + ">" + address.city + ">" + address.street}</div>

                                <div className="col-span-1 flex py-2">
                                    <HiOutlineMail className="w-6 h-6" />
                                    {email ? email : "N/A"}
                                </div>
                                <div className="col-span-1 flex py-2">
                                    <HiOutlinePhone className="w-6 h-6" />
                                    {phone ? phone : "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="grid grid-cols-8">
                        <div className="col-span-5 flex pl-12 gap-8">
                            {
                                userInfo.role === 0 &&
                                <div onClick={() => clickDelete(_id)} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                    <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                    Delete
                                </div>
                            }
                            <EditUser user={props.data} condition={props.condition} />
                        </div>

                        {/* </div><div className="col-span-3 flex gap-8 justify-end">
                        <label onClick={() => getPrevUser()} className="flex flex-col justify-center items-center float-right w-16 h-16 bg-white rounded-lg border-2 border-sitetx-100 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-sitebg-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <SlArrowLeft className="text-black h-6 w-6" />
                            </div>
                        </label>
                        <label onClick={() => getNextUser()} className="flex flex-col justify-center items-center float-right w-16 h-16 bg-white rounded-lg border-2 border-sitetx-100 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-sitebg-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <SlArrowRight className="text-black h-6 w-6" />
                            </div>
                        </label> */}
                    </div>
                </Modal.Footer>
            </Modal>
        </ >

    );
}

export default UserTableItem;