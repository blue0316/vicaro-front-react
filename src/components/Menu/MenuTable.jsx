import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { setMenuSearchCondition } from '../../redux/globalReducer';
import { getMenusByFilter, getMenuTotalCount } from '../../redux/menuReducer';
import Loading from "../Global/Loading";
import MenuTableItem from "./MenuTableItem";
import MenuTableNavbar from "./MenuTableNavbar";
import MenuTablePagination from "./MenuTablePagination";
import MenuTableToolbar from "./MenuTableToolbar";

function MenuTable() {
    const { t } = useTranslation();
    const { authState, globalState, menuState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { menusByFilter, getMenusByFilterState, getMenuTotalCountState } = menuState;
    // const { id, company } = userInfo;

    const dispatch = useDispatch();

    const [condition, setCondition] = useState({
        filterArray: [],
        showCount: 10,
        sortby: "Date Created",
        currentPage: 0,
        activeState: "my",
        isGlobal: userInfo?.role === 0 ? "global" : "company",
        company: userInfo?.company,
        role: userInfo?.role,
        user_id: userInfo?.id
    });

    useEffect(() => {
        dispatch(getMenusByFilter(condition));
        dispatch(setMenuSearchCondition({ ...condition }));
    }, [])

    useEffect(() => {
        if (globalState.menuCondition.company) {
            setCondition({ ...globalState.menuCondition });
            dispatch(getMenuTotalCount(globalState.menuCondition));
        }
    }, [globalState.menuCondition])

    const setHandleCondition = (key, value) => {
        condition[`${key}`] = value;
        setCondition({ ...condition });

        dispatch(setMenuSearchCondition({ ...condition }));
    }

    function getFilterMenu() {//filter
        dispatch(getMenusByFilter(condition))
    }

    return (
        <>
            <MenuTableToolbar setCondition={setHandleCondition} getData={getFilterMenu} condition={condition} />
            <div className="bg-white rounded-[2px]">
                {getMenusByFilterState || getMenuTotalCountState && <Loading />}
                <MenuTableNavbar setCondition={setHandleCondition} getData={getFilterMenu} />

                <div>
                    <div className="overflow-x-auto overflow-y-hidden relative shadow-md">
                        <div className="overflow-y-scroll" style={{maxHeight: 'calc(100vh - 460px)'}}>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <tbody>
                                    {
                                        menusByFilter && menusByFilter.length > 0 ? menusByFilter.map((data, index) =>
                                            <MenuTableItem key={data._id} data={data} condition={condition} pos={index} last={menusByFilter.length === index + 1} />
                                        ) : <tr><td className="p-6"><span className="px-4 text-lg">{t("nodata")}</span></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <MenuTablePagination setCondition={setHandleCondition} getData={getFilterMenu} condition={condition} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuTable;
