import { useCallback } from "react";
import { useSelector } from 'react-redux'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function PaginationNav1({
    gotoPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageIndex,
}) {
    const renderPageLinks = useCallback(() => {
        if (pageCount === 0) return null;
        const visiblePageButtonCount = 5;
        let numberOfButtons =
            pageCount < visiblePageButtonCount ? pageCount : visiblePageButtonCount;
        const pageIndices = [pageIndex];
        numberOfButtons--;
        [...Array(numberOfButtons)].forEach((_item, itemIndex) => {
            const pageNumberBefore = pageIndices[0] - 1;
            const pageNumberAfter = pageIndices[pageIndices.length - 1] + 1;
            if (
                pageNumberBefore >= 0 &&
                (itemIndex < numberOfButtons / 2 || pageNumberAfter > pageCount - 1)
            ) {
                pageIndices.unshift(pageNumberBefore);
            } else {
                pageIndices.push(pageNumberAfter);
            }
        });
        return pageIndices.map((pageIndexToMap) => (
            <li key={pageIndexToMap}>
                <span
                onClick={() => gotoPage(pageIndexToMap)}
                active={pageIndex === pageIndexToMap}
                className="inline-flex items-center justify-center rounded-l leading-5 px-3.5 py-2 bg-white border border-slate-200 text-indigo-500"
                >
                    {pageIndexToMap + 1}
                </span>
            </li>
        ));
    }, [pageCount, pageIndex]);
    return (
        <div className="flex justify-center">
            <nav className="flex" role="navigation" aria-label="Navigation">
                <div className="mr-2">
                <span
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white border border-slate-200 text-slate-300"
                >
                    <span className="sr-only">Previous</span>
                    <wbr />
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
                    <path d="M9.4 13.4l1.4-1.4-4-4 4-4-1.4-1.4L4 8z" />
                    </svg>
                </span>
                </div>
                <ul className="inline-flex text-sm font-medium -space-x-px shadow-sm">
                {renderPageLinks()}
                </ul>
                <div className="ml-2">
                <span
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="inline-flex items-center justify-center rounded leading-5 px-2.5 py-2 bg-white hover:bg-indigo-500 border border-slate-200 text-slate-600 hover:text-white shadow-sm"
                >
                    <span className="sr-only">Next</span>
                    <wbr />
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 16 16">
                    <path d="M6.6 13.4L5.2 12l4-4-4-4 1.4-1.4L12 8z" />
                    </svg>
                </span>
                </div>
            </nav>
        </div>
    );
}

function CompanyTablePagination(props) {
    const { t } = useTranslation();
    const { companyState } = useSelector((state) => state);
    const { filter_count } = companyState;

    const { showCount, currentPage } = props.condition;

    const setCurrentPage = (value) => {
        const { setCondition, getData } = props;
        setCondition("currentPage", value);
        getData();
    }

    const total_count = filter_count;
    const total_page = Math.ceil(total_count / showCount);

    return (
        <div className="flex justify-between gap-3 flex-wrap py-6 pr-10 pl-6 border-t dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <div className="flex items-center">
                <p>{t("showing")} {showCount * currentPage + 1} {t("to")} {showCount * (currentPage + 1) < total_count ? showCount * (currentPage + 1) : total_count} of {total_count} {t("entries")} </p>
            </div>
            <PaginationNav1
                gotoPage={setCurrentPage}
                canPreviousPage={currentPage > 0}
                canNextPage={currentPage < total_page - 1}
                pageCount={total_page}
                pageIndex={currentPage}
            />
        </div>
    );
}

export default CompanyTablePagination;
