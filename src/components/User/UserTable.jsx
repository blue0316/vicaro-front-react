import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { setUserSearchCondition } from '../../redux/globalReducer';
import { getUsersByFilter, getUserTotalCount } from '../../redux/userReducer';
import Loading from "../Global/Loading";
import UserTableItem from "./UserTableItem";
import UserTableNavbar from "./UserTableNavbar";
import UserTablePagination from "./UserTablePagination";
import UserTableToolbar from "./UserTableToolbar";

function UserTable() {
    const { t } = useTranslation();
    const { authState, globalState, userState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { usersByFilter, getUsersByFilterState, getUserTotalCountState } = userState;

    const dispatch = useDispatch();

    const [condition, setCondition] = useState({
        filterArray: [],
        showCount: 10,
        sortby: "Date Created",
        currentPage: 0,
        activeState: "company",
        isGlobal: userInfo?.role === 0 ? "global" : "company",
        company: userInfo?.company, //userInfo?.company,
        role: userInfo?.role,
        user_id: userInfo?.id
    });

    useEffect(() => {
        if (userInfo?.role !== 0) {
            dispatch(getUsersByFilter(condition));
            dispatch(setUserSearchCondition({ ...condition }));
        }
    }, [])

    useEffect(() => {
        if (globalState.userCondition.company) {
            setCondition({ ...globalState.userCondition });
            dispatch(getUserTotalCount(globalState.userCondition));
        }
    }, [globalState.userCondition])

    const setHandleCondition = (key, value) => {
        condition[`${key}`] = value;
        setCondition({ ...condition });

        dispatch(setUserSearchCondition({ ...condition }));
    }

    function getFilterUser() {//filter
        dispatch(getUsersByFilter(condition))
    }

    return (
        <>
            <UserTableToolbar setCondition={setHandleCondition} getData={getFilterUser} condition={condition} />
            <div className="bg-white rounded-[2px]">
                {(getUsersByFilterState || getUserTotalCountState) && <Loading />}
                <UserTableNavbar setCondition={setHandleCondition} getData={getFilterUser} />

                <div>
                    <div className="overflow-x-auto overflow-y-hidden relative shadow-md">
                        <div className="overflow-y-scroll" style={{maxHeight: 'calc(100vh - 460px)'}}>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <tbody>
                                    {
                                        usersByFilter && usersByFilter.length > 0 ? usersByFilter.map((data, index) =>
                                            <UserTableItem key={data._id} data={data} condition={condition} pos={index} last={usersByFilter.length === index + 1} />
                                        ) : <tr><td className="p-6"><span className="px-4 text-lg">{t("nodata")}</span></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <UserTablePagination setCondition={setHandleCondition} getData={getFilterUser} condition={condition} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserTable;
