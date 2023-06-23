import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import styled from 'styled-components';
import Transition from "../../utils/Transition";

export const SelectCustomStyle = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`

function ProductTableNavbar(props) {
    const { t } = useTranslation();
    const { productState } = useSelector((state) => state);
    const { count, active_count, inactive_count } = productState;

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!dropdown.current) return;
            if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
            setDropdownOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);

        const keyHandler = ({ keyCode }) => {
            if (!dropdownOpen || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    })

    const [selectTab, setSelectTab] = useState(0);
    const [sortby, setSortby] = useState({ value: 0, label: "Categorys" });
    const [showCount, setShowCount] = useState({ value: 0, label: "10" });

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const trigger = useRef(null);
    const dropdown = useRef(null);

    var activeStyle = "flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 base active text-blue-600 rounded-t-lg border-b-2 border-sitebg-200 active dark:text-blue-500 dark:border-sitebg-300";
    var inactiveStyle = "flex items-center justify-center p-4 text-sm font-medium first:ml-0 disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500 base active border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300";

    var sortName = ["Categories", "Producer", "Product Name", "Country", "Article Number", "Vintage", "Last Modified"]
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

        const state_str = ["active", "inactive", "all"];
        const { setCondition, getData } = props;
        setCondition("activeState", state_str[value]);
        setCondition("currentPage", 0);
        getData();
    }

    return (
        <div className="flex justify-between pt-7 border-b border-gray-200 dark:border-gray-700 px-4">
            <div aria-label="Tabs with underline" role="tablist" className="flex-1 flex text-center flex-wrap px-2">
                <button
                    onClick={() => selectState(0)}
                    type="button"
                    className={selectTab === 0 ? activeStyle : inactiveStyle}
                >
                    <div className={selectTab === 0 ? "flex text-sitebg-50 gap-4 transition-colors duration-150" : "flex gap-4 transition-colors duration-150"}>
                        {t("active")}
                        <div className={selectTab === 0 ? "bg-sitebg-50 text-white px-2 rounded-full transition-colors duration-150" : "bg-black text-white px-2 rounded-full transition-colors duration-150"}>
                            {active_count}
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => selectState(1)}
                    type="button"
                    className={selectTab === 1 ? activeStyle : inactiveStyle}
                >
                    <div className={selectTab === 1 ? "flex text-sitebg-50 gap-4 transition-colors duration-150" : "flex gap-4 transition-colors duration-150"}>
                        {t("inactive")}
                        <div className={selectTab === 1 ? "bg-sitebg-50 text-white px-2 rounded-full transition-colors duration-150" : "bg-black text-white px-2 rounded-full transition-colors duration-150"}>
                            {inactive_count}
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => selectState(2)}
                    type="button"
                    className={selectTab === 2 ? activeStyle : inactiveStyle}
                >
                    <div className={selectTab === 2 ? "flex text-sitebg-50 gap-4 transition-colors duration-150" : "flex gap-4 transition-colors duration-150"}>
                        {t("all")}
                        <div className={selectTab === 2 ? "bg-sitebg-50 text-white px-2 rounded-full transition-colors duration-150" : "bg-black text-white px-2 rounded-full transition-colors duration-150"}>
                            {count}
                        </div>
                    </div>
                </button>
            </div>
            <div className="flex dropdown-filter items-center col-span-1 px-2 select-box">
                <span className="mr-5 whitespace-nowrap">
                    Product per Page:
                </span>
                <SelectCustomStyle>
                    <Select
                        value={showCount}
                        onChange={value => selectShowCount(value)}
                        options={count_options}
                    />
                </SelectCustomStyle>
            </div>
            <div className="flex items-center col-span-1 px-2 select-box">
                <span className="mr-5 whitespace-nowrap">
                    Category:
                </span>
                <div className="dropdown-filter1">
                    <SelectCustomStyle>
                        <Select
                            value={sortby}
                            onChange={value => selectSortby(value)}
                            options={sort_options}
                        />
                    </SelectCustomStyle>
                </div>
                <div className="dropdown-filter2 relative inline-flex">
                    <button
                        ref={trigger}
                        className="btn bg-white border-slate-300 hover:border-slate-300 text-slate-500 hover:text-slate-600"
                        aria-haspopup="true"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-expanded={dropdownOpen}
                    >
                        <span className="sr-only">Filter</span><wbr />
                        <svg className="w-4 h-6 fill-current" viewBox="0 0 16 16">
                            <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
                        </svg>
                    </button>
                    <Transition
                        show={dropdownOpen}
                        tag="div"
                        className={`origin-top-right z-10 absolute top-full min-w-56 bg-white border border-slate-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1 right-0`}
                        enter="transition ease-out duration-200 transform"
                        enterStart="opacity-0 -translate-y-2"
                        enterEnd="opacity-100 translate-y-0"
                        leave="transition ease-out duration-200"
                        leaveStart="opacity-100"
                        leaveEnd="opacity-0"
                    >
                        <div ref={dropdown}>
                            <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4">Filters</div>
                            <ul className="mb-4">
                                {
                                    sort_options.map((opt, index) => (
                                        <li key={`filter2-${index}`} className="py-1 px-3">
                                            <label className="flex items-center">
                                                <span className="text-sm font-medium ml-2">{opt.label}</span>
                                            </label>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    );
}

export default ProductTableNavbar;
