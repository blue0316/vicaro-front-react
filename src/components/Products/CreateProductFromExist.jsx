import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, Textarea, TextInput, Tabs } from "flowbite-react"
import Select from 'react-tailwindcss-select';
import { HiOutlineTrash, HiOutlineDocumentAdd, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowRight } from "react-icons/hi";
import { getAllRegion, getAllSubRegion, } from '../../redux/locationReducer';
import { registerProduct, getProductsByFilter } from '../../redux/productReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import UploadImage from '../Global/UploadImage';
import MultiData from '../Global/MultiData';
import { createProductSearchText } from '../../utils'
import swal from 'sweetalert2';
import { useTranslation } from "react-i18next";
import styled from 'styled-components';

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

function CreateProduct(props) {
    const { t } = useTranslation();
    const { globalState, locationState } = useSelector((state) => state);
    const { categories, winecolors, bottlesizes, countries, regions, subregions, grapes, aromas, foods, allergies, closureTypes } = locationState;
    const nowDate = new Date();

    const dispatch = useDispatch();

    useEffect(() => {
    }, [])

    /////////select/////////////////
    const country_options = [];
    const region_options = [];
    // const subregion_options = [];
    const category_options = [];
    const winecolor_options = [];
    const winetype_options = [];
    const fortified_options = [];
    const spirittype_options = [];
    const beertype_options = [];
    const vintage_options = [];
    const bottlesize_options = [];
    const grape_options = [];
    const aroma_options = [];
    const food_options = [];
    const allergy_options = [];
    const closureType_options = [];

    // country
    if (countries?.length > 0) {
        countries.map((data, index) => {
            country_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }
    // region
    if (regions?.length > 0) {
        regions.map((data, index) => {
            region_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
        })
    }
    // subregion
    // if (subregions?.length > 0) {
    //     subregions.map((data, index) => {
    //         subregion_options[index] = { value: data._id, label: data.name[`${globalState.language}`] }
    //     })
    // }
    //category & winetype & fortified
    if (categories?.length > 0) {
        categories.map((data, index) => {
            category_options[index] = { value: data._id, label: data.name };
            if (data._id === 0) { //wine
                data.sub.map((wine_type, i) => {
                    winetype_options[i] = { value: wine_type.index, label: wine_type[`${globalState.language}`] };
                    if (wine_type.sub.length > 0) {
                        wine_type.sub.map((forti, inc) => {
                            fortified_options[inc] = { value: inc, label: forti };
                        })
                    }
                })
            }
            if (data._id === 1) { //spirit
                data.sub.map((spirit, i) => {
                    spirittype_options[i] = { value: i, label: spirit[`${globalState.language}`] };
                })
            }
            if (data._id === 2) { //beer
                data.sub.map((beer, i) => {
                    beertype_options[i] = { value: i, label: beer[`${globalState.language}`] };
                })
            }
        })
    }
    //winecolor
    if (winecolors?.length > 0) {
        winecolors.map((data, index) => {
            winecolor_options[index] = { value: data._id, label: data.name }
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

    const [modalShow, setModalShow] = useState(false);
    const [overStyle, setOverStyle] = useState(false);
    const [producer, setProducer] = useState(props?.producer);
    const [product, setProduct] = useState(props?.product);
    const [showSubSpirit, setShowSubSpirit] = useState(false);
    const [showRegionSelect, setShowRegionSelect] = useState(false);
    const [showSubRegionSelect, setShowSubRegionSelect] = useState(false);
    const [spiritsubtype_options, setSpiritSubTypeOptions] = useState([]);
    // const [productType, setProductType] = useState("");
    const [bottleImage, setBottleImages] = useState(null);
    const [showBottleImage, setShowBottleImages] = useState(null);
    const [grape, setGrape] = useState("");
    const [percentage, setPercentage] = useState("");
    const [taste_options, setTasteOption] = useState([]);
    const [currentLengthOfDescription, setCurrentLengthOfDescription] = useState(0);

    const [productData, setProductData] = useState({
        product_name: "",
        producer_name: "",
        product_type: "",
        // for wine
        wine_color: "",
        wine_type: "",
        fortified_wine_type: "",
        variaty: [],
        barrel_type: "",
        wine_acid: "",
        // for spirit
        spirit_sub_type: "",
        spirit_type: "",
        //for beer
        beer_type: "",
        // for wine & spirit
        vintage: "",
        taste: "",
        //for all
        bottle_size: "",
        article: "",
        // for basic
        country: "",
        region: "",
        // sub_region: "",
        description: "",
        // for advanced
        alc_vol: "",
        aroma: [],
        food: [],
        allergy: [],
        closure_type: "",
        residual_sugar: "",
    });

    const selectCountry = (value) => {
        if (value.value) {
            dispatch(getAllRegion(value.value));
            setShowRegionSelect(true);

            setShowSubRegionSelect(false)
            productData.region = "";
            // productData.sub_region = "";
            setProductData({ ...productData });
        }
    };

    const selectRegion = (value) => {
        if (value.value) {
            dispatch(getAllSubRegion(productData.country.value, value.value));
            setShowSubRegionSelect(true)

            // productData.sub_region = "";
            setProductData({ ...productData });
        }
    };

    const selectSpiritType = (value) => {
        productData.spirit_type = value;
        setProductData({ ...productData });

        setShowSubSpirit(categories[1].sub[value.value]?.is_sub);
        // subregion
        if (categories[1].sub[value.value].sub?.length > 0) {
            categories[1].sub[value.value].sub.map((data, index) => {
                spiritsubtype_options[index] = { value: index, label: data }
            })
            setSpiritSubTypeOptions([...spiritsubtype_options]);
        }
    }

    //begin for variaty
    const removeGrapeVariaty = () => {
        setGrape("");
        setPercentage("");
    }

    const addGrapeVariaty = () => {
        var flag = false;
        if (grape) {
            const { variaty } = productData;
            variaty.map((data, i) => {
                if (data.grape.value === grape.value) {
                    flag = true;
                    setGrape("");
                    dispatch(openSnackBar({ status: "error", message: `${t("msg_already_exist")} ${grape.label.toLowerCase()} ${t("msg_in_grape_variety")}` }));
                }
            })

            if (!flag) {
                productData.variaty = [...productData.variaty, { grape: grape, percentage: percentage }];
                setProductData({ ...productData });

                setGrape("");
                setPercentage("");
            }

        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_select_grape_name") }));
        }
    }

    const setExistVariate = (type, index, value) => {
        const { variaty } = productData;
        var flag = false;
        if (type === "remove") {
            variaty.splice(index, 1);
        } else {
            if (type === "grape") {
                variaty?.map((data, i) => {
                    if (data.grape.value === value.value) {
                        flag = true;
                        // setGrape("");
                        dispatch(openSnackBar({ status: "error", message: `${t("msg_already_exist")} ${value.label.toLowerCase()} ${t("msg_in_grape_variety")}` }));
                    }
                })
                if (!flag) {
                    variaty[index][`${type}`] = value;
                }
            } else {
                variaty[index][`${type}`] = value;
            }
        }
        productData.variaty = variaty;
        setProductData({ ...productData });
    }
    //end for variaty

    //begin for template
    const addMultiData = (title, value) => {
        let item = title.toLowerCase();
        productData[`${item}`] = [...productData[`${item}`], value];
        setProductData({ ...productData });
    }

    const setExistData = (title, type, value, index) => {
        let item = title.toLowerCase();
        var flag = false;

        if (type === "remove") {
            productData[`${item}`].splice(value, 1);
        } else if (type === "change") {
            productData[`${item}`].map((data, i) => {
                if (data.value === value.value) {
                    flag = true;
                    // setGrape("");
                    dispatch(openSnackBar({ status: "error", message: `${t("msg_already_exist")} ${value.label.toLowerCase()} in ${title.toLowerCase()}` }));
                }
            })
            if (!flag) {
                productData[`${item}`][index] = value;
            }
        }

        setProductData({ ...productData });
    }
    //end for template

    // we need to init the filled data
    const clickProductType = (value) => {
        // setProductData({
        //     // product_name: "",
        //     // for wine
        //     // wine_color: "",
        //     wine_type: "",
        //     fortified_wine_type: "",
        //     variaty: [],
        //     barrel_type: "",
        //     wine_acid: "",
        //     // for spirit
        //     spirit_sub_type: "",
        //     spirit_type: "",
        //     //for beer
        //     beer_type: "",
        //     // for wine & spirit
        //     vintage: "",
        //     //for all
        //     bottle_size: "",
        //     article: "",
        //     // for basic
        //     country: "",
        //     region: "",
        //     sub_region: "",
        //     description: "",
        //     // for advanced
        //     alc_vol: "",
        //     aroma: [],
        //     food: [],
        //     allergy: [],
        //     closure_type: "",
        //     residual_sugar: ""
        // });

        productData.product_type = value;
        setProductData({ ...productData });

        setShowRegionSelect(false);
        setShowSubRegionSelect(false);
        setBottleImages(null);
        setShowBottleImages(null);
        // setProductType(value)
        setCurrentLengthOfDescription(0);
    }

    const selectWineType = (value) => {
        handleInputChange("wine_type", value)
        var tmp_taste = [];
        categories[0].sub[value.value - 1].taste.map((data, index) => {
            tmp_taste[index] = { value: index, label: data }
        })
        setTasteOption(tmp_taste);
    }

    function validate() {
        if (productData.product_type.value === 0) {// wine
            const { product_name, wine_color, wine_type, bottle_size, country, region, description } = productData;
            if (!product_name) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_fill_product_name") }))
                return false;
            } else if (!wine_color) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_wine_color") }))
                return false;
            } else if (!wine_type) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_wine_type") }))
                return false;
            } else if (!bottle_size) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_bottle_size") }))
                return false;
            } else if (!country) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_country") }))
                return false;
            } else if (!region) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_region") }))
                return false;
            } else if (description.length > 450) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_description_length") }))
                return false;
            }
            return true;
        } else if (productData.product_type.value === 1) { // spirit
            const { product_name, spirit_type, bottle_size, country, region, description } = productData;
            if (!product_name) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_fill_product_name") }))
                return false;
            } else if (!spirit_type) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_spirit_type") }))
                return false;
            } else if (!bottle_size) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_bottle_size") }))
                return false;
            } else if (!country) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_country") }))
                return false;
            } else if (!region) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_region") }))
                return false;
            } else if (description.length > 450) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_description_length") }))
                return false;
            }
            return true;
        } else if (productData.product_type.value === 2) { // beer
            const { product_name, beer_type, bottle_size, country, region, description } = productData;
            if (!product_name) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_fill_product_name") }))
                return false;
            } else if (!beer_type) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_beer_type") }))
                return false;
            } else if (!bottle_size) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_bottle_size") }))
                return false;
            } else if (!country) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_country") }))
                return false;
            } else if (!region) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_select_region") }))
                return false;
            } else if (description.length > 450) {
                dispatch(openSnackBar({ status: "warning", message: t("msg_description_length") }))
                return false;
            }
            return true;
        } else if (productData.product_type.value === 3) {  // other

        }
    }

    const createProduct = async () => {
        var validate_result = validate();

        if (validate_result) {
            const formData = new FormData();

            const { product_name, wine_color, wine_type, spirit_type, spirit_sub_type, beer_type, fortified_wine_type, vintage, bottle_size, article,
                country, region, sub_region, variaty, description, alc_vol, aroma, food, barrel_type, taste, residual_sugar, wine_acid,
                closure_type, allergy } = productData;
            // const { producer } = props;

            var searchText = createProductSearchText(productData, producer, productData.product_type);

            var grape_variaty = [];
            if (variaty?.length > 0) {
                variaty.map((data, index) => {
                    grape_variaty[index] = { grape: data.grape.value, percentage: data?.percentage };
                })
            }

            var aroma_send = [];
            if (aroma.length > 0) {
                aroma.map((data, index) => {
                    aroma_send[index] = data.value;
                })
            }

            var food_send = [];
            if (food.length > 0) {
                food.map((data, index) => {
                    food_send[index] = data.value;
                })
            }

            var allergy_send = [];
            if (allergy.length > 0) {
                allergy.map((data, index) => {
                    allergy_send[index] = data.value;
                })
            }

            formData.append("role", globalState.condition.role);
            formData.append("company", globalState.condition.company);
            formData.append("isGlobal", globalState.condition.isGlobal);
            formData.append("user_id", globalState.condition.user_id);
            formData.append("producer_name", producer.name);
            if (productData.product_type.value === 0) { //wine
                formData.append("product_name", product_name);
                formData.append("producer", producer._id);
                formData.append("product_type", productData.product_type.value);
                formData.append("wine_color", wine_color.value);
                formData.append("wine_type", wine_type.value);
                fortified_wine_type && formData.append("fortified_wine_type", fortified_wine_type.value);
                vintage && formData.append("vintage", vintage.value);
                formData.append("bottle_size", bottle_size.value);
                article && formData.append("article", article);
                // basic
                country && formData.append("country", country.value);
                region && formData.append("region", region.value);
                // sub_region && formData.append("sub_region", sub_region.value);
                variaty && formData.append("variaty", JSON.stringify(grape_variaty));
                description && formData.append("description", description);
                bottleImage && formData.append("bottleImage", bottleImage);
                // advanced
                alc_vol && formData.append("alc_vol", alc_vol);
                aroma && formData.append("aroma", JSON.stringify(aroma_send));
                food && formData.append("food", JSON.stringify(food_send));
                barrel_type && formData.append("barrel_type", barrel_type);
                residual_sugar && formData.append("residual_sugar", residual_sugar);
                taste && formData.append("taste", taste.value);
                wine_acid && formData.append("wine_acid", wine_acid);
                closure_type && formData.append("closure_type", closure_type.value);
                allergy && formData.append("allergy", JSON.stringify(allergy_send));
                searchText && formData.append("search_field", searchText);
            } else if (productData.product_type.value === 1) { // spirit
                formData.append("product_name", product_name);
                formData.append("producer", producer._id);
                formData.append("product_type", productData.product_type.value);
                formData.append("spirit_type", spirit_type.value - 1);
                spirit_sub_type && formData.append("spirit_sub_type", spirit_sub_type.value);
                vintage && formData.append("vintage", vintage.value);
                formData.append("bottle_size", bottle_size.value);
                article && formData.append("article", article);
                // basic
                country && formData.append("country", country.value);
                region && formData.append("region", region.value);
                // sub_region && formData.append("sub_region", sub_region.value);
                description && formData.append("description", description);
                bottleImage && formData.append("bottleImage", bottleImage);
                // advanced
                alc_vol && formData.append("alc_vol", alc_vol);
                aroma && formData.append("aroma", JSON.stringify(aroma_send));
                food && formData.append("food", JSON.stringify(food_send));
                barrel_type && formData.append("barrel_type", barrel_type);
                residual_sugar && formData.append("residual_sugar", residual_sugar);
                wine_acid && formData.append("wine_acid", wine_acid);
                closure_type && formData.append("closure_type", closure_type.value);
                allergy && formData.append("allergy", JSON.stringify(allergy_send));
                searchText && formData.append("search_field", searchText);
            } else if (productData.product_type.value === 2) { // beer
                formData.append("product_name", product_name);
                formData.append("producer", producer._id);
                formData.append("product_type", productData.product_type.value);
                formData.append("beer_type", beer_type.value - 1);
                formData.append("bottle_size", bottle_size.value);
                article && formData.append("article", article);
                // basic
                country && formData.append("country", country.value);
                region && formData.append("region", region.value);
                description && formData.append("description", description);
                bottleImage && formData.append("bottleImage", bottleImage);
                // advanced
                alc_vol && formData.append("alc_vol", alc_vol);
                aroma && formData.append("aroma", JSON.stringify(aroma_send));
                food && formData.append("food", JSON.stringify(food_send));
                residual_sugar && formData.append("residual_sugar", residual_sugar);
                closure_type && formData.append("closure_type", closure_type.value);
                allergy && formData.append("allergy", JSON.stringify(allergy_send));
                searchText && formData.append("search_field", searchText);
            } else if (productData.product_type.value === 3) {   // other

            }

            // const condition = useContext(UserContext);

            const res = await dispatch(registerProduct(formData));
            if (res !== false) {
                dispatch(openSnackBar({ message: t("msg_success_add_product"), status: 'success' }));
                console.log(props.condition);
                await dispatch(getProductsByFilter(props.condition));
                close();
                props.closePrevModal();

                return res;
            } else {
                return false;
            }

        }

    }

    const handleInputChange = (key, value) => {
        productData[`${key}`] = value;
        setProductData({ ...productData });
    };

    const openModal = () => {
        const { product, vintage, useLatest, bottleSize, producer } = props;
        setProducer(producer);
        if (product) {
            setProduct(product);
            const { product_name, wine_color, product_type, category, sub_category, article_nr, grape_variety, bottle_image, spirit_type, spirit_sub_type, beer_type, fortified_wine_type,
                country, region, sub_region, bottle_size, variaty, description_text, input_type, alc_vol, aroma, food_pairing, barrel_type, taste, residual_sugar, wine_acid,
                closure_type, allergy } = product;
            var tmp_variaty = [];
            var tmp_aroma = [];
            var tmp_allergy = [];
            var tmp_food = [];
            if (grape_variety?.length > 0) {
                grape_variety.map((data, index) => {
                    tmp_variaty[index] = { grape: { value: data.grape._id, label: data.grape[`${globalState.language}`] }, percentage: data?.percentage }
                })
            }
            if (aroma?.length > 0) {
                aroma.map((data, index) => {
                    tmp_aroma[index] = { value: data._id, label: data[`${globalState.language}`] }
                })
            }
            if (food_pairing?.length > 0) {
                food_pairing.map((data, index) => {
                    tmp_food[index] = { value: data._id, label: data[`${globalState.language}`] }
                })
            }
            if (allergy?.length > 0) {
                allergy.map((data, index) => {
                    tmp_allergy[index] = { value: data._id, label: data[`${globalState.language}`] }
                })
            }

            product_type._id === 0 && selectWineType({ value: product_type.sub[category - 1].index, label: product_type.sub[category - 1][`${globalState.language}`] }); // for taste
            if (product_type._id < 2 && (product.vintage >= 0 || product.vintage)) {
                if (vintage) {
                    if (vintage.value === product.vintage || useLatest) {
                        // wine & spirit same vintage & select uselatest 
                        setProductData({
                            product_name: product_name,
                            producer_name: producer.name,
                            // for wine
                            wine_color: wine_color ? { value: wine_color._id, label: wine_color.name } : "",
                            product_type: { value: product_type._id, label: product_type.name },
                            wine_type: product_type._id === 0 ? { value: product_type.sub[category - 1].index, label: product_type.sub[category - 1][`${globalState.language}`] } : "",
                            fortified_wine_type: product_type._id === 0 && sub_category >= 0 ? { value: sub_category, label: product_type.sub[category - 1].sub[sub_category] } : "",
                            variaty: grape_variety ? tmp_variaty : "",
                            barrel_type: barrel_type ? barrel_type : "",
                            wine_acid: wine_acid ? wine_acid : "",
                            // for spirit
                            spirit_sub_type: product_type._id === 1 && product_type.sub[category].sub.lenght > 0 ? { value: sub_category, label: product_type.sub[category].sub[sub_category] } : "",
                            spirit_type: product_type._id === 1 ? { value: product_type.sub[category].index, label: product_type.sub[category][`${globalState.language}`] } : "",
                            //for beer
                            beer_type: product_type._id === 2 && sub_category >= 0 ? { value: sub_category, label: product_type.sub[category - 1].sub[sub_category] } : "",
                            // for wine & spirit
                            vintage: { value: vintage.value, label: vintage.label.replace("*", "") },
                            //for all
                            bottle_size: bottleSize ? bottleSize : bottlesize_options[bottle_size],
                            article: "", //article_nr,
                            // for basic
                            country: country ? { value: country._id, label: country.name[`${globalState.language}`] } : "",
                            region: region ? { value: region._id, label: region.name[`${globalState.language}`] } : "",
                            // sub_region: sub_region ? { value: sub_region._id, label: sub_region.name[`${globalState.language}`] } : "",
                            description: description_text ? description_text : "",
                            // for advanced
                            alc_vol: alc_vol ? alc_vol : "",
                            aroma: aroma ? tmp_aroma : "",
                            food: food_pairing ? tmp_food : "",
                            allergy: allergy ? tmp_allergy : "",
                            closure_type: closure_type ? { value: closure_type._id, label: closure_type[`${globalState.language}`] } : "",
                            taste: taste_options[taste],
                            residual_sugar: residual_sugar ? residual_sugar : ""
                        });

                        bottle_image ? setBottleImages(`/public/${bottle_image.changed_name}`) : setBottleImages(null);
                        bottle_image ? setShowBottleImages(`/public/${bottle_image.changed_name}`) : setShowBottleImages(null);
                        setModalShow(true);
                    } else {
                        // dont select uselatest
                        setProductData({
                            product_name: product_name,
                            producer_name: producer.name,
                            // for wine
                            wine_color: wine_color ? { value: wine_color._id, label: wine_color.name } : "",
                            product_type: { value: product_type._id, label: product_type.name },
                            wine_type: product_type._id === 0 ? { value: product_type.sub[category - 1].index, label: product_type.sub[category - 1][`${globalState.language}`] } : "",
                            fortified_wine_type: product_type._id === 0 && sub_category >= 0 ? { value: sub_category, label: product_type.sub[category - 1].sub[sub_category] } : "",
                            variaty: [], //grape_variety ? tmp_variaty : 
                            barrel_type: "", // barrel_type ? barrel_type : 
                            wine_acid: "", //wine_acid ? wine_acid : 
                            // for spirit
                            spirit_sub_type: product_type._id === 1 && product_type.sub[category].sub.lenght > 0 ? { value: sub_category, label: product_type.sub[category].sub[sub_category] } : "",
                            spirit_type: product_type._id === 1 ? { value: product_type.sub[category].index, label: product_type.sub[category][`${globalState.language}`] } : "",
                            //for beer
                            beer_type: product_type._id === 2 && sub_category >= 0 ? { value: sub_category, label: product_type.sub[category - 1].sub[sub_category] } : "",
                            // for wine & spirit
                            vintage: { value: vintage.value, label: vintage.label.replace("*", "") },
                            //for all
                            bottle_size: "", //bottleSize ? bottleSize : bottlesize_options[bottle_size],
                            article: "", //article_nr,
                            // for basic
                            country: country ? { value: country._id, label: country.name[`${globalState.language}`] } : "",
                            region: region ? { value: region._id, label: region.name[`${globalState.language}`] } : "",
                            // sub_region: sub_region ? { value: sub_region._id, label: sub_region.name[`${globalState.language}`] } : "",
                            description: "", //description_text ? description_text :
                            // for advanced
                            alc_vol: "", //alc_vol ? alc_vol : 
                            aroma: [], //aroma ? tmp_aroma : 
                            food: [], //food_pairing ? tmp_food : 
                            allergy: [], //allergy ? tmp_allergy : 
                            closure_type: "", // closure_type ? { value: closure_type._id, label: closure_type[`${globalState.language}`] } : 
                            taste: "",// taste_options[taste]
                            residual_sugar: ""// residual_sugar ? residual_sugar : 
                        });

                        setModalShow(true);
                    }
                } else {
                    dispatch(openSnackBar({ status: "error", message: t("msg_select_vintage") }));
                }
            } else {    //beer and other
                setProductData({
                    product_name: product_name,
                    producer_name: producer.name,
                    // for wine
                    // wine_color: wine_color ? { value: wine_color._id, label: wine_color.name } : "",
                    product_type: { value: product_type._id, label: product_type.name },
                    // wine_type: product_type._id === 0 ? { value: product_type.sub[category - 1].index, label: product_type.sub[category - 1][`${globalState.language}`] } : "",
                    // fortified_wine_type: product_type._id === 0 && sub_category >= 0 ? { value: sub_category, label: product_type.sub[category - 1].sub[sub_category] } : "",
                    // variaty: grape_variety ? tmp_variaty : "",
                    // barrel_type: barrel_type ? barrel_type : "",
                    // wine_acid: wine_acid ? wine_acid : "",
                    // for spirit
                    // spirit_sub_type: product_type._id === 1 && sub_category >= 0 ? { value: sub_category, label: product_type.sub[category].sub[sub_category] } : "",
                    // spirit_type: product_type._id === 1 ? { value: product_type.sub[category].index, label: product_type.sub[category][`${globalState.language}`] } : "",
                    //for beer
                    beer_type: product_type._id === 2 ? { value: product_type.sub[category].index, label: product_type.sub[category][`${globalState.language}`] } : "",
                    // for wine & spirit
                    // vintage: { value: vintage.value, label: vintage.label.replace("*", "") },
                    //for all
                    bottle_size: bottleSize ? bottleSize : bottlesize_options[bottle_size],
                    article: "", // article_nr,
                    // for basic
                    country: country ? { value: country._id, label: country.name[`${globalState.language}`] } : "",
                    region: region ? { value: region._id, label: region.name[`${globalState.language}`] } : "",
                    // sub_region: sub_region ? { value: sub_region._id, label: sub_region.name[`${globalState.language}`] } : "",
                    description: description_text ? description_text : "",
                    // for advanced
                    alc_vol: alc_vol ? alc_vol : "",
                    aroma: aroma ? tmp_aroma : "",
                    food: food_pairing ? tmp_food : "",
                    allergy: allergy ? tmp_allergy : "",
                    closure_type: closure_type ? { value: closure_type._id, label: closure_type[`${globalState.language}`] } : "",
                    taste: taste_options[taste],
                    residual_sugar: residual_sugar ? residual_sugar : ""
                });

                bottle_image ? setBottleImages(`/public/${bottle_image.changed_name}`) : setBottleImages(null);
                bottle_image ? setShowBottleImages(`/public/${bottle_image.changed_name}`) : setShowBottleImages(null);

                setModalShow(true);
            }
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_select_product_create") }));
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
        setOverStyle(false);
        setBottleImages(null);
        setShowBottleImages(null);
        // setProductType("");
        setCurrentLengthOfDescription(0);
    }

    // const { producer } = props;
    const { variaty } = productData;

    return (
        <>
            <Button
                className="bg-sitetx-100"
                onClick={() => openModal()}
            >
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
                    {t("create_new_product")}
                </Modal.Header>
                <hr />
                <Modal.Body className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                    {
                        // for all
                        productData.product_type.value >= 0 &&
                        <div>
                            <div className="m-2 ml-2 text-sm block">
                                {t("product_name")}<span className='text-red-700'>*</span>
                            </div>
                            <TextInput
                                type="text"
                                onChange={e => handleInputChange("product_name", e.target.value)}
                                value={productData.product_name}
                            />
                        </div>}
                    <div>
                        <div className="m-2 ml-2 text-sm block">
                            {t("producer")}
                        </div>
                        <TextInput
                            id="searchproducer"
                            type="text"
                            placeholder="Producer Name"
                            required={true}
                            value={productData.producer_name}
                            disabled
                        />
                    </div>
                    <div className={`${overStyle && "pb-40"}`}>
                        <div className="m-2 ml-2 text-sm block">
                            {t("product_type")}<span className='text-red-700'>*</span>
                        </div>
                        <div onClick={() => !productData.product_type && setOverStyle(!overStyle)}>
                            <SelectCustomStyle>
                                <Select
                                    value={productData.product_type}
                                    onChange={value => handleInputChange("product_type", value)}
                                    options={category_options}
                                    isDisabled
                                />
                            </SelectCustomStyle>
                        </div>
                    </div>
                    {
                        //for wine
                        productData.product_type.value === 0 &&
                        <div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("wine_color")}<span className='text-red-700'>*</span>
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.wine_color}
                                        onChange={value => handleInputChange("wine_color", value)}
                                        options={winecolor_options}
                                        isDisabled
                                    />
                                </SelectCustomStyle>
                            </div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("wine_type")}<span className='text-red-700'>*</span>
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.wine_type}
                                        onChange={value => selectWineType(value)}
                                        options={winetype_options}
                                        isDisabled
                                    />
                                </SelectCustomStyle>
                            </div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("fortified_wine_type")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.fortified_wine_type}
                                        onChange={value => handleInputChange("fortified_wine_type", value)}
                                        options={fortified_options}
                                        isDisabled
                                        isSearchable
                                    />
                                </SelectCustomStyle>
                            </div>
                        </div>
                    }
                    {
                        // for spirit
                        productData.product_type.value === 1 &&
                        <div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("spirit_type")}<span className='text-red-700'>*</span>
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.spirit_type}
                                        onChange={value => selectSpiritType(value)}
                                        options={spirittype_options}
                                        isSearchable
                                        isDisabled
                                    />
                                </SelectCustomStyle>
                            </div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("spirit_sub_type")}
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.spirit_sub_type}
                                        onChange={value => handleInputChange("spirit_sub_type", value)}
                                        options={spiritsubtype_options}
                                        isSearchable
                                        isDisabled
                                    />
                                </SelectCustomStyle>
                            </div>
                        </div>
                    }
                    {
                        // for beer
                        productData.product_type.value === 2 &&
                        <div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("beer_type")}<span className='text-red-700'>*</span>
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.beer_type}
                                        onChange={value => handleInputChange("beer_type", value)}
                                        options={beertype_options}
                                        isDisabled
                                    />
                                </SelectCustomStyle>
                            </div>
                        </div>
                    }
                    {
                        // for wine & spirit
                        productData.product_type.value < 2 &&
                        <div>
                            <div className="m-2 ml-2 text-sm block">
                                {t("vintage")}
                            </div>
                            <SelectCustomStyle>
                                <Select
                                    value={productData.vintage}
                                    onChange={value => handleInputChange("vintage", value)}
                                    options={vintage_options}
                                    isSearchable
                                />
                            </SelectCustomStyle>
                        </div>
                    }
                    {
                        // for all
                        productData.product_type &&
                        <div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("bottle_size")}<span className='text-red-700'>*</span>
                                </div>
                                <SelectCustomStyle>
                                    <Select
                                        value={productData.bottle_size}
                                        onChange={value => handleInputChange("bottle_size", value)}
                                        options={bottlesize_options}
                                    />
                                </SelectCustomStyle>
                            </div>
                            <div>
                                <div className="m-2 ml-2 text-sm block">
                                    {t("article_nr")}
                                </div>
                                <TextInput
                                    id="article"
                                    type="text"
                                    onChange={e => handleInputChange("article", e.target.value)}
                                    // placeholder="Producer Name"
                                    addon="#"
                                    value={productData.article}
                                />
                            </div>

                            <Tabs.Group
                                className="justify-center pt-4"
                                aria-label="Tabs with underline"
                                style="underline"
                            >
                                <Tabs.Item
                                    active={true}
                                    title={t("basic")}
                                    className="w-2/5"
                                >
                                    <div>
                                        <div className="m-2 ml-2 text-sm block">
                                            {t("country")}<span className='text-red-700'>*</span>
                                        </div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={productData.country}
                                                onChange={value => { handleInputChange("country", value); selectCountry(value); }}
                                                options={country_options}
                                                isSearchable
                                                isDisabled={productData.country ? true : false}
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                    <div>
                                        <div className="m-2 ml-2 text-sm block">
                                            {t("region")}<span className='text-red-700'>*</span>
                                        </div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={productData.region}
                                                onChange={value => { handleInputChange("region", value); selectRegion(value); }}
                                                options={region_options}
                                                isDisabled={productData.region ? true : false}
                                                isSearchable
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                    {/* {
                                        // for wine & spirit
                                        productData.product_type.value < 2 &&
                                        <div>
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("sub_region")}
                                            </div>
                                            <SelectCustomStyle>
                                                <Select
                                                    value={productData.sub_region}
                                                    onChange={value => handleInputChange("sub_region", value)}
                                                    options={subregion_options}
                                                    isSearchable
                                                    isDisabled={productData.sub_region ? true : false}
                                                />
                                            </SelectCustomStyle>
                                        </div>
                                    } */}
                                    {
                                        productData.product_type.value === 0 &&
                                        <div>
                                            <div className="m-2 ml-2 py-2 text-sm block">
                                                {t("grape_varieties")}
                                            </div>
                                            <div className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "2fr 1.5fr 0.5fr" }}>
                                                <div className="m-2 ml-2 text-sm block">Variaty</div>
                                                <div className="m-2 ml-2 text-sm block">{t("percentage")}</div>
                                                <div className="m-2 ml-2 text-sm block"></div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        // for wine
                                        productData.product_type.value === 0 && variaty?.map((data, index) =>
                                            <div key={index} className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "2fr 1.5fr 0.5fr" }}>
                                                <div>
                                                    <SelectGrapeStyle>
                                                        <Select
                                                            value={data.grape}
                                                            onChange={value => setExistVariate("grape", index, value)}
                                                            options={grape_options}
                                                            isSearchable
                                                        />
                                                    </SelectGrapeStyle>
                                                </div>
                                                <div>
                                                    <TextInput
                                                        id="percentage"
                                                        type="number"
                                                        max={100}
                                                        min={0}
                                                        onChange={e => setExistVariate("percentage", index, e.target.value)}
                                                        // placeholder="Producer Name"
                                                        addon="%"
                                                        value={data?.percentage}
                                                    />
                                                </div>
                                                <div>
                                                    <label onClick={() => setExistVariate("remove", index)} className="flex flex-col justify-center items-center float-right w-10 h-10 bg-red-100 rounded-lg border-2 border-red-500 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-red-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                            <HiOutlineMinus className="text-red-500 h-6 w-6" />
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        )
                                    }
                                    {
                                        //for wine
                                        productData.product_type.value === 0 &&
                                        <div>
                                            <div className="grid gap-4 align-middle" style={{ gridTemplateColumns: "2fr 1.5fr 0.5fr" }}>
                                                <div>
                                                    <SelectGrapeStyle>
                                                        <Select
                                                            value={grape}
                                                            onChange={value => setGrape(value)}
                                                            options={grape_options}
                                                            isSearchable
                                                        />
                                                    </SelectGrapeStyle>
                                                </div>
                                                <div>
                                                    <TextInput
                                                        id="percentage"
                                                        type="number"
                                                        max={100}
                                                        min={0}
                                                        onChange={e => setPercentage(e.target.value)}
                                                        addon="%"
                                                        value={percentage}
                                                    />
                                                </div>
                                                <div>
                                                    <label onClick={() => removeGrapeVariaty()} className="flex flex-col justify-center items-center float-right w-10 h-10 bg-red-100 rounded-lg border-2 border-red-500 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-red-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                            <HiOutlineMinus className="text-red-500 h-6 w-6" />
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                            <div onClick={() => addGrapeVariaty()} className="flex justify-center items-center w-full pt-2">
                                                <label className="flex flex-col justify-center items-center w-full h-14 bg-gray-50 rounded-lg border-2 border-sitebg-50 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                                        <HiOutlinePlus className="ml-2 h-7 w-7 text-sitebg-50" />
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    }

                                    <div>
                                        <div className="m-2 ml-2 block">
                                            {t("description")}
                                        </div>
                                        <Textarea
                                            id="searchproducer"
                                            type="text"
                                            placeholder={t("description")}
                                            rows={4}
                                            value={productData.description}
                                            onChange={(e) => { handleInputChange("description", e.target.value); setCurrentLengthOfDescription(e.target.value.length) }}
                                        />
                                        <div className={`mt-2 ml-2 text-sm flex justify-between ${currentLengthOfDescription > 450 ? "text-red-600" : "text-sitetx-100"}`}>
                                            <div>max. 450 {t("characters")}</div>
                                            <div>{currentLengthOfDescription}/450</div>
                                        </div>
                                    </div>
                                    <UploadImage
                                        title={t("bottle_image")}
                                        setImage={setBottleImages}
                                        showImage={showBottleImage}
                                        setShowImage={setShowBottleImages}
                                    />
                                </Tabs.Item>
                                <Tabs.Item
                                    className="w-2/5"
                                    title={t("advanced")}
                                >
                                    <div>
                                        <div className="m-2 ml-2 text-sm block">
                                            {t("alc_vol")}
                                        </div>
                                        <TextInput
                                            type="text"
                                            onChange={e => handleInputChange("alc_vol", e.target.value)}
                                            addon="%/vol"
                                            value={productData.alc_vol}
                                        />
                                    </div>
                                    <MultiData
                                        title="Aroma"
                                        itemTitle="aroma"
                                        option_data={aroma_options}
                                        exist_data={productData.aroma}
                                        setExistData={setExistData}
                                        addMultiData={addMultiData}
                                    />
                                    <MultiData
                                        title="Food Pairing"
                                        itemTitle="food"
                                        option_data={food_options}
                                        exist_data={productData.food}
                                        setExistData={setExistData}
                                        addMultiData={addMultiData}
                                    />
                                    {
                                        //for wine & spirit
                                        productData.product_type.value < 2 &&
                                        <div>
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("barrel_type")}
                                            </div>
                                            <TextInput
                                                type="text"
                                                onChange={e => handleInputChange("barrel_type", e.target.value)}
                                                value={productData.barrel_type}
                                            />
                                        </div>
                                    }
                                    {
                                        productData.product_type.value === 0 && // wine
                                        <div>
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("taste_residual_sugar")}
                                            </div>
                                            <div className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "2fr 1fr" }}>

                                                <SelectCustomStyle>
                                                    <Select
                                                        value={productData.taste}
                                                        onChange={value => handleInputChange("taste", value)}
                                                        options={taste_options}
                                                    />
                                                </SelectCustomStyle>
                                                <TextInput
                                                    type="text"
                                                    onChange={e => handleInputChange("residual_sugar", e.target.value)}
                                                    value={productData.residual_sugar}
                                                    addon="g/l"
                                                />
                                            </div>
                                        </div>
                                    }
                                    {
                                        productData.product_type.value > 0 && // spirit & beer
                                        <div>
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("taste_residual_sugar")}
                                            </div>
                                            <TextInput
                                                type="text"
                                                onChange={e => handleInputChange("residual_sugar", e.target.value)}
                                                value={productData.residual_sugar}
                                                addon="g/l"
                                            />
                                        </div>
                                    }
                                    {
                                        // for wine & spirit
                                        productData.product_type.value < 2 &&
                                        <div>
                                            <div className="m-2 ml-2 text-sm block">
                                                {t("wine_acid")}
                                            </div>
                                            <TextInput
                                                type="text"
                                                onChange={e => handleInputChange("wine_acid", e.target.value)}
                                                value={productData.wine_acid}
                                                addon="g/l"
                                            />
                                        </div>
                                    }
                                    <div>
                                        <div className="m-2 ml-2 text-sm block">
                                            {t("closure_type")}
                                        </div>
                                        <SelectCustomStyle>
                                            <Select
                                                value={productData.closure_type}
                                                onChange={value => handleInputChange("closure_type", value)}
                                                options={closureType_options}
                                                isSearchable
                                            />
                                        </SelectCustomStyle>
                                    </div>
                                    <MultiData
                                        title="Allergens"
                                        itemTitle="allergy"
                                        option_data={allergy_options}
                                        exist_data={productData.allergy}
                                        setExistData={setExistData}
                                        addMultiData={addMultiData}
                                    />
                                </Tabs.Item>
                            </Tabs.Group>
                        </div>

                    }
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <HiOutlineTrash className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => createProduct()} className="bg-sitebg-300">
                                {t("create_new_product")}
                                <HiOutlineDocumentAdd className="ml-2 h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateProduct;
