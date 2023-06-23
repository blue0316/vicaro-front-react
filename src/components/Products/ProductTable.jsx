import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { setProductSearchCondition } from '../../redux/globalReducer';
import { getProductsByFilter, getProductTotalCount } from '../../redux/productReducer';
import Loading from "../Global/Loading";
import ProductTableItem from "./ProductTableItem";
import ProductTableNavbar from "./ProductTableNavbar";
import ProductTablePagination from "./ProductTablePagination";
import ProductTableToolbar from "./ProductTableToolbar";

function ProductTable() {
    const { t } = useTranslation();
    const { authState, globalState, productState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { productsByFilter, getProductsByFilterState, getProductTotalCountState } = productState;

    const dispatch = useDispatch();

    const [condition, setCondition] = useState({
        filterArray: [],
        showCount: 10,
        sortby: "Categorys",
        currentPage: 0,
        activeState: "active",
        isGlobal: userInfo?.role === 0 ? "global" : "company",
        company: userInfo?.company,
        role: userInfo?.role,
        user_id: userInfo?.id
    });

    useEffect(() => {

        dispatch(getProductsByFilter(condition));
        dispatch(setProductSearchCondition({ ...condition }));
        // dispatch(getProductTotalCount(condition));
    }, [])

    useEffect(() => {
        if (globalState.condition.company) {
            setCondition({ ...globalState.condition });
            dispatch(getProductTotalCount(globalState.condition));
        }
    }, [globalState.condition])



    const setHandleCondition = (key, value) => {
        condition[`${key}`] = value;
        setCondition({ ...condition });

        dispatch(setProductSearchCondition({ ...condition }));
    }

    function getFilterProduct() {//filter
        dispatch(getProductsByFilter(condition));
    }

    return (
        <>
            <ProductTableToolbar setCondition={setHandleCondition} getData={getFilterProduct} condition={condition} />
            <div className="bg-white rounded-[2px]">
                {(getProductsByFilterState || getProductTotalCountState) && <Loading />}
                <ProductTableNavbar setCondition={setHandleCondition} getData={getFilterProduct} />

                <div>
                    <div className="overflow-x-auto overflow-y-hidden relative shadow-md">
                        <div className="overflow-y-scroll" style={{maxHeight: 'calc(100vh - 460px)'}}>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="border-b">
                                    <tr>
                                        <td className="pl-8 pr-2 py-4 w-4">
                                            <div className="flex items-center">
                                                <input id={`checkbox-table-search-all`} type="checkbox" className="w-6 h-6 text-sitebg-50 rounded border-gray-300 focus:ring-sitebg-50 dark:focus:ring-sitebg-50 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor={`checkbox-table-search-all`} className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <th className="flex items-center py-4 px-2 text-gray-900 whitespace-nowrap dark:text-white">
                                            <div className="flex justify-center w-20 h-20 opacity-0">
                                            </div>
                                            <div className="pl-3">
                                                <div className="font-semibold text-xs leading-5 text-[#94A3B8]">PRODUCT</div>
                                            </div>
                                        </th>
                                        <td className="py-4 px-2">
                                            <div className="font-semibold text-xs leading-5 text-[#94A3B8] pl-3">
                                                <span>VINTAGE</span>/
                                                <span>SIZE</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="font-semibold text-xs leading-5 text-[#94A3B8] pl-3">
                                                <span>CATEGORY</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="font-semibold text-xs leading-5 text-[#94A3B8] pl-3">
                                                <span>ORIGIN</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="font-semibold text-xs leading-5 text-[#94A3B8] pl-3">
                                                <span>ID</span>/
                                                <span>STATUS</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="pl-3">
                                                <div className="font-normal text-gray-500">ARTICLES-NR</div>
                                                <div className="font-normal text-gray-500">STATUS</div>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        productsByFilter && productsByFilter.length > 0 ? productsByFilter.map((data, index) =>
                                            <ProductTableItem key={data._id} data={data} condition={condition} pos={index} last={productsByFilter.length === index + 1} />
                                        ) : <tr><td className="p-6"><span className="px-4 text-lg">{t("nodata")}</span></td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <ProductTablePagination setCondition={setHandleCondition} getData={getFilterProduct} condition={condition} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductTable;
