import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux'
import { TextInput } from "flowbite-react"
import { HiOutlineSearch } from "react-icons/hi";
import { FaRegTimesCircle, FaTimes } from "react-icons/fa"
import NewCompany from "./NewCompany";
import { openSnackBar } from '../../redux/snackBarReducer';
import { useTranslation } from "react-i18next";

function CompanyTableToolbar(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    useEffect(() => {
    }, [])

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
            <div className="flex pt-6 pb-2.5 px-4">
                <div className="px-2 flex-1">
                    <TextInput
                        id="searchCompany"
                        type="search"
                        sizing="md"
                        placeholder={t("what_are_looking")}
                        required={true}
                        icon={HiOutlineSearch}
                        value={search}
                        onChange={(e) => changeSearch(e)}
                        onKeyDown={(e) => keyDownSearch(e)}
                    />
                </div>
                <div className="px-2">
                    <NewCompany condition={props.condition} />
                </div>
            </div>
            <div className="px-2">
                {
                    filterArray?.length > 0 &&
                    <div className="flex pl-12 pt-3" >
                        <FaRegTimesCircle onClick={() => removeAllFilter()} className="mr-2 h-4 w-4 text-sitebg-50" />
                        <u className="text-xs text-sitebg-50">{t("remove_all_tag")}</u>
                    </div>
                }
                <div className="flex flex-wrap gap-4">
                    {
                        filterArray.map((data, i) =>
                            <div key={i} className="bg-gray-200 text-gray-700 font-medium leading-tight rounded-xl shadow-md cursor-pointer">
                                <div className="flex p-2">
                                    <p>{data.type !== "text" && `${data.type}:`}
                                        <b className="text-sm"> "{data.value}"</b>
                                    </p>
                                    <FaTimes onClick={() => removeSelectedFilter(i)} className="ml-2 h-4 w-4 mt-1" />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default CompanyTableToolbar;
