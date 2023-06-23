import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Textarea, TextInput, Tabs } from "flowbite-react"
import Select from 'react-tailwindcss-select';
import { HiOutlineTrash, HiOutlineDocumentAdd, HiOutlineCube } from "react-icons/hi";
// import { getAllRegion, getAllSubRegion } from '../../redux/locationReducer';
// import { openSnackBar } from '../../redux/snackBarReducer';
import UploadImage from './Global/UploadImage';
// import { createProductSearchText } from '../../utils'
import swal from 'sweetalert2';
import styled from 'styled-components';
import { useTranslation } from "react-i18next";

export const SelectGrapeStyle = styled.div`
p.truncate{
    width: 65px;
}
div.relative.w-full{
	width: 142px;
}	
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`
export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`

function OrderDetail(props) {
    const { t } = useTranslation();
    const { globalState, locationState } = useSelector((state) => state);
    const { countries } = locationState;
    const nowDate = new Date();

    const dispatch = useDispatch();

    useEffect(() => {
    }, [])

    /////////select/////////////////
    const country_options = [];

    // country
    if (countries?.length > 0) {
        countries.map((data, index) => {
            country_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }

    const [modalShow, setModalShow] = useState(false);
    const [logoImage, setLogoImage] = useState(null);
    const [showLogoImage, setShowLogoImage] = useState(null);
    const [currentLengthOfFooter, setCurrentLengthOfFooter] = useState(0);
    const [useMyInfo, setUseMyInfo] = useState(false);

    const [orderData, setOrderData] = useState({
        project_name: "",
        amount: "",
        first_name: "",
        last_name: "",
        street_name: "",
        postal_code: "",
        city: "",
        country: "",
        menu_format: "",
        paper_size: "",
        finish: "",
        cover_title: "",
        footer_text: "",
        order_details: ""
    });

    function validate() {
        
    }

    const createProduct = async () => {
        var validate_result = validate();

        if (validate_result) {
            
        }

    }

    const handleInputChange = (key, value) => {
        orderData[`${key}`] = value;
        setOrderData({ ...orderData });
    };

    const openModal = async () => {
        
        setModalShow(true);
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
        setOrderData({
            project_name: "",
            amount: "",
            first_name: "",
            last_name: "",
            street_name: "",
            postal_code: "",
            city: "",
            country: "",
            menu_format: "",
            paper_size: "",
            finish: "",
            cover_title: "",
            footer_text: "",
            order_details: ""
        });
        setLogoImage(null);
        setShowLogoImage(null);
    }

    const clickUseMyInfo = () => {
        setUseMyInfo(!useMyInfo);
        if (!useMyInfo === true) {
            // let result = companies.filter(e => e._id === company.value);
            // let countryRes = countries.filter(e => e._id === result[0].address.country);
            // if (countryRes.length > !0) {
            //     dispatch(openSnackBar({ status: "warning", message: t("msg_select_company") }));
            //     return;
            // }
            // setUserData({ ...orderData, street_name: result[0].address.street, postal_code: result[0].address.postalcode, city: result[0].address.city, country: { value: countryRes[0]._id, label: countryRes[0].name[`${globalState.language}`] } })
        } else {
            // setUserData({ ...orderData, street_name: "", postal_code: "", city: "", country: "" })
        }
    }

    return (
        <>
            <div className=" pr-4">
                <Button onClick={() => openModal()} className="bg-sitetx-100">
                    <HiOutlineCube className="mr-2 h-5 w-5" />
                    {t("order_detail")}
                </Button>
            </div>
            <Modal
                show={modalShow}
                size="lg"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("order_detail")}
                </Modal.Header>
                <hr />
                <Modal.Body className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("order_project_name")}<span className='text-red-700'>*</span>
                        </div>
                        <TextInput
                            type="text"
                            onChange={e => handleInputChange("project_name", e.target.value)}
                            // placeholder="Producer Name"
                            value={orderData.project_name}
                        />
                    </div>
                    
                    <Tabs.Group
                        className="justify-center pt-4"
                        aria-label="Tabs with underline"
                        // onClick={e => setSelectedTab(e.target.innerText)}
                        style="underline"
                    >
                        <Tabs.Item
                            active={true}
                            title={t("shipping")}
                            className="w-2/5"
                        >
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("amount")}
                                </div>
                                <TextInput
                                    type="text"
                                    placeholder={t("amount")}
                                    required={true}
                                    onChange={e => handleInputChange("amount", e.target.value)}
                                    value={orderData.amount}
                                />
                            </div>

                            <label className="inline-flex relative items-center cursor-pointer m-4">
                                <input type="checkbox" value="" onChange={() => clickUseMyInfo()} className="sr-only peer" checked={useMyInfo} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{t("ship_to_my_address")}</span>
                            </label>
                            
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
                                        value={orderData.first_name}
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
                                        value={orderData.last_name}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("street_name_number")}
                                </div>
                                <TextInput
                                    type="text"
                                    placeholder={t("street_name_number")}
                                    required={true}
                                    onChange={e => handleInputChange("street_name", e.target.value)}
                                    value={orderData.street_name}
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
                                        value={orderData.postal_code}
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
                                        value={orderData.city}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("country")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={orderData.country}
                                        onChange={value => handleInputChange("country", value)}
                                        options={country_options}
                                        isSearchable
                                    />
                                </SelectCustomStyle>
                            </div>

                        </Tabs.Item>
                        <Tabs.Item
                            // active={selectedTab === "Advanced"}
                            className="w-2/5"
                            title={t("design")}
                        >
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("menu_format")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={orderData.menu_format}
                                        onChange={value => handleInputChange("menu_format", value)}
                                        options={country_options}
                                        isSearchable
                                    />
                                </SelectCustomStyle>
                            </div>

                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("paper_size")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={orderData.paper_size}
                                        onChange={value => handleInputChange("paper_size", value)}
                                        options={country_options}
                                        isSearchable
                                    />
                                </SelectCustomStyle>
                            </div>

                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("finish")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={orderData.finish}
                                        onChange={value => handleInputChange("finish", value)}
                                        options={country_options}
                                        isSearchable
                                    />
                                </SelectCustomStyle>
                            </div>

                            <UploadImage
                                title={t("restaurant_image")}
                                setImage={setLogoImage}
                                showImage={showLogoImage}
                                setShowImage={setShowLogoImage}
                            />

                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("cover_title")}
                                </div>
                                <TextInput
                                    type="text"
                                    placeholder={t("cover_title")}
                                    required={true}
                                    onChange={e => handleInputChange("cover_title", e.target.value)}
                                    value={orderData.cover_title}
                                />
                            </div>

                            <div>
                                <div className="m-2 ml-2 block">
                                    {t("footer_text")}
                                </div>
                                <Textarea
                                    id="searchproducer"
                                    type="text"
                                    placeholder={t("footer_text")}
                                    rows={4}
                                    value={orderData.footer_text}
                                    onChange={(e) => { handleInputChange("footer_text", e.target.value); setCurrentLengthOfFooter(e.target.value.length) }}
                                />
                                <div className={`mt-2 ml-2 text-sm flex justify-between ${currentLengthOfFooter > 100 ? "text-red-600" : "text-sitetx-100"}`}>
                                    <div>max. 100 {t("characters")}</div>
                                    <div>{currentLengthOfFooter}/100</div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="m-2 ml-2 block">
                                    {t("order_details")}
                                </div>
                                <Textarea
                                    id="searchproducer"
                                    type="text"
                                    placeholder={t("order_details")}
                                    rows={4}
                                    value={orderData.order_details}
                                    onChange={(e) => handleInputChange("order_details", e.target.value)}
                                />
                                {/* <div className={`mt-2 ml-2 text-sm flex justify-between ${currentLengthOfFooter > 100 ? "text-red-600" : "text-sitetx-100"}`}>
                                    <div>max. 100 {t("characters")}</div>
                                    <div>{currentLengthOfFooter}/100</div>
                                </div> */}
                            </div>

                        </Tabs.Item>
                    </Tabs.Group>

                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <HiOutlineTrash className="mr-2 h-5 w-5" />
                                {t("clear_order_detail")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => createProduct()} className="bg-sitebg-300">
                                {t("save_order_detail")}
                                <HiOutlineDocumentAdd className="ml-2 h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OrderDetail;
