import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import styled from 'styled-components';

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`

function MenuTableNavbar(props) {
    const { t } = useTranslation();
    const { menuState } = useSelector((state) => state);
    const { count, my_count } = menuState;

    useEffect(() => {
    }, [])

    const [selectTab, setSelectTab] = useState(0);
    const [sortby, setSortby] = useState({ value: 0, label: "Date Created" });
    const [showCount, setShowCount] = useState({ value: 0, label: "10" });

    var activeStyle = "flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 base active text-blue-600 rounded-t-lg border-b-2 border-sitebg-200 active dark:text-blue-500 dark:border-sitebg-300";
    var inactiveStyle = "flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 base active border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300";

    var sortName = ["Date Created", "Date Modified", "User", "Wine Menu"]
    var countName = ["10", "20", "50", "100"]
    var sort_options = [];
    var count_options = [];

    sortName && sortName.map((data, index) => {
        sort_options[index] = { value: index, label: data }
    });

    countName && countName.map((data, index) => {
        count_options[index] = { value: index, label: data }
    });

    const selectShowCount = (value) => {
        setShowCount(value);

        const { setCondition, getData } = props;
        setCondition("showCount", value.label);
        setCondition("currentPage", 0);
        getData();
    }

    const selectSortby = (value) => {
        setSortby(value);

        const { setCondition, getData } = props;
        setCondition("sortby", value.label);
        setCondition("currentPage", 0);
        getData();
    }

    const selectState = (value) => {
        setSelectTab(value);

        const state_str = ["my", "all"];
        const { setCondition, getData } = props;
        setCondition("activeState", state_str[value]);
        setCondition("currentPage", 0);
        getData();
    }

    return (
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 px-4">
            <div aria-label="Tabs with underline" role="tablist" className="col-span-5 flex text-center flex-wrap px-2">
                <button
                    onClick={() => selectState(0)}
                    type="button"
                    className={selectTab === 0 ? activeStyle : inactiveStyle}
                >
                    <div className={selectTab === 0 ? "flex text-sitebg-50 gap-4 transition-colors duration-150" : "flex gap-4 transition-colors duration-150"}>
                        {t("my_wine_menus")}
                        <div className={selectTab === 0 ? "bg-sitebg-50 text-white px-2 rounded-full transition-colors duration-150" : "bg-black text-white px-2 rounded-full transition-colors duration-150"}>
                            {my_count}
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => selectState(1)}
                    type="button"
                    className={selectTab === 1 ? activeStyle : inactiveStyle}
                >
                    <div className={selectTab === 0 ? "flex text-sitebg-50 gap-4 transition-colors duration-150" : "flex gap-4 transition-colors duration-150"}>
                        {t("all")}
                        <div className={selectTab === 0 ? "bg-sitebg-50 text-white px-2 rounded-full transition-colors duration-150" : "bg-black text-white px-2 rounded-full transition-colors duration-150"}>
                            {count}
                        </div>
                    </div>
                </button>
            </div>
            <div className="flex items-center col-span-1 px-2 select-box">
                <SelectCustomStyle>
                    <Select
                        value={showCount}
                        onChange={value => selectShowCount(value)}
                        options={count_options}
                    />
                </SelectCustomStyle>
            </div>
            <div className="flex items-center col-span-1 px-2 select-box">
                <SelectCustomStyle>
                    <Select
                        value={sortby}
                        onChange={value => selectSortby(value)}
                        options={sort_options}
                    />
                </SelectCustomStyle>
            </div>
        </div>

    );
}

export default MenuTableNavbar;
