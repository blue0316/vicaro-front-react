import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { Breadcrumb } from "flowbite-react"
import { HiHome } from "react-icons/hi";
import { useTranslation } from "react-i18next";

function BreadCrumbNav(props) {
    const { t } = useTranslation();
    const { globalState, productState, menuState, companyState } = useSelector((state) => state);

    // const { company, role } = userInfo;
    const { selectedCompany } = globalState;

    useEffect(() => {
        // dispatch(getProductTotalCount({ company, role }))
    }, [])

    const { type } = props;
    return (
        <div className="flex justify-between items-center mx-6">
            <div className="w-full">
                <div className="flex justify-between items-center">
                    <div className="px-0 py-4 bg-slate-5">
                        <div className="flex text-center">
                        <ul className="inline-flex flex-wrap text-sm font-medium">
                            <li className="flex items-center">
                            <a className="text-slate-500 hover:text-indigo-500" href="#0">Home</a>
                            <svg className="h-4 w-4 fill-current text-slate-400 mx-3" viewBox="0 0 16 16">
                                <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
                            </svg>
                            </li>
                            <li className="flex items-center">
                            <a className="text-slate-500 hover:text-indigo-500" href="#0">{selectedCompany} {type}</a>
                            </li>
                        </ul>
                        </div>
                    </div>
                    <div className="text-sm float-left text-sitetx-100">{t("total")} {type === t("products") ? productState.count : type === t("wine_menus") ? menuState.count : type === t("company") && companyState.count} {type}</div>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">

            </div>
        </div>
    );
}

export default BreadCrumbNav;
