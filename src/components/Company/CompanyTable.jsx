import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { getCompaniesByFilter, getCompanyTotalCount } from '../../redux/companyReducer';
import { setCompanySearchCondition } from '../../redux/globalReducer';
import Loading from "../Global/Loading";
import CompanyTableItem from "./CompanyTableItem";
import CompanyTableNavbar from "./CompanyTableNavbar";
import CompanyTablePagination from "./CompanyTablePagination";
import CompanyTableToolbar from "./CompanyTableToolbar";
function CompanyTable() {
    const { t } = useTranslation();
    const { authState, globalState, companyState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { companiesByFilter, getCompaniesByFilterState, getCompanyTotalCountState } = companyState;

    const dispatch = useDispatch();

    const [condition, setCondition] = useState({
        filterArray: [],
        showCount: 10,
        sortby: "Date Created",
        currentPage: 0,
        activeState: "active",
        isGlobal: userInfo?.role === 0 ? "global" : "company",
        company: userInfo?.company,
        role: userInfo?.role,
        user_id: userInfo?.id
    });

    useEffect(() => {
        dispatch(getCompaniesByFilter(condition));
        dispatch(setCompanySearchCondition({ ...condition }));
    }, [])

    useEffect(() => {
        if (globalState.companyCondition.company) {
            setCondition({ ...globalState.companyCondition });
            dispatch(getCompanyTotalCount(globalState.companyCondition));
        }
    }, [globalState.companyCondition])

    const setHandleCondition = (key, value) => {
        condition[`${key}`] = value;
        setCondition({ ...condition });

        dispatch(setCompanySearchCondition({ ...condition }));
    }

    function getFilterCompany() {//filter
        dispatch(getCompaniesByFilter(condition))
    }

    return (
        <>
            <CompanyTableToolbar setCondition={setHandleCondition} getData={getFilterCompany} condition={condition} />
            <div className="bg-white rounded-[2px]">
                {(getCompaniesByFilterState || getCompanyTotalCountState) && <Loading />}
                <CompanyTableNavbar setCondition={setHandleCondition} getData={getFilterCompany} />

                <div>
                    <div className="overflow-x-auto overflow-y-hidden relative shadow-md">
                        <div className="overflow-y-scroll" style={{maxHeight: 'calc(100vh - 460px)'}}>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <tbody>
                                    {
                                        companiesByFilter && companiesByFilter.length > 0 ? companiesByFilter.map((data, index) =>
                                            <CompanyTableItem key={data._id} data={data} condition={condition} pos={index} last={companiesByFilter.length === index + 1} />
                                        ) : <tr><td className="p-6"><span className="px-4 text-lg">{t("nodata")}</span></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <CompanyTablePagination setCondition={setHandleCondition} getData={getFilterCompany} condition={condition} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default CompanyTable;
