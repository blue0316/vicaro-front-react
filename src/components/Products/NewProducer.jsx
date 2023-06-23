import { Button, Modal, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import swal from 'sweetalert2';
import { getAllCountry, getAllRegion } from '../../redux/locationReducer';
import { registerProducer } from '../../redux/producerReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import UploadImage from '../Global/UploadImage';
// import AddProduct from './AddProduct';
import { useTranslation } from "react-i18next";
import CreateProduct from './CreateProduct';

function Producer(props) {
    const { t } = useTranslation();
    const { authState, globalState, locationState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { countries, regions } = locationState;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCountry());
    }, []);

    /////////country/////////////////
    const country_options = [
        // { value: "0", label: "Germany" },
    ];
    if (countries?.length > 0) {
        countries.map((data, index) => {
            country_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }

    const [producer, setProducer] = useState("");
    const [producerName, setProducerName] = useState("");
    const [description, setDescription] = useState("");
    const [country, setCountry] = useState(null);
    const [region, setRegion] = useState(null);
    const [producerLogo, setProducerLogo] = useState(null);
    const [showProducerLogo, setShowProducerLogo] = useState(null);
    const [producerImage1, setProducerImage1] = useState(null);
    const [showProducerImage1, setShowProducerImage1] = useState(null);
    const [producerImage2, setProducerImage2] = useState(null);
    const [showProducerImage2, setShowProducerImage2] = useState(null);
    const [currentLengthOfDescription, setCurrentLengthOfDescription] = useState(0);
    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide

    const selectCountry = (value) => {
        console.log("value:", value);
        setCountry(value);
        setRegion(null);
        dispatch(getAllRegion(value.value));
    };
    /////////country/////////////////

    /////////region/////////////////
    const region_options = [
        // { value: "0", label: "de" },
    ];

    if (regions?.length > 0) {
        regions.map((data, index) => {
            region_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }


    const selectRegion = (value) => {
        console.log("value:", value);
        setRegion(value);
    };
    /////////country/////////////////

    const checkValidation = () => {
        if (!producerName) {
            dispatch(openSnackBar({ status: "error", message: t("msg_fill_product_name") }));
            return false;
        } else if (!country) {
            dispatch(openSnackBar({ status: "error", message: t("msg_fill_country") }));
            return false;
        } else if (regions?.length > 0 && !region) {
            dispatch(openSnackBar({ status: "error", message: t("msg_fill_region") }));
            return false;
        } else if (description.length > 450) {
            dispatch(openSnackBar({ status: "error", message: t("msg_description_length") }));
            return false;
        }
        return true
    }

    const addProducer = async () => {
        var isValid = checkValidation();
        if (isValid) {
            const { role } = userInfo;
            const formData = new FormData();
            formData.append("name", producerName);
            formData.append("country", country.value);
            formData.append("is_created_by_user", role);
            region && formData.append("region", region.value);
            description && formData.append("description", description);
            // producerLogo && formData.append("logo", producerLogo);

            let cnt = 0;
            if (producerLogo) {
                formData.append(`images[]`, producerLogo);
                formData.append("existLogo", cnt);
                cnt++
            }
            if (producerImage1) {
                formData.append(`images[]`, producerImage1);
                formData.append("existImage1", cnt);
                cnt++
            }
            if (producerImage2) {
                formData.append(`images[]`, producerImage2);
                formData.append("existImage2", cnt);
                cnt++
            }
            // formData.append("imgCount", cnt);
            const res = await dispatch(registerProducer(formData));
            if (res !== false) {
                dispatch(openSnackBar({ message: t("msg_success_add_producer"), status: 'success' }));
                close();
                setProducer(res);
                return res;
            } else {
                return false;
            }
        } else {
            return false;
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
        setCountry(null);
        setRegion(null);
        setDescription("");
        setProducerName("");
        setProducerLogo(null);
        setShowProducerLogo(null);
        setProducerImage1(null);
        setShowProducerImage1(null);
        setProducerImage2(null);
        setShowProducerImage2(null);
        setCurrentLengthOfDescription(0);
    }

    return (
        <>
            <div onClick={() => setModalShow(true)} className="flex justify-center text-sitetx-50 pt-4 pb-2 px-4 m-auto cursor-pointer">
                + {t("create_new_producer")}
            </div>
            <Modal
                show={modalShow}
                size="3xl"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header className="px-6 py-4">
                    {t("create_new_producer")}
                </Modal.Header>
                <hr />
                <Modal.Body className="overflow-y-auto !py-0" style={{ maxHeight: "50vh" }}>
                    <div className="py-4">
                        <div>
                            <div className="m-2 block">
                                {t("producer_name")}<span className='text-red-700'>*</span>
                            </div>
                            <TextInput
                                id="searchproducer"
                                type="text"
                                placeholder="Producer Name"
                                required={true}
                                value={producerName}
                                onChange={(e) => setProducerName(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="m-2 ml-2 block">
                                {t("country")}<span className='text-red-700'>*</span>
                            </div>
                            <Select
                                value={country}
                                onChange={selectCountry}
                                options={country_options}
                                isSearchable
                            />
                        </div>
                        <div>
                            <div className="m-2 ml-2 block">
                                {t("region")}<span className='text-red-700'>*</span>
                            </div>
                            <Select
                                value={region}
                                onChange={selectRegion}
                                options={region_options}
                                isSearchable
                                isDisabled={region_options?.length > 0 ? false : true}
                            />
                        </div>
                        <div>
                            <div className="m-2 ml-2 block">
                                {t("description")}
                            </div>
                            <Textarea
                                id="searchproducer"
                                type="text"
                                placeholder={t("description")}
                                rows={4}
                                value={description}
                                onChange={(e) => { setDescription(e.target.value); setCurrentLengthOfDescription(e.target.value.length) }}
                            />
                            <div className={`mt-2 ml-2 text-sm flex justify-between ${currentLengthOfDescription > 450 ? "text-red-600" : "text-sitetx-100"}`}>
                                <div>max. 450 {t("characters")}</div>
                                <div>{currentLengthOfDescription}/450</div>
                            </div>
                        </div>

                        <UploadImage
                            title={t("producer_logo")}
                            setImage={setProducerLogo}
                            setShowImage={setShowProducerLogo}
                            showImage={showProducerLogo}
                        />

                        <UploadImage
                            title={t("producer_image1")}
                            setImage={setProducerImage1}
                            setShowImage={setShowProducerImage1}
                            showImage={showProducerImage1}
                        />

                        <UploadImage
                            title={t("producer_image2")}
                            setImage={setProducerImage2}
                            setShowImage={setShowProducerImage2}
                            showImage={showProducerImage2}
                        />
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button color={'red'} onClick={() => setModalShow(false)} className="bg-white bg-opacity-0 text-sitetx-100 hover:text-white hover:!bg-sitebg-50 transition-color duration-150">
                                <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
                                {t("back")}
                            </Button>
                        </div>
                        <div>
                            <CreateProduct closePrevModal={props.closePrevModal} addProducer={addProducer} type="fromProducer" condition={props.condition} />
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Producer;
