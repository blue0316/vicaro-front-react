import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, TextInput } from "flowbite-react"
import { HiOutlineDocumentAdd, HiOutlineBookOpen } from "react-icons/hi";
import { FaRegTimesCircle } from 'react-icons/fa';
import { getCompanyTotalCount, getCompaniesByFilter, registerCompany } from '../../redux/companyReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import { createCompanySearchText } from '../../utils'
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

function Company(props) {
    const { t } = useTranslation();
    const { authState, globalState, companyState, locationState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { registerCompanyState } = companyState;
    const { companyCondition } = globalState;
    const { countries } = locationState;

    const dispatch = useDispatch();

    useEffect(() => {
    }, [])


    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [logoImage, setLogoImage] = useState(null);
    const [showLogoImage, setShowLogoImage] = useState(null);
    const [companyData, setCompanyData] = useState({
        company_name: "",
        street_name: "",
        postal_code: "",
        city: "",
        country: "",
        phone: "",
        email: ""
    });

    const country_options = [];

    // country
    if (countries?.length > 0) {
        countries.map((data, index) => {
            country_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }

    const handleInputChange = (key, value) => {
        companyData[`${key}`] = value;
        setCompanyData({ ...companyData });
    };

    function validate() {
        const { company_name, street_name, postal_code, city, country, phone, email } = companyData;
        if (!company_name) {
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
        } else if (!email) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_email") }))
            return false;
        } else if (!Validator.isEmail(email)) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_invalid_email") }))
            return false;
        } else if (!phone) {
            dispatch(openSnackBar({ status: "warning", message: t("msg_fill_phone") }))
            return false;
        }
        return true;
    }

    const createCompany = async () => {
        var validate_result = validate();

        if (validate_result) {
            const formData = new FormData();
            let search_field = createCompanySearchText(companyData);
            formData.append("search_field", search_field);
            formData.append("user_id", companyCondition.user_id);
            for (let item in companyData) {
                if (item !== "country") {
                    formData.append(item, companyData[item])
                } else {
                    formData.append(item, companyData[item].value)
                }
            }
            logoImage && formData.append("bottleImage", logoImage);
            const res = await dispatch(registerCompany(formData))
            if (res !== false) {
                dispatch(openSnackBar({ message: t("msg_success_create_company"), status: 'success' }));
                await dispatch(getCompaniesByFilter(props.condition));
                await dispatch(getCompanyTotalCount(props.condition));
                close();
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_company_exist") }));
            }
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
        setCompanyData({
            company_name: "",
            street_name: "",
            postal_code: "",
            city: "",
            country: "",
            phone: "",
            email: ""
        });
        setLogoImage(null);
        setShowLogoImage(null);
    }

    return (
        <>
            <Button color={'red'} onClick={() => setModalShow(true)} outline={true} className="bg-sitebg-50" disabled={userInfo?.role === 0 ? false : true} >
                <HiOutlineDocumentAdd className="mr-2 h-6 w-6 text-sitebg-50" />
                Create new Company
            </Button>
            <Modal
                show={modalShow}
                size="md"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    Create new Company
                </Modal.Header>
                <hr />
                <Modal.Body>
                    {registerCompanyState && <Loading />}
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            Company Name
                        </div>
                        <TextInput
                            type="text"
                            placeholder="Company Name"
                            required={true}
                            onChange={e => handleInputChange("company_name", e.target.value)}
                            value={companyData.company_name}
                        />
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            Street Name & Number
                        </div>
                        <TextInput
                            type="text"
                            placeholder="Street Name & Number"
                            required={true}
                            onChange={e => handleInputChange("street_name", e.target.value)}
                            value={companyData.street_name}
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-4">
                            <div className="m-2 ml-2 text-sm block">
                                Postal-Code
                            </div>
                            <TextInput
                                type="text"
                                placeholder="Postal-Code"
                                required={true}
                                onChange={e => handleInputChange("postal_code", e.target.value)}
                                value={companyData.postal_code}
                            />
                        </div>
                        <div className="col-span-8">
                            <div className="m-2 ml-2 text-sm block">
                                City
                            </div>
                            <TextInput
                                type="text"
                                placeholder="City"
                                required={true}
                                onChange={e => handleInputChange("city", e.target.value)}
                                value={companyData.city}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            Country
                        </div>
                        <SelectCustomStyle>
                            <Select
                                value={companyData.country}
                                onChange={value => handleInputChange("country", value)}
                                options={country_options}
                                isSearchable
                            />
                        </SelectCustomStyle>
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("email")}
                        </div>
                        <TextInput
                            type="mail"
                            placeholder="e-mail"
                            required={true}
                            onChange={e => handleInputChange("email", e.target.value)}
                            value={companyData.email}
                        />
                    </div>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            Phone
                        </div>
                        <TextInput
                            type="phone"
                            placeholder="Phone"
                            required={true}
                            onChange={e => handleInputChange("phone", e.target.value)}
                            value={companyData.phone}
                        />
                    </div>
                    <UploadImage
                        title={t("logo_image")}
                        setImage={setLogoImage}
                        showImage={showLogoImage}
                        setShowImage={setShowLogoImage}
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
                            <Button onClick={() => createCompany()} outline={true} className="bg-sitebg-50" >
                                <HiOutlineBookOpen className="mr-2 h-6 w-6 text-sitebg-50" />
                                Create new Company
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Company;
