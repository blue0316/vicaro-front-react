import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegTimesCircle, FaTimes } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { useDispatch } from 'react-redux';
import { openSnackBar } from '../../redux/snackBarReducer';
import AddFilter from "./AddFilter";
import NewProduct from "./NewProduct";

function ProductTableToolbar(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [search, setSearch] = useState("");   //search bar text 
    const [filterArray, setFilterArray] = useState([]);

    const changeSearch = (e) => {
        setSearch(e.target.value);
    }

    const keyDownSearch = (e) => {
        var flag = false;
        if (e.keyCode === 13) {
            if (search.trim()) {
                if (filterArray.length > 0) {
                    filterArray.map(data => {
                        if (data.type === "text" && data.value === search.trim()) {
                            flag = true;
                        } else {
                            flag = false;
                        }
                    })
                }
                if (!flag) {
                    setFilterArray([...filterArray, { type: "text", value: search.trim() }]);
                    setSearch("");

                    const { setCondition, getData } = props;
                    setCondition("filterArray", [...filterArray, { type: "text", value: search.trim() }]);
                    setCondition("currentPage", 0);
                    getData();
                } else {
                    dispatch(openSnackBar({ status: "error", message: t("msg_filter_name_exist") }));
                }
            }
        }
    }

    const addFilterArray = (data) => {
        var tmpFilterArray = [];
        for (let filter in data) {
            if (filter === "alc_vol" || filter === "wine_acid" || filter === "residual_sugar") {
                if (data[`${filter}`][0] !== 0 || data[`${filter}`][1] !== 100)
                    tmpFilterArray = [...tmpFilterArray, { type: filter, value: data[`${filter}`][0] + "," + data[`${filter}`][1] }];
            } else if (data[`${filter}`] && data[`${filter}`].length > 0) {
                data[`${filter}`].map((item) => {
                    var flag = false;
                    if (filterArray.length > 0) {
                        for (let i = 0; i < filterArray.length; i++) {
                            if (filterArray[i].type === filter && filterArray[i].value === item.label) {
                                flag = true;
                                break;
                            } else {
                                flag = false;
                                break;
                            }
                        }
                    }
                    if (!flag) {
                        tmpFilterArray = [...tmpFilterArray, { type: filter, value: item.label, id: item.value }];
                    } else {
                        // dispatch(openSnackBar({ status: "error", message: t("msg_filter_name_exist") }));
                    }
                })
            }

        }
        setFilterArray([...filterArray, ...tmpFilterArray]);
        const { setCondition, getData } = props;
        setCondition("filterArray", [...filterArray, ...tmpFilterArray]);
        setCondition("currentPage", 0);
        getData();
    }

    const removeSelectedFilter = (index) => {
        filterArray.splice(index, 1);
        setFilterArray([...filterArray]);

        const { setCondition, getData } = props;
        setCondition("filterArray", [...filterArray]);
        setCondition("currentPage", 0);
        getData();
    }

    const removeAllFilter = () => {
        setFilterArray([]);

        const { setCondition, getData } = props;
        setCondition("filterArray", []);
        setCondition("currentPage", 0);
        getData();
    }

    return (
        <div>
            <div className="flex flex-wrap mb-4">
                <div>
                    <h2 className="font-bold leading-[40px] text-[30px] tracking-[-0.3px]">Products</h2>
                </div>
                <div className="basis-3/5 px-2 pb-4 md:pb-0 md:flex-1 !w-full md:!w-auto">
                    <TextInput
                        id="searchProduct"
                        type="search"
                        sizing="md"
                        className="input-field max-w-[240px] ml-auto mr-0 shadow-sm"
                        placeholder={t("what_are_looking")}
                        required={true}
                        icon={HiOutlineSearch}
                        value={search}
                        onChange={(e) => changeSearch(e)}
                        onKeyDown={(e) => keyDownSearch(e)}
                    />
                </div>
                <div className="px-2">
                    <AddFilter addFilterArray={addFilterArray} />
                </div>
                <div className="px-2">
                    <NewProduct condition={props.condition} />
                </div>
            </div>
            <div className="flex justify-start pb-3">
                {
                    filterArray?.length > 0 &&
                    <div className="flex items-center justify-center py-1 mr-4 px-[10px] bg-[#FFE4E6] rounded-full">
                        <span className="text-xs text-[#E11D48] font-medium leading-5 mr-2">{t("remove_all_tag")}</span>
                        <svg onClick={() => removeAllFilter()} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.6569 10.2426L7.41421 6L11.6569 1.75736C12.0811 1.3331 12.0811 0.767413 11.6569 0.343149C11.2326 -0.0811153 10.6669 -0.0811154 10.2426 0.343149L6 4.58579L1.75736 0.343149C1.3331 -0.0811154 0.76741 -0.0811153 0.343146 0.343149C-0.0811185 0.767413 -0.0811182 1.3331 0.343146 1.75736L4.58579 6L0.343146 10.2426C-0.0811185 10.6669 -0.0811181 11.2326 0.343146 11.6569C0.76741 12.0811 1.3331 12.0811 1.75736 11.6569L6 7.41422L10.2426 11.6569C10.6669 12.0811 11.2326 12.0811 11.6569 11.6569C12.0811 11.2326 12.0811 10.6669 11.6569 10.2426Z" fill="#E11D48"/>
                        </svg>
                    </div>
                }
                <div className="flex flex-wrap gap-4 px-4">
                    {
                        filterArray.map((data, i) =>
                            <div key={`filter-tag-${i}`} className="flex items-center justify-center py-1 px-[10px] bg-[#334155] rounded-full">
                                <span className="text-xs text-white font-medium leading-5 mr-2">{data.type !== "text" && `${data.type}:`}
                                        <b className="text-sm"> "{data.value}"</b></span>
                                <svg onClick={() => removeSelectedFilter(i)} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.6569 10.2426L7.41421 6L11.6569 1.75736C12.0811 1.3331 12.0811 0.767413 11.6569 0.343149C11.2326 -0.0811153 10.6669 -0.0811154 10.2426 0.343149L6 4.58579L1.75736 0.343149C1.3331 -0.0811154 0.76741 -0.0811153 0.343146 0.343149C-0.0811185 0.767413 -0.0811182 1.3331 0.343146 1.75736L4.58579 6L0.343146 10.2426C-0.0811185 10.6669 -0.0811181 11.2326 0.343146 11.6569C0.76741 12.0811 1.3331 12.0811 1.75736 11.6569L6 7.41422L10.2426 11.6569C10.6669 12.0811 11.2326 12.0811 11.6569 11.6569C12.0811 11.2326 12.0811 10.6669 11.6569 10.2426Z" fill="#FFFFFF"/>
                                </svg>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default ProductTableToolbar;
