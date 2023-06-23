import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { Button, Modal, Tabs, Accordion } from "flowbite-react"
import { HiOutlineFilter, HiOutlineTrash } from "react-icons/hi";
import Select from 'react-tailwindcss-select';
import swal from 'sweetalert2';
import styled from 'styled-components';
import MultiRange from "../Global/MultiRange";
import { useTranslation } from "react-i18next";

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	min-height: 42px
}
`

function AddFilter(props) {
    const { t } = useTranslation();
    const { globalState, locationState, producerState } = useSelector((state) => state);

    const { winecolors, bottlesizes, countries, total_regions, total_subregions, grapes, aromas, foods, allergies, closureTypes, tastes, global_product_types } = locationState;
    const { total_producers } = producerState;
    const nowDate = new Date();

    useEffect(() => {
    }, [])

    const [modalShow, setModalShow] = useState(false);
    const [filterData, setFilterData] = useState({
        // for Properties
        wine_color: null,
        wine_type: null,
        grape: null,
        taste: null,
        producer: null,
        spirit_sub_type: null,
        spirit_type: null,
        beer_type: null,
        country: null,
        region: null,
        sub_region: null,
        aroma: null,
        food: null,
        // for information
        vintage: null,
        allergy: null,
        closure_type: null,
        bottle_size: null,
        alc_vol: [0, 100],
        wine_acid: [0, 100],
        residual_sugar: [0, 100],

        product_type: "",
        article: "",
        fortified_wine_type: "",
        barrel_type: "",
    });

    //for properties
    const country_options = [];
    const region_options = [];
    const subregion_options = [];
    const winecolor_options = [];
    const winetype_options = [];
    const spirittype_options = [];
    const beertype_options = [];
    const taste_options = [];
    const grape_options = [];
    const aroma_options = [];
    const food_options = [];
    const producer_options = [];
    const spiritsubtype_options = [];
    //for information
    const vintage_options = [];
    const bottlesize_options = [];
    const allergy_options = [];
    const closureType_options = [];

    // country
    if (countries?.length > 0) {
        countries.map((data, index) => {
            country_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }
    // region
    if (total_regions?.length > 0) {
        total_regions.map((data, index) => {
            region_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }
    // subregion
    if (total_subregions?.length > 0) {
        total_subregions.map((data, index) => {
            subregion_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }
    //category & winetype & fortified
    if (global_product_types?.length > 0) {
        let wine_cnt = 0, spirit_cnt = 0, beer_cnt = 0, spiritsub_cnt = 0;
        global_product_types.map((data, index) => {
            if (data.product_type === 0 && data.sub_category === null) {
                winetype_options[wine_cnt] = { value: data._id, label: data[`${globalState.language}`] };
                wine_cnt++;
            }
            if (data.product_type === 1 && data.sub_category === null) {
                spirittype_options[spirit_cnt] = { value: data._id, label: data[`${globalState.language}`] };
                spirit_cnt++;
            }
            if (data.product_type === 2 && data.sub_category === null) {
                beertype_options[beer_cnt] = { value: data._id, label: data[`${globalState.language}`] };
                beer_cnt++;
            }
            if (data.product_type === 1 && data.sub_category >= 0 && data.category >= 0) {
                spiritsubtype_options[spiritsub_cnt] = { value: data._id, label: data[`${globalState.language}`] };
                spiritsub_cnt++;
            }
        })
    }
    //winecolor
    if (winecolors?.length > 0) {
        winecolors.map((data, index) => {
            winecolor_options[index] = { value: data._id, label: data.name }
        })
    }
    //tastes
    if (tastes?.length > 0) {
        tastes.map((data, index) => {
            taste_options[index] = { value: data._id, label: data[`${globalState.language}`] }
        })
    }
    //grape
    if (grapes?.length > 0) {
        grapes.map((data, index) => {
            grape_options[index] = { value: data._id, label: data[`${globalState.language}`] }
        })
    }
    //aroma
    if (aromas?.length > 0) {
        aromas.map((data, index) => {
            aroma_options[index] = { value: data._id, label: data[`${globalState.language}`] }
        })
    }
    //food
    if (foods?.length > 0) {
        foods.map((data, index) => {
            food_options[index] = { value: data._id, label: data[`${globalState.language}`] }
        })
    }
    //producer
    if (total_producers?.length > 0) {
        total_producers.map((data, index) => {
            producer_options[index] = { value: data._id, label: data.name }
        })
    }
    //vintage
    vintage_options[0] = { value: 0, label: "N/A" };
    for (let i = nowDate.getFullYear() + 1; i >= 1900; i--) {
        vintage_options[nowDate.getFullYear() + 2 - i] = { value: i, label: i.toString() };
    }
    //bottlesize
    if (bottlesizes?.length > 0) {
        bottlesizes.map((data, index) => {
            bottlesize_options[index] = { value: data._id, label: data.bottle_size + data.unit }
        })
    }
    //allergy
    if (allergies?.length > 0) {
        allergies.map((data, index) => {
            allergy_options[index] = { value: data._id, label: data[`${globalState.language}`] }
        })
    }
    //allergy
    if (closureTypes?.length > 0) {
        closureTypes.map((data, index) => {
            closureType_options[index] = { value: data._id, label: data[`${globalState.language}`] }
        })
    }

    const handleInputChange = (key, value) => {
        filterData[`${key}`] = value;
        setFilterData({ ...filterData });
    };

    const clearFilter = () => {
        setFilterData({
            wine_color: null,
            wine_type: null,
            grape: null,
            taste: null,
            producer: null,
            spirit_sub_type: null,
            spirit_type: null,
            beer_type: null,
            country: null,
            region: null,
            sub_region: null,
            aroma: null,
            food: null,

            vintage: null,
            allergy: null,
            closure_type: null,
            bottle_size: null,
            alc_vol: [0, 100],
            wine_acid: [0, 100],
            residual_sugar: [0, 100],
        });
    }

    const applyFilter = () => {
        clearFilter();
        props.addFilterArray(filterData);
        close();
    }

    const openModal = () => {
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
        clearFilter();
        setModalShow(false);
    }

    return (
        <>
            <div className="px-[13px] shadow-sm py-3 border border-[#E2E8F0] rounded-[4px]" style={{boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)'}} onClick={() => openModal()}>        
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.3999 15H7.3999C7.13469 15 6.88033 14.8946 6.6928 14.7071C6.50526 14.5196 6.3999 14.2652 6.3999 14C6.3999 13.7348 6.50526 13.4804 6.6928 13.2929C6.88033 13.1054 7.13469 13 7.3999 13H9.3999C9.66512 13 9.91947 13.1054 10.107 13.2929C10.2945 13.4804 10.3999 13.7348 10.3999 14C10.3999 14.2652 10.2945 14.5196 10.107 14.7071C9.91947 14.8946 9.66512 15 9.3999 15ZM11.3999 11H5.3999C5.13469 11 4.88033 10.8946 4.6928 10.7071C4.50526 10.5196 4.3999 10.2652 4.3999 10C4.3999 9.73478 4.50526 9.48043 4.6928 9.29289C4.88033 9.10536 5.13469 9 5.3999 9H11.3999C11.6651 9 11.9195 9.10536 12.107 9.29289C12.2945 9.48043 12.3999 9.73478 12.3999 10C12.3999 10.2652 12.2945 10.5196 12.107 10.7071C11.9195 10.8946 11.6651 11 11.3999 11ZM13.3999 7H3.3999C3.13469 7 2.88033 6.89464 2.6928 6.70711C2.50526 6.51957 2.3999 6.26522 2.3999 6C2.3999 5.73478 2.50526 5.48043 2.6928 5.29289C2.88033 5.10536 3.13469 5 3.3999 5H13.3999C13.6651 5 13.9195 5.10536 14.107 5.29289C14.2945 5.48043 14.3999 5.73478 14.3999 6C14.3999 6.26522 14.2945 6.51957 14.107 6.70711C13.9195 6.89464 13.6651 7 13.3999 7ZM15.3999 3H1.3999C1.13469 3 0.880332 2.89464 0.692796 2.70711C0.505259 2.51957 0.399902 2.26522 0.399902 2C0.399902 1.73478 0.505259 1.48043 0.692796 1.29289C0.880332 1.10536 1.13469 1 1.3999 1H15.3999C15.6651 1 15.9195 1.10536 16.107 1.29289C16.2945 1.48043 16.3999 1.73478 16.3999 2C16.3999 2.26522 16.2945 2.51957 16.107 2.70711C15.9195 2.89464 15.6651 3 15.3999 3Z" fill="#64748B"/>
                </svg>
                <span className="sr-only">{t("add_filter")}</span>
            </div>
            <Modal
                show={modalShow}
                size="3xl"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header className="px-6 py-4">
                    {t("filters")}
                </Modal.Header>
                <hr />
                <Modal.Body className="overflow-y-auto !py-0" style={{ height: "50vh" }}>
                    <Tabs.Group
                        className="pt-1"
                        aria-label="Tabs with underline"
                        style="underline"
                    >
                        <Tabs.Item
                            active={true}
                            title="Properties"
                            className="w-2/5"
                        >
                            <Accordion alwaysOpen={true} flush={true}>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("wine")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.wine_color}
                                                    onChange={(value) => handleInputChange("wine_color", value)}
                                                    options={winecolor_options}
                                                    placeholder="Wine Color"
                                                    isMultiple
                                                    isClearable
                                                />

                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.wine_type}
                                                    onChange={value => handleInputChange("wine_type", value)}
                                                    options={winetype_options}
                                                    placeholder="Wine Type"
                                                    isMultiple
                                                    isClearable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.taste}
                                                    onChange={value => handleInputChange("taste", value)}
                                                    options={taste_options}
                                                    placeholder="Wine Taste"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.grape}
                                                    onChange={value => handleInputChange("grape", value)}
                                                    options={grape_options}
                                                    placeholder="Grape Variaties"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("spirit")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.spirit_type}
                                                    onChange={value => handleInputChange("spirit_type", value)}
                                                    options={spirittype_options}
                                                    placeholder={t("spirit_type")}
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.spirit_sub_type}
                                                    onChange={value => handleInputChange("spirit_sub_type", value)}
                                                    options={spiritsubtype_options}
                                                    placeholder="Spirit-SubType"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("beer")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.beer_type}
                                                    onChange={value => handleInputChange("beer_type", value)}
                                                    options={beertype_options}
                                                    placeholder={t("beer_type")}
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("origin")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.producer}
                                                    onChange={value => handleInputChange("producer", value)}
                                                    options={producer_options}
                                                    placeholder="Producer"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.country}
                                                    onChange={value => handleInputChange("country", value)}
                                                    options={country_options}
                                                    placeholder="Country"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.region}
                                                    onChange={value => handleInputChange("region", value)}
                                                    options={region_options}
                                                    placeholder="Region"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.sub_region}
                                                    onChange={value => handleInputChange("sub_region", value)}
                                                    options={subregion_options}
                                                    placeholder="Subregion"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("sensorics")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.aroma}
                                                    onChange={value => handleInputChange("aroma", value)}
                                                    options={aroma_options}
                                                    placeholder="Aroma"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.food}
                                                    onChange={value => handleInputChange("food", value)}
                                                    options={food_options}
                                                    placeholder="Food-Pairing"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                            </Accordion>
                        </Tabs.Item>
                        <Tabs.Item
                            className="w-2/5"
                            title="Information"
                        >
                            <Accordion alwaysOpen={true} flush={true}>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("version_info")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.vintage}
                                                    onChange={(value) => handleInputChange("vintage", value)}
                                                    options={vintage_options}
                                                    placeholder="Vintage"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.bottle_size}
                                                    onChange={(value) => handleInputChange("bottle_size", value)}
                                                    options={bottlesize_options}
                                                    placeholder={t("bottle_size")}
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.closure_type}
                                                    onChange={(value) => handleInputChange("closure_type", value)}
                                                    options={closureType_options}
                                                    placeholder="Closure Type"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                        <div className="py-2">
                                            <SelectCustomStyle>
                                                <Select
                                                    value={filterData.allergy}
                                                    onChange={(value) => handleInputChange("allergy", value)}
                                                    options={allergy_options}
                                                    placeholder="Allergies"
                                                    isMultiple
                                                    isClearable
                                                    isSearchable
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                                <Accordion.Panel>
                                    <Accordion.Title>
                                        {t("analyse")}
                                    </Accordion.Title>
                                    <Accordion.Content>
                                        <div className="py-4">
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("alcohol_vol")}
                                            </div>
                                            <MultiRange type="alc_vol" value={filterData.alc_vol} setValue={handleInputChange} />
                                        </div>
                                        <div className="py-4">
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("wine_acid_gl")}
                                            </div>
                                            <MultiRange type="wine_acid" value={filterData.wine_acid} setValue={handleInputChange} />
                                        </div>
                                        <div className="py-4">
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("residual_sugar_gl")}
                                            </div>
                                            <MultiRange type="residual_sugar" value={filterData.residual_sugar} setValue={handleInputChange} />
                                        </div>
                                    </Accordion.Content>
                                </Accordion.Panel>
                            </Accordion>
                        </Tabs.Item>
                    </Tabs.Group>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button color={'red'}
                                className="!bg-sitebg-50 text-white hover:!bg-sitebg-300 transition-color duration-150"
                                onClick={() => clearFilter()}
                            >
                                <HiOutlineTrash className="mr-2 h-5 w-5" />
                                {t("clear_filter")}
                            </Button>
                        </div>
                        <div>
                            <Button color={'red'}
                                onClick={() => applyFilter()}
                            >
                                <HiOutlineFilter className="mr-2 h-5 w-5 text-sitebg-50 transition-color duration-150" />
                                {t("apply_filter")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddFilter;
