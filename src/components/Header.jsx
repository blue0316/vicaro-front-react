import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authReducer";
import {
    setCompanyAndGlobal,
    setMenuCompanyAndGlobal,
    setNoSavedEditedWineMenuPage,
    setSelectedCompany,
    setUserCompanyAndGlobal
} from "../redux/globalReducer";
import { getAllCompany } from "../redux/locationReducer";
import { getMenusByFilter, getMenuTotalCount } from "../redux/menuReducer";
import {
    getProductsByFilter, getProductTotalCount
} from "../redux/productReducer";
import { getUsersByFilter, getUserTotalCount } from "../redux/userReducer";

import { openSnackBar } from "../redux/snackBarReducer";
import Cart from "./Cart";

import Help from "./theme/DropdownHelp";
import Notifications from "./theme/DropdownNotifications";
import DropdownProfile from "./theme/DropdownProfile";
import SearchModal from "./theme/ModalSearch";

function Header({ sidebarOpen, setSidebarOpen }) {
  const { t } = useTranslation();
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { authState, locationState, globalState } = useSelector(
    (state) => state
  );
  const { loggedIn, userInfo } = authState;
  const { companies } = locationState;
  const { noSavedEditedWineMenuPage } = globalState;

  const [isShow, setIsShow] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsShow(loggedIn);
  });

  useEffect(() => {
    dispatch(getAllCompany());
    dispatch(setCompanyAndGlobal(userInfo?.company));
    dispatch(
      setSelectedCompany(userInfo?.role === 0 ? "Global" : "Your Company")
    );
  }, [userInfo]);

  const logoutSite = () => {
    if (noSavedEditedWineMenuPage === false) {
      if (
        window.confirm("Leave Site?\n\nChanges you made may not be saved.") ===
        true
      ) {
        dispatch(setNoSavedEditedWineMenuPage(true));
        dispatch(logout()).then(() => {
          dispatch(
            openSnackBar({
              message: t("msg_success_logout"),
              status: "success",
            })
          );
          navigate("/signin");
        });
      }
    } else {
      dispatch(logout()).then(() => {
        dispatch(
          openSnackBar({ message: t("msg_success_logout"), status: "success" })
        );
        navigate("/signin");
      });
    }
  };

  const setCompanyForProduct = async (company, isGlobal, position) => {
    await dispatch(setCompanyAndGlobal({ company, isGlobal, position }));
    await dispatch(
      getProductsByFilter({
        ...globalState.condition,
        company: company,
        isGlobal: isGlobal ? "global" : "company",
        currentPage: 0,
      })
    );
    await dispatch(
      getProductTotalCount({
        ...globalState.condition,
        company: company,
        isGlobal: isGlobal ? "global" : "company",
        currentPage: 0,
      })
    );
  };

  const setCompanyForMenu = async (company, isGlobal, position) => {
    await dispatch(setMenuCompanyAndGlobal({ company, isGlobal, position }));
    await dispatch(
      getMenusByFilter({
        ...globalState.menuCondition,
        company: company,
        isGlobal: isGlobal ? "global" : "company",
        currentPage: 0,
      })
    );
    await dispatch(
      getMenuTotalCount({
        ...globalState.menuCondition,
        company: company,
        isGlobal: isGlobal ? "global" : "company",
        currentPage: 0,
      })
    );
  };

  const setCompanyForUser = async (company, isGlobal, position) => {
    await dispatch(setUserCompanyAndGlobal({ company, isGlobal, position }));
    await dispatch(
      getUsersByFilter({
        ...globalState.userCondition,
        company: company,
        isGlobal: isGlobal ? "global" : "company",
        currentPage: 0,
      })
    );
    await dispatch(
      getUserTotalCount({
        ...globalState.userCondition,
        company: company,
        isGlobal: isGlobal ? "global" : "company",
        currentPage: 0,
      })
    );
  };

  const navigateWithoutSave = (whereGO) => {
    if (noSavedEditedWineMenuPage === false) {
      if (
        window.confirm("Leave Site?\n\nChanges you made may not be saved.") ===
        true
      ) {
        dispatch(setNoSavedEditedWineMenuPage(true));
        navigate(whereGO);
      }
    } else {
      navigate(whereGO);
    }
  };

  return (
    isShow && (
      <header className="sticky top-0 bg-white border-b border-slate-200 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 -mb-px">
            {/* Header: Left side */}
            <div className="flex">
              {/* Hamburger button */}
              <button
                className="text-slate-500 hover:text-slate-600 lg:hidden mr-5"
                aria-controls="sidebar"
                aria-expanded={sidebarOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setSidebarOpen(!sidebarOpen);
                }}
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="5" width="16" height="2" />
                  <rect x="4" y="11" width="16" height="2" />
                  <rect x="4" y="17" width="16" height="2" />
                </svg>
              </button>
              <Cart />
            </div>
            {/* Header: Right side */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                <button
                  className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ml-3 ${
                    searchModalOpen && "bg-slate-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchModalOpen(true);
                  }}
                  aria-controls="search-modal"
                >
                  <span className="sr-only">Search</span>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="fill-current text-slate-500"
                      d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z"
                    />
                    <path
                      className="fill-current text-slate-400"
                      d="M15.707 14.293L13.314 11.9a8.019 8.019 0 01-1.414 1.414l2.393 2.393a.997.997 0 001.414 0 .999.999 0 000-1.414z"
                    />
                  </svg>
                </button>
                <SearchModal
                  id="search-modal"
                  searchId="search"
                  modalOpen={searchModalOpen}
                  setModalOpen={setSearchModalOpen}
                />
              </div>
              <div className="hidden md:block">
                <Notifications align="right" />
              </div>
              <Help
                align="right"
              />
              <hr className="w-px h-6 bg-slate-200 mx-3" />
              <DropdownProfile
                align="right"
                userInfo={userInfo}
                userAvatar={
                  "https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                }
              />
            </div>
          </div>
        </div>
      </header>
    )
  );
}

export default Header;
