import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegTimesCircle } from 'react-icons/fa';
import { HiOutlineArrowRight, HiOutlineSearch } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import styled from 'styled-components';
import swal from 'sweetalert2';
import { getAllProduct } from '../../redux/productReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import Loading from "../Global/Loading";
import CreateProduct from "./CreateProduct";
import CreateProductFromExist from "./CreateProductFromExist";

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`

function AddProduct(props) {
    const { t } = useTranslation();
    const { authState, globalState, productState, locationState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { products, getAllProductState } = productState;
    const nowDate = new Date();

    const { bottlesizes } = locationState;

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getProductTotalCount())
    }, [])

    const bottlesize_options = [];
    //bottlesize
    if (bottlesizes?.length > 0) {
        bottlesizes.map((data, index) => {
            bottlesize_options[index] = { value: data._id, label: data.bottle_size + data.unit }
        })
    }


    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [search, setSearch] = useState("");   //search bar text 
    const [searchResShow, setSearchResShow] = useState(false);
    const [producer, setProducer] = useState(props?.producer);
    const [condition, setCondition] = useState(props?.condition);
    const [product, setProduct] = useState("");
    const [showVintage, setShowVintage] = useState(false);
    const [showLatest, setShowLatest] = useState(false);
    const [vintage, setVintage] = useState("");
    const [vintage_options, setVintageOption] = useState([]);
    const [useLatest, setUseLatest] = useState(false);
    const [bottleSize, setBottleSize] = useState("");
    const [showBottleSize, setShowBottleSize] = useState(false);


    const changeSearch = (e) => {
        setSearch(e.target.value);
        setShowVintage(false);
        setUseLatest(false);
        setShowLatest(false);
        setShowBottleSize(false);
        setProduct("");
        setVintage("");
        setBottleSize("");

        dispatch(getAllProduct({ search: e.target.value, producer: producer._id, userInfo: JSON.stringify(userInfo) }));
        if (e.target.value) {
            setSearchResShow(true);
        } else {
            setSearchResShow(false);
        }
    }

    const selectProduct = (_id, name, vintage, data) => {
        setSearch(name);
        setSearchResShow(false);
        // setProduct({ _id, name, vintage });
        setProduct(data);
        if (data.product_type._id < 2) {
            setShowVintage(true);

            //vintage
            var tmp_vintage = [];
            tmp_vintage[0] = { value: 0, label: vintage === 0 ? "N/A*" : "N/A" };

            for (let i = nowDate.getFullYear() + 1; i >= 1900; i--) {
                if (i === vintage) {
                    tmp_vintage[nowDate.getFullYear() + 2 - i] = { value: i, label: i.toString() + "*" };
                }
                else {
                    tmp_vintage[nowDate.getFullYear() + 2 - i] = { value: i, label: i.toString() };
                }
            }
            setVintageOption(tmp_vintage);
        } else {
            setShowVintage(false);
        }
        //_id code here

    }

    const selectVintage = (value) => {
        setVintage(value);
        if (value.label.indexOf('*') === -1) {
            setShowBottleSize(false);
            setBottleSize("");
            setShowLatest(true)
            setUseLatest(false);
        } else {
            setShowBottleSize(true);
            setShowLatest(false)
            setUseLatest(true);
        }
    }

    const selectBottleSize = (value) => {
        setBottleSize(value);
    }

    // const nextProduct = () => {
    //     if (search) {

    //     } else {
    //         dispatch(openSnackBar({ status: "error", message: t("msg_select_product_create") }));

    //     }
    // }

    const openModal = async () => {
        const { producer, closePrevModal, type, condition } = props;
        if (type === "fromProducer") {
            const res = await closePrevModal();
            if (res !== false) {
                setModalShow(true);
                setProducer(res.producer);
            }
        } else if (type === "fromProduct") {
            if (producer) {
                closePrevModal();
                setModalShow(true);
                setProducer(producer);
                setCondition(condition);
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_select_producer_create") }));
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
        setSearch("");
        setSearchResShow(false);
        setShowVintage(false);
        setShowBottleSize(false);
        setShowLatest(false);
        setUseLatest(false);
        setProduct("");
        setVintage("");
        setBottleSize("");
    }

    return (
        <>
            <Button color={'red'} onClick={() => openModal()} className="bg-sitetx-100">
                {t("next")}
                <HiOutlineArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Modal
                show={modalShow}
                size="md"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("add_new_product")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div>
                        <div>
                            <div className="mb-4 ml-2 block">
                                <Label
                                    htmlFor="searchproduct"
                                    value="Search Product"
                                />
                            </div>
                            <TextInput
                                id="searchproduct"
                                type="search"
                                placeholder="Search Product"
                                required={true}
                                icon={HiOutlineSearch}
                                value={search}
                                onChange={(e) => changeSearch(e)}
                            />
                            {getAllProductState && <Loading />}
                            {
                                searchResShow && <>
                                    <div className="overflow-auto max-h-64">
                                        {products?.length > 0 && products.map((data, index) =>
                                            <div className="text-sm" key={index} onClick={() => selectProduct(data._id, data.product_name, data?.vintage, data)}>
                                                <div className="flex justify-between cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                                    <div className="flex-grow font-medium px-2 py-4">{data.product_name}</div>
                                                    {
                                                        data.product_type._id === 0 ? //wine
                                                            <div className="text-sm font-normal text-gray-500 tracking-wide">{data.wine_color.name + " wine, " + data.product_type.sub[data.category - 1][`${globalState.language}`]}</div>
                                                            :
                                                            <div className="text-sm font-normal text-gray-500 tracking-wide">{data.product_type.name + ", " + data.product_type.sub[data.category][`${globalState.language}`]}</div>

                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <CreateProduct producer={producer} closePrevModal={close} type="fromProduct" condition={props.condition} />

                                </>
                            }

                        </div>

                        <div className="mt-2 ml-2 text-sm block text-sitetx-100">
                            {t("not_product_create_new")}
                        </div>

                        {
                            showVintage &&
                            <div>
                                <div>
                                    <div className="m-2 ml-2 text-sm block">
                                        {t("vintage")}
                                    </div>
                                    <SelectCustomStyle>
                                        <Select
                                            value={vintage}
                                            onChange={value => selectVintage(value)}
                                            options={vintage_options}
                                            isSearchable
                                        />
                                    </SelectCustomStyle>
                                </div>
                                <div className="mt-2 ml-2 text-sm block text-sitetx-100">
                                    {t("vintage_mark")}
                                </div>
                            </div>
                        }
                        {
                            showLatest &&
                            <div className="flex items-center gap-2 ml-4 pt-4">
                                <Checkbox
                                    id="remember"
                                    checked={useLatest}
                                    onChange={() => setUseLatest(!useLatest)}
                                />
                                <Label htmlFor="remember">
                                    {t("vintage_copy")}
                                </Label>
                            </div>
                        }
                        {
                            (showBottleSize || useLatest) &&
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("bottle_size")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={bottleSize}
                                        onChange={value => selectBottleSize(value)}
                                        options={bottlesize_options}
                                    />
                                </SelectCustomStyle>
                            </div>
                        }
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button color={'red'} onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <CreateProductFromExist useLatest={useLatest} producer={producer} product={product} bottleSize={bottleSize} vintage={vintage} closePrevModal={close} condition={props.condition} />
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddProduct;
