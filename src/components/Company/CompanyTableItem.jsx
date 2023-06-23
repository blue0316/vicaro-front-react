import { Modal, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { HiDotsHorizontal, HiOutlineCheckCircle, HiOutlineMail, HiOutlinePhone, HiOutlineTrash } from "react-icons/hi";
import { MdOutlineLocationOn } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { getCompaniesByFilter, getCompanyTotalCount, removeCompany, setCompanyActive } from '../../redux/companyReducer';
// import { insertCompanyInCart, removeCompanyInCart, setCartItemActive } from '../../redux/locationReducer';
// import DuplicateCompany from "./DuplicateCompany";
import date from 'date-and-time';
import { useTranslation } from "react-i18next";
import swal from 'sweetalert2';
import { API_BASE } from '../../config/constants';
import { openSnackBar } from '../../redux/snackBarReducer';
import EditCompany from './EditCompany';

function CompanyTableItem(props) {
    const { t } = useTranslation();
    const { authState, globalState } = useSelector((state) => state);
    const { userInfo } = authState;

    const dispatch = useDispatch();

    const [permission, setPermission] = useState(false);
    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide

    useEffect(() => {
        if (props.condition.role === 0) { // admin 
            setPermission(true);
        } else if (props.condition.role === 1) { // company owner
            if (props.data._id === props.condition.company) {
                setPermission(true);
            } else {
                setPermission(false);
            }
        } else if (props.condition.role === 2) {// company stuff
            setPermission(false);
        }
    }, [props.condition, props.data])

    // const gotoCompanyEditPage = () => {
    //     if (permission) {
    //         // dispatch(setCurrentCompany(props.data));
    //         // navigate("/companyedit");
    //     } else {
    //         dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
    //     }
    // }

    const clickDelete = async (value) => {
        const { id } = userInfo;

        if (permission) {
            swal.fire({
                title: t("swal_are_you_sure"),
                text: t("swal_del_company"),
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: t("swal_delete")
            })
                .then(async result => {
                    if (result.isConfirmed) {
                        let res = await dispatch(removeCompany(value));
                        if (res !== false) {
                            dispatch(openSnackBar({ message: t("msg_success_del_company"), status: 'success' }));
                            await dispatch(getCompaniesByFilter(props.condition));
                            await dispatch(getCompanyTotalCount(props.condition));
                        }
                    }
                });
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
        }
    }

    const setActive = (value) => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_active_company"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_active")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    let res = await dispatch(setCompanyActive({ id: value, type: true, user_id: props.condition.user_id }));
                    if (res !== false) {
                        dispatch(openSnackBar({ message: `${t("success")} ${t("active")} ${t("msg_all_product_cart")}`, status: 'success' }));
                        await dispatch(getCompaniesByFilter(props.condition));
                        await dispatch(getCompanyTotalCount(props.condition));
                    }
                }
            });
    }

    const setInActive = (value) => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_inactive_company"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_inactive")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    let res = await dispatch(setCompanyActive({ id: value, type: false, user_id: props.condition.user_id }));
                    if (res !== false) {
                        dispatch(openSnackBar({ message: `${t("success")} ${t("inactive")} ${t("msg_all_product_cart")}`, status: 'success' }));
                        await dispatch(getCompaniesByFilter(props.condition));
                        await dispatch(getCompanyTotalCount(props.condition));
                    }
                }
            });
    }

    const { name, address, email, is_active, logo, phone, created_at, _id } = props.data;

    return (
        <>
            <tr className={props.last ? "bg-white" : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"}>
                <th onClick={() => setModalShow(true)} scope="row" className="flex items-center py-4 px-2 text-gray-900 whitespace-nowrap dark:text-white">
                    <div className="flex justify-center w-20 h-20">
                        <img className="w-auto rounded-full" src={`${API_BASE}/public/${logo.changed_name ? logo.changed_name : "company-empty.png"}`} alt="empty" />
                    </div>
                    <div className="pl-3">
                        <div className="text-base font-semibold">{name ? name : "N/A"}</div>
                    </div>
                </th>
                <td onClick={() => setModalShow(true)} className="py-4 px-2">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{address?.street ? address?.street : "N/A"}</div>
                        <div className="text-base font-semibold">{address?.postalcode + " " + address?.city}</div>
                    </div>
                </td>
                <td onClick={() => setModalShow(true)} className="py-4 px-2">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{email ? email : "N/A"}</div>
                        <div className="text-base font-semibold">{created_at ? date.format(new Date(created_at), 'YYYY/MM/DD HH:mm:ss') : "N/A"}</div>
                    </div>
                </td>
                {
                    userInfo?.role === 0 ?
                        <td className="py-4 px-2">
                            <Tooltip
                                style="light"
                                content={
                                    <div>
                                        <div onClick={() => setActive(_id)} className="flex items-center text-base font-semibold text-green-400 cursor-pointer p-2">
                                            {/* <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> active */}
                                            <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                                            Active
                                        </div>
                                        <div onClick={() => setInActive(_id)} className="flex items-center text-base font-semibold text-red-500 cursor-pointer p-2">
                                            {/* <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> active */}
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
                        </td>
                        :
                        <td className="py-4 px-2">
                            <div className="pl-3">
                                <div className="font-normal text-gray-500">{phone ? phone : "N/A"}</div>
                                <div className={`flex items-center text-base font-semibold ${is_active ? "text-green-400" : "text-red-500"}`}>
                                    <div className={`h-2.5 w-2.5 rounded-full ${is_active ? "bg-green-400" : "bg-red-500"} mr-2`}></div> {is_active ? "active" : "inactive"}
                                </div>
                            </div>
                        </td>
                }
                <td className="py-4 px-2">
                    <Tooltip
                        style="light"
                        content={
                            <div >
                                <EditCompany company={props.data} condition={props.condition} />
                                {
                                    userInfo?.role === 0 &&
                                    <div onClick={() => clickDelete(_id)} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                        <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                        Delete
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
                    Company Information
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6 text-sitetx-200">
                        <div className="grid grid-cols-5 gap-4">
                            <div className="col-span-1 m-auto">
                                <img className="w-auto h-auto rounded-full" src={`${API_BASE}/public/${logo.changed_name ? logo.changed_name : "company-empty.png"}`} alt="empty" />
                            </div>
                            <div className="col-span-4">
                                <div className="text-base font-semibold">{address?.postalcode + " " + address?.city}</div>
                                <div className="text-3xl font-bold">{name}</div>

                                <div className="text-2xl font-bold pt-8 pb-2 flex"><MdOutlineLocationOn className="w-6 h-6 my-auto" /> Location</div>
                                <div className="text-base">{address.country.name[`${globalState.language}`] + ">" + address.city + ">" + address.street}</div>
                                {/* <div className="pt-4 grid grid-cols-2"> */}
                                <div className="col-span-1 flex py-2">
                                    <HiOutlineMail className="w-6 h-6" />
                                    {email ? email : "N/A"}
                                </div>
                                <div className="col-span-1 flex py-2">
                                    <HiOutlinePhone className="w-6 h-6" />
                                    {phone ? phone : "N/A"}
                                </div>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="grid grid-cols-8">
                        <div className="col-span-5 flex pl-12 gap-8">
                            {
                                userInfo?.role === 0 &&
                                <div onClick={() => clickDelete(_id)} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                    <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                    Delete
                                </div>
                            }
                            <EditCompany company={props.data} condition={props.condition} />
                        </div>

                        {/* </div><div className="col-span-3 flex gap-8 justify-end">
                        <label onClick={() => getPrevCompany()} className="flex flex-col justify-center items-center float-right w-16 h-16 bg-white rounded-lg border-2 border-sitetx-100 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-sitebg-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <SlArrowLeft className="text-black h-6 w-6" />
                            </div>
                        </label>
                        <label onClick={() => getNextCompany()} className="flex flex-col justify-center items-center float-right w-16 h-16 bg-white rounded-lg border-2 border-sitetx-100 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-sitebg-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <SlArrowRight className="text-black h-6 w-6" />
                            </div>
                        </label> */}
                    </div>
                </Modal.Footer>
            </Modal>
        </>

    );
}

export default CompanyTableItem;