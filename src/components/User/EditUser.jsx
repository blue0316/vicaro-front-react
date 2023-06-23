import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Label, TextInput } from "flowbite-react"
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaRegTimesCircle, FaRegEdit } from 'react-icons/fa';
import { getUsersByFilter, modifyUser } from '../../redux/userReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import { createUserSearchText } from '../../utils'
import Loading from "../Global/Loading";
import UploadImage from '../Global/UploadImage';
import styled from 'styled-components';
import Select from 'react-tailwindcss-select';
import Validator from 'validator';
import { useTranslation } from "react-i18next";

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`

function User(props) {
    const { t } = useTranslation();
    const { authState, globalState, userState, locationState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { modifyUserState } = userState;
    const { countries, companies } = locationState;

    const dispatch = useDispatch();

    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [avatarImage, setAvatarImage] = useState(null);
    const [showAvatarImage, setShowAvatarImage] = useState(null);
    const [useCompanyInfo, setUseCompanyInfo] = useState(false);

    const [userData, setUserData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        company: "",
        street_name: "",
        postal_code: "",
        city: "",
        country: "",
        phone: "",
        user_role: "",
        password: ""
    });

    useEffect(() => {
        // dispatch(getUserTotalCount(id, user))
    }, [])

    const roles = ["Company Owner", "Company stuff"];
    const country_options = [];
    const company_options = [];
    const role_options = [];

    // country
    if (countries?.length > 0) {
        countries.map((data, index) => {
            country_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }
    // company
    if (companies?.length > 0) {
        companies.map((data, index) => {
            company_options[index] = { value: data._id, label: data.name }
        })
    }
    // role
    if (roles?.length > 0) {
        roles.map((data, index) => {
            role_options[index] = { value: index + 1, label: data }
        })
    }

    const handleInputChange = (key, value) => {
        userData[`${key}`] = value;
        setUserData({ ...userData });

        if (key === "company") {
            if (useCompanyInfo === true) {
                let result = companies.filter(e => e._id === value.value);
                let countryRes = countries.filter(e => e._id === result[0].address.country);
                if (countryRes.length <= 0) {
                    dispatch(openSnackBar({ status: "warning", message: t("msg_select_company") }));
                    return;
                }
                setUserData({ ...userData, street_name: result[0].address.street, postal_code: result[0].address.postalcode, city: result[0].address.city, country: { value: countryRes[0]._id, label: countryRes[0].name[`${globalState.language}`] } })
            }
        }
    };

    function validate() {
        const { first_name, last_name, street_name, postal_code, company, city, country, phone, email, user_role, password } = userData;
        if (!email) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_email") }))
            return false;
        } else if (!Validator.isEmail(email)) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_invalid_email") }))
            return false;
        } else if (!first_name) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_first_name") }))
            return false;
        } else if (!last_name) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_last_name") }))
            return false;
        } else if (!phone) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_phone") }))
            return false;
        } else if (!company) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_company") }))
            return false;
        } else if (!street_name) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_street") }))
            return false;
        } else if (!postal_code) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_postal") }))
            return false;
        } else if (!city) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_city") }))
            return false;
        } else if (!country) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_select_country") }))
            return false;
        } else if (!user_role) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_select_user_role") }))
            return false;
        }
        return true;
    }

    const saveUser = async () => {
        var validate_result = validate();

        if (validate_result) {
            const formData = new FormData();
            let search_field = createUserSearchText(userData);
            formData.append("search_field", search_field);
            formData.append("user_id", userInfo.id);
            for (let item in userData) {
                if (item === "country" || item === "company" || item === "user_role") {
                    formData.append(item, userData[item].value)
                } else {
                    formData.append(item, userData[item])
                }
            }
            avatarImage && formData.append("bottleImage", avatarImage);
            const res = await dispatch(modifyUser(props.user._id, formData))
            if (res !== false) {
                dispatch(openSnackBar({ message: t("msg_success_update_user"), status: 'success' }));
                await dispatch(getUsersByFilter(props.condition));
                close();
                return res;
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_user_exist") }));
            }
        }
    }

    const clickUseCompanyInfo = () => {
        const { company } = userData;
        if (company) {
            setUseCompanyInfo(!useCompanyInfo);
            if (!useCompanyInfo === true) {
                let result = companies.filter(e => e._id === company.value);
                let countryRes = countries.filter(e => e._id === result[0].address.country);
                if (countryRes.length > !0) {
                    dispatch(openSnackBar({ status: "warning", message: t("msg_select_company") }));
                    return;
                }
                setUserData({ ...userData, street_name: result[0].address.street, postal_code: result[0].address.postalcode, city: result[0].address.city, country: { value: countryRes[0]._id, label: countryRes[0].name[`${globalState.language}`] } })
            } else {
                setUserData({ ...userData, street_name: "", postal_code: "", city: "", country: "" })
            }
        } else {
            dispatch(openSnackBar({ status: "warning", message: t("msg_select_company") }));
            return;
        }
    }

    const openModal = () => {
        const { user } = props;
        // setProducer(producer);
        if (user) {
            const { role, firstname, lastname, address, email, avatar, phone, company } = user;

            setUserData({
                first_name: firstname ? firstname : "",
                last_name: lastname ? lastname : "",
                email: email ? email : "",
                phone: phone ? phone : "",
                company: company ? { value: company._id, label: company.name } : "",
                user_role: role ? { value: role, label: roles[role - 1] } : "",
                street_name: address?.street ? address?.street : "",
                postal_code: address?.postalcode ? address?.postalcode : "",
                city: address?.city ? address?.city : "",
                country: address?.country ? { value: address?.country._id, label: address?.country.name[`${globalState.language}`] } : "",
                password: ""
            });

            avatar ? setAvatarImage(`/public/${avatar.changed_name}`) : setAvatarImage(null);
            avatar ? setShowAvatarImage(`/public/${avatar.changed_name}`) : setShowAvatarImage(null);
            setModalShow(true);
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_select_user") }));
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
        setUserData({
            first_name: "",
            last_name: "",
            street_name: "",
            postal_code: "",
            city: "",
            country: "",
            company: "",
            phone: "",
            email: "",
            user_role: "",
            password: ""
        });
        setAvatarImage(null);
        setShowAvatarImage(null);
        setUseCompanyInfo(false);
    }

    return (
        <>
            <div onClick={() => openModal()} className="flex text-gray-600 p-1 cursor-pointer hover:bg-gray-100">
                <FaRegEdit className="h-5 w-5 ml-1 mr-2 text-gray-600" />
                {t("edit")}
            </div>
            <Modal
                show={modalShow}
                size="xl"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("update_new_user")}
                </Modal.Header>
                <hr />
                <Modal.Body className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                    {modifyUserState && <Loading />}
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("email")}
                        </div>
                        <TextInput
                            type="mail"
                            placeholder={t("email")}
                            required={true}
                            onChange={e => handleInputChange("email", e.target.value)}
                            value={userData.email}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6">
                            <div className="m-2 ml-2 text-sm block">
                                {t("first_name")}
                            </div>
                            <TextInput
                                type="text"
                                placeholder={t("first_name")}
                                required={true}
                                onChange={e => handleInputChange("first_name", e.target.value)}
                                value={userData.first_name}
                            />
                        </div>
                        <div className="col-span-6">
                            <div className="m-2 ml-2 text-sm block">
                                {t("last_name")}
                            </div>
                            <TextInput
                                type="text"
                                placeholder={t("last_name")}
                                required={true}
                                onChange={e => handleInputChange("last_name", e.target.value)}
                                value={userData.last_name}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("phone")}
                        </div>
                        <TextInput
                            type="phone"
                            placeholder={t("phone")}
                            required={true}
                            onChange={e => handleInputChange("phone", e.target.value)}
                            value={userData.phone}
                        />
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("company")}
                        </div>
                        <SelectCustomStyle>
                            <Select
                                value={userData.company}
                                onChange={value => handleInputChange("company", value)}
                                options={company_options}
                                isSearchable
                            />
                        </SelectCustomStyle>
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("new_password")}
                        </div>
                        <TextInput
                            type="password"
                            placeholder={t("new_password")}
                            required={true}
                            onChange={e => handleInputChange("password", e.target.value)}
                            value={userData.password}
                        />
                    </div>

                    <label className="inline-flex relative items-center cursor-pointer m-4">
                        <input type="checkbox" value="" onChange={() => clickUseCompanyInfo()} className="sr-only peer" checked={useCompanyInfo} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{t("use_company_address")}</span>
                    </label>

                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("street_name_number")}
                        </div>
                        <TextInput
                            type="text"
                            placeholder={t("street_name_number")}
                            required={true}
                            onChange={e => handleInputChange("street_name", e.target.value)}
                            value={userData.street_name}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <div className="m-2 ml-2 text-sm block">
                                {t("postal_code")}
                            </div>
                            <TextInput
                                type="text"
                                placeholder={t("postal_code")}
                                required={true}
                                onChange={e => handleInputChange("postal_code", e.target.value)}
                                value={userData.postal_code}
                            />
                        </div>
                        <div className="col-span-8">
                            <div className="m-2 ml-2 text-sm block">
                                {t("city")}
                            </div>
                            <TextInput
                                type="text"
                                placeholder={t("city")}
                                required={true}
                                onChange={e => handleInputChange("city", e.target.value)}
                                value={userData.city}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("country")}
                        </div>
                        <SelectCustomStyle>
                            <Select
                                value={userData.country}
                                onChange={value => handleInputChange("country", value)}
                                options={country_options}
                                isSearchable
                            />
                        </SelectCustomStyle>
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("user_role")}
                        </div>
                        <SelectCustomStyle>
                            <Select
                                value={userData.user_role}
                                onChange={value => handleInputChange("user_role", value)}
                                options={role_options}
                                isSearchable
                            />
                        </SelectCustomStyle>
                    </div>
                    <UploadImage
                        title={t("avatar_image")}
                        setImage={setAvatarImage}
                        showImage={showAvatarImage}
                        setShowImage={setShowAvatarImage}
                    />
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => saveUser()} outline={true} className="bg-sitebg-50" >
                                <HiOutlineBookOpen className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("save_user")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default User;
