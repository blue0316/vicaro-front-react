import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { logout } from "../redux/authReducer";
import {
  setCompanyAndGlobal,
  setMenuCompanyAndGlobal,
  setNoSavedEditedWineMenuPage,
  setSelectedCompany,
  setUserCompanyAndGlobal,
} from "../redux/globalReducer";
import { getAllCompany } from "../redux/locationReducer";
import { getMenusByFilter, getMenuTotalCount } from "../redux/menuReducer";
import {
  getProductsByFilter,
  getProductTotalCount,
} from "../redux/productReducer";
import { getUsersByFilter, getUserTotalCount } from "../redux/userReducer";
import { openSnackBar } from "../redux/snackBarReducer";

import SidebarLinkGroup from "./SidebarLinkGroup";
import Cart from "./Cart";
import Help from "./theme/DropdownHelp";
import Notifications from "./theme/DropdownNotifications";
import DropdownProfile from "./theme/DropdownProfile";
import SearchModal from "./theme/ModalSearch";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

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

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);

    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);

    return () => {
      document.removeEventListener("keydown", keyHandler);
      document.removeEventListener("click", clickHandler);

      return;
    };
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

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
    <div>
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-60 lg:sidebar-expanded:!w-60 2xl:!w-60 shrink-0 bg-slate-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-60"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex flex-col justify-between mb-11 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden mb-4 text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <NavLink end to="/" className="mt-1 block">
            <svg
              width="192"
              height="24"
              viewBox="0 0 192 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_21_1054)">
                <path
                  d="M24.0077 23.4571H11.9423C11.4701 23.4571 10.9034 23.1162 10.6816 22.7014L0.248672 3.11686C-0.367324 1.96289 0.201446 1.01836 1.50941 1.01836H13.5747C14.047 1.01836 14.6137 1.35922 14.8355 1.77399L25.2705 21.3565C25.8865 22.5105 25.3177 23.455 24.0097 23.455L24.0077 23.4571ZM34.7917 1.01836H22.7223C22.25 1.01836 21.6812 1.35922 21.4615 1.77809L21.0961 2.46596C20.901 2.8335 20.901 3.43512 21.0961 3.80267L27.1308 15.2007C27.8248 16.5107 28.9603 16.5107 29.6543 15.2007L36.0545 3.11481C36.6643 1.96289 36.0976 1.01836 34.7938 1.01836H34.7917Z"
                  fill="url(#paint0_linear_21_1054)"
                />
                {sidebarExpanded && (
                  <path
                    d="M86.3234 2.66307V21.6522C86.3234 22.6357 85.5821 23.377 84.5986 23.377H83.457C82.4734 23.377 81.7322 22.6357 81.7322 21.6522V2.66307C81.7322 1.67953 82.4734 0.938279 83.457 0.938279H84.5986C85.5821 0.938279 86.3234 1.67953 86.3234 2.66307ZM143.114 8.01608V21.6501C143.114 22.6337 142.373 23.3749 141.389 23.3749H140.248C139.455 23.3749 138.821 22.8924 138.603 22.1922C137.359 23.0259 135.628 23.3749 133.18 23.3749H129.683C122.127 23.3749 120.998 19.2313 120.998 16.7591C120.998 14.4799 121.552 12.8927 122.741 11.7613C123.93 10.632 125.69 9.99138 128.445 9.68748L138.428 8.5828C138.465 8.57869 138.496 8.57253 138.521 8.56842C138.521 8.56226 138.521 8.55816 138.521 8.552C138.521 7.14753 138.371 6.40012 138.018 6.0531C137.613 5.65271 136.626 5.45969 134.999 5.45969H124.328C123.345 5.45969 122.604 4.71845 122.604 3.7349V2.66512C122.604 1.68158 123.345 0.940333 124.328 0.940333H135.036C140.624 0.940333 143.114 3.12301 143.114 8.02019V8.01608ZM138.521 14.0836V13.0221L128.991 14.0878C125.587 14.4512 125.587 15.1411 125.587 16.6524C125.587 17.3792 125.587 18.8884 129.679 18.8884H133.712C137.486 18.8884 138.519 17.8556 138.519 14.0816L138.521 14.0836ZM163.541 0.938279H159.756C158.085 0.938279 156.212 1.09639 154.744 1.97315C154.488 1.35305 153.888 0.938279 153.153 0.938279H152.011C151.028 0.938279 150.286 1.67953 150.286 2.66307V21.6522C150.286 22.6357 151.028 23.377 152.011 23.377H153.153C154.136 23.377 154.878 22.6357 154.878 21.6522V9.9462C154.878 7.93395 155.165 6.68553 155.759 6.12702C156.262 5.65271 157.171 5.45969 158.9 5.45969H163.541C164.524 5.45969 165.265 4.71845 165.265 3.7349V2.66512C165.265 1.68158 164.524 0.940333 163.541 0.940333V0.938279ZM192 9.94415V14.2623C192 16.7489 191.798 19.2909 190.332 21.0485C188.99 22.6583 186.858 23.377 183.423 23.377H177.497C174.062 23.377 171.93 22.6583 170.588 21.0485C169.122 19.2909 168.92 16.7489 168.92 14.2623V9.94415C168.92 5.80876 169.764 4.24618 170.592 3.26264C171.924 1.67542 174.119 0.938279 177.499 0.938279H183.425C186.805 0.938279 189 1.67748 190.332 3.26264C191.805 5.01412 192.004 7.6239 192.004 9.94415H192ZM186.729 6.15166C186.275 5.66503 185.275 5.45764 183.386 5.45764H177.532C175.643 5.45764 174.643 5.66503 174.189 6.15166C173.713 6.66089 173.51 7.76352 173.51 9.83738V14.3711C173.51 16.5209 173.711 17.6585 174.181 18.1698C174.622 18.6502 175.624 18.8556 177.53 18.8556H183.384C185.289 18.8556 186.291 18.6502 186.733 18.1698C187.203 17.6564 187.404 16.5209 187.404 14.3711V9.83738C187.404 7.76352 187.201 6.66089 186.725 6.15166H186.729ZM98.4688 6.15166C98.9226 5.66503 99.9225 5.45764 101.812 5.45764H107.666C109.321 5.45764 110.286 5.61575 110.793 5.97303C111.115 6.19889 111.464 6.63419 111.612 8.13928C111.696 8.99346 112.409 9.6382 113.269 9.6382H114.524C114.992 9.6382 115.442 9.43903 115.758 9.09202C116.072 8.74501 116.228 8.28096 116.183 7.81486C115.706 2.8643 113.329 0.936226 107.701 0.936226H101.775C98.3949 0.936226 96.1999 1.67542 94.8673 3.26059C94.0418 4.24413 93.1959 5.80671 93.1959 9.9421V14.2602C93.1959 16.7468 93.3971 19.2888 94.8632 21.0465C96.206 22.6563 98.3374 23.3749 101.773 23.3749H107.698C113.308 23.3749 115.684 21.4469 116.175 16.5025C116.222 16.0364 116.066 15.5703 115.752 15.2232C115.435 14.8742 114.986 14.675 114.516 14.675H113.263C112.401 14.675 111.688 15.3197 111.606 16.176C111.46 17.6729 111.119 18.1061 110.807 18.3299C110.3 18.6934 109.331 18.8556 107.662 18.8556H101.807C99.902 18.8556 98.9 18.6502 98.4585 18.1698C97.9883 17.6564 97.7871 16.5209 97.7871 14.3711V9.83738C97.7871 7.76352 97.9904 6.66089 98.4667 6.15166H98.4688ZM75.2252 3.30165L75.2108 3.32835L65.0797 22.3421C64.745 22.9992 64.127 23.3749 63.3816 23.3749H61.6692C60.9238 23.3749 60.3058 22.9992 59.9711 22.3401L49.8256 3.30165C49.5525 2.75547 49.5648 2.16617 49.8605 1.68774C50.1521 1.21753 50.6818 0.936226 51.2835 0.936226H52.6037C53.3491 0.936226 53.9671 1.31404 54.3018 1.9711L62.5254 17.5004L70.7489 1.97315C71.0836 1.31404 71.7037 0.938279 72.4491 0.938279H73.8043C74.4018 0.938279 74.911 1.20726 75.2005 1.67337C75.4962 2.14974 75.5044 2.7452 75.2252 3.30165Z"
                    fill="white"
                  />
                )}
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_21_1054"
                  x1="6.26283"
                  y1="-0.293708"
                  x2="19.9174"
                  y2="23.5248"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#6366F1" />
                  <stop offset="0.997048" stopColor="#1E24B3" />
                </linearGradient>
                <clipPath id="clip0_21_1054">
                  <rect
                    width="192"
                    height="22.5188"
                    fill="white"
                    transform="translate(0 0.938286)"
                  />
                </clipPath>
              </defs>
            </svg>
            <div className=""></div>
          </NavLink>
        </div>

        {/* Links */}
        <div className="space-y-8 flex flex-col flex-1">
          {/* Pages group */}
          <div className="flex-1">
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                Pages
              </span>
            </h3>
            <ul className="mt-3">
              {userInfo?.role === 0 ? (
                <>
                  <SidebarLinkGroup
                    activecondition={
                      pathname === "/" || pathname.includes("products")
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              (pathname === "/" ||
                                pathname.includes("products")) &&
                              "hover:text-slate-200"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  className="shrink-0 h-6 w-6"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      (pathname === "/" ||
                                        pathname.includes("products")) &&
                                      "!text-indigo-500"
                                    }`}
                                    d="M19.77 11.25H15.73C13.72 11.25 12.75 10.36 12.75 8.52V3.98C12.75 2.14 13.73 1.25 15.73 1.25H19.77C21.78 1.25 22.75 2.14 22.75 3.98V8.51C22.75 10.36 21.77 11.25 19.77 11.25ZM15.73 2.75C14.39 2.75 14.25 3.13 14.25 3.98V8.51C14.25 9.37 14.39 9.74 15.73 9.74H19.77C21.11 9.74 21.25 9.36 21.25 8.51V3.98C21.25 3.12 21.11 2.75 19.77 2.75H15.73Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      (pathname === "/" ||
                                        pathname.includes("products")) &&
                                      "!text-indigo-500"
                                    }`}
                                    d="M19.77 22.75H15.73C13.72 22.75 12.75 21.77 12.75 19.77V15.73C12.75 13.72 13.73 12.75 15.73 12.75H19.77C21.78 12.75 22.75 13.73 22.75 15.73V19.77C22.75 21.77 21.77 22.75 19.77 22.75ZM15.73 14.25C14.55 14.25 14.25 14.55 14.25 15.73V19.77C14.25 20.95 14.55 21.25 15.73 21.25H19.77C20.95 21.25 21.25 20.95 21.25 19.77V15.73C21.25 14.55 20.95 14.25 19.77 14.25H15.73Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      (pathname === "/" ||
                                        pathname.includes("products")) &&
                                      "!text-indigo-500"
                                    }`}
                                    d="M8.27 11.25H4.23C2.22 11.25 1.25 10.36 1.25 8.52V3.98C1.25 2.14 2.23 1.25 4.23 1.25H8.27C10.28 1.25 11.25 2.14 11.25 3.98V8.51C11.25 10.36 10.27 11.25 8.27 11.25ZM4.23 2.75C2.89 2.75 2.75 3.13 2.75 3.98V8.51C2.75 9.37 2.89 9.74 4.23 9.74H8.27C9.61 9.74 9.75 9.36 9.75 8.51V3.98C9.75 3.12 9.61 2.75 8.27 2.75H4.23Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      (pathname === "/" ||
                                        pathname.includes("products")) &&
                                      "!text-indigo-500"
                                    }`}
                                    d="M8.27 22.75H4.23C2.22 22.75 1.25 21.77 1.25 19.77V15.73C1.25 13.72 2.23 12.75 4.23 12.75H8.27C10.28 12.75 11.25 13.73 11.25 15.73V19.77C11.25 21.77 10.27 22.75 8.27 22.75ZM4.23 14.25C3.05 14.25 2.75 14.55 2.75 15.73V19.77C2.75 20.95 3.05 21.25 4.23 21.25H8.27C9.45 21.25 9.75 20.95 9.75 19.77V15.73C9.75 14.55 9.45 14.25 8.27 14.25H4.23Z"
                                    fill="#6366F1"
                                  />
                                </svg>
                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  {t("products")}
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && "rotate-180"
                                  }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/"
                                  className={({ isActive }) =>
                                    "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                    (isActive ? "!text-indigo-500" : "")
                                  }
                                >
                                  <span
                                    onClick={() => {
                                      navigateWithoutSave("products");
                                      setCompanyForProduct(
                                        userInfo?.company,
                                        true,
                                        "Global"
                                      );
                                    }}
                                    className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                                  >
                                    {t("global")}
                                  </span>
                                </NavLink>
                              </li>
                              {companies?.length > 0 &&
                                companies.map((data, index) => (
                                  <li
                                    key={`product-${index}`}
                                    className="mb-1 last:mb-0"
                                  >
                                    <NavLink
                                      end
                                      to="/"
                                      className={({ isActive }) =>
                                        "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                        (isActive ? "!text-indigo-500" : "")
                                      }
                                    >
                                      <span
                                        className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                                        onClick={() => {
                                          navigateWithoutSave("products");
                                          setCompanyForProduct(
                                            data._id,
                                            false,
                                            data.name
                                          );
                                        }}
                                      >
                                        {data.name}
                                      </span>
                                    </NavLink>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <SidebarLinkGroup activecondition={pathname.includes("menu")}>
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              pathname.includes("menu") &&
                              "hover:text-slate-200"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M18 15.25C17.59 15.25 17.25 14.91 17.25 14.5C17.25 13.81 16.69 13.25 16 13.25H8C7.31 13.25 6.75 13.81 6.75 14.5C6.75 14.91 6.41 15.25 6 15.25C5.59 15.25 5.25 14.91 5.25 14.5V7.75C5.25 6.23 6.48 5 8 5H16C17.52 5 18.75 6.23 18.75 7.75V14.5C18.75 14.91 18.41 15.25 18 15.25ZM8 11.75H16C16.45 11.75 16.88 11.86 17.25 12.05V7.75C17.25 7.06 16.69 6.5 16 6.5H8C7.31 6.5 6.75 7.06 6.75 7.75V12.05C7.12 11.86 7.55 11.75 8 11.75Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M19 16.5H18C17.59 16.5 17.25 16.16 17.25 15.75C17.25 15.34 17.59 15 18 15H19C19.41 15 19.75 15.34 19.75 15.75C19.75 16.16 19.41 16.5 19 16.5Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M6 16.5H5C4.59 16.5 4.25 16.16 4.25 15.75C4.25 15.34 4.59 15 5 15H6C6.41 15 6.75 15.34 6.75 15.75C6.75 16.16 6.41 16.5 6 16.5Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M18 14.75C17.59 14.75 17.25 14.41 17.25 14V11C17.25 10.31 16.69 9.75 16 9.75H8C7.31 9.75 6.75 10.31 6.75 11V14C6.75 14.41 6.41 14.75 6 14.75C5.59 14.75 5.25 14.41 5.25 14V11C5.25 9.48 6.48 8.25 8 8.25H16C17.52 8.25 18.75 9.48 18.75 11V14C18.75 14.41 18.41 14.75 18 14.75Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M12 19C10.47 19 9.18003 17.93 8.84003 16.5H6C5.59 16.5 5.25 16.16 5.25 15.75V14.5C5.25 12.98 6.48 11.75 8 11.75H16C17.52 11.75 18.75 12.98 18.75 14.5V15.75C18.75 16.16 18.41 16.5 18 16.5H15.16C14.82 17.93 13.53 19 12 19ZM6.75 15H9.5C9.91 15 10.25 15.34 10.25 15.75C10.25 16.71 11.04 17.5 12 17.5C12.96 17.5 13.75 16.71 13.75 15.75C13.75 15.34 14.09 15 14.5 15H17.25V14.5C17.25 13.81 16.69 13.25 16 13.25H8C7.31 13.25 6.75 13.81 6.75 14.5V15Z"
                                    fill="#6366F1"
                                  />
                                </svg>

                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  {t("wine_menus")}
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && "rotate-180"
                                  }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/menu"
                                  className={({ isActive }) =>
                                    "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                    (isActive ? "!text-indigo-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    {t("global")}
                                  </span>
                                </NavLink>
                              </li>
                              {companies?.length > 0 &&
                                companies.map((data, index) => (
                                  <li
                                    key={`menu-${index}`}
                                    className="mb-1 last:mb-0"
                                  >
                                    <NavLink
                                      end
                                      to="/menu"
                                      className={({ isActive }) =>
                                        "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                        (isActive ? "!text-indigo-500" : "")
                                      }
                                    >
                                      <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                        {data.name}
                                      </span>
                                    </NavLink>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <SidebarLinkGroup
                    activecondition={pathname.includes("company")}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              pathname.includes("company") &&
                              "hover:text-slate-200"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M9.16055 11.62C9.13055 11.62 9.11055 11.62 9.08055 11.62C9.03055 11.61 8.96055 11.61 8.90055 11.62C6.00055 11.53 3.81055 9.25 3.81055 6.44C3.81055 3.58 6.14055 1.25 9.00055 1.25C11.8605 1.25 14.1905 3.58 14.1905 6.44C14.1805 9.25 11.9805 11.53 9.19055 11.62C9.18055 11.62 9.17055 11.62 9.16055 11.62ZM9.00055 2.75C6.97055 2.75 5.31055 4.41 5.31055 6.44C5.31055 8.44 6.87055 10.05 8.86055 10.12C8.92055 10.11 9.05055 10.11 9.18055 10.12C11.1405 10.03 12.6805 8.42 12.6905 6.44C12.6905 4.41 11.0305 2.75 9.00055 2.75Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M16.5404 11.75C16.5104 11.75 16.4804 11.75 16.4504 11.74C16.0404 11.78 15.6204 11.49 15.5804 11.08C15.5404 10.67 15.7904 10.3 16.2004 10.25C16.3204 10.24 16.4504 10.24 16.5604 10.24C18.0204 10.16 19.1604 8.96 19.1604 7.49C19.1604 5.97 17.9304 4.74 16.4104 4.74C16.0004 4.75 15.6604 4.41 15.6604 4C15.6604 3.59 16.0004 3.25 16.4104 3.25C18.7504 3.25 20.6604 5.16 20.6604 7.5C20.6604 9.8 18.8604 11.66 16.5704 11.75C16.5604 11.75 16.5504 11.75 16.5404 11.75Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M9.16961 22.55C7.20961 22.55 5.23961 22.05 3.74961 21.05C2.35961 20.13 1.59961 18.87 1.59961 17.5C1.59961 16.13 2.35961 14.86 3.74961 13.93C6.74961 11.94 11.6096 11.94 14.5896 13.93C15.9696 14.85 16.7396 16.11 16.7396 17.48C16.7396 18.85 15.9796 20.12 14.5896 21.05C13.0896 22.05 11.1296 22.55 9.16961 22.55ZM4.57961 15.19C3.61961 15.83 3.09961 16.65 3.09961 17.51C3.09961 18.36 3.62961 19.18 4.57961 19.81C7.06961 21.48 11.2696 21.48 13.7596 19.81C14.7196 19.17 15.2396 18.35 15.2396 17.49C15.2396 16.64 14.7096 15.82 13.7596 15.19C11.2696 13.53 7.06961 13.53 4.57961 15.19Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M18.3402 20.75C17.9902 20.75 17.6802 20.51 17.6102 20.15C17.5302 19.74 17.7902 19.35 18.1902 19.26C18.8202 19.13 19.4002 18.88 19.8502 18.53C20.4202 18.1 20.7302 17.56 20.7302 16.99C20.7302 16.42 20.4202 15.88 19.8602 15.46C19.4202 15.12 18.8702 14.88 18.2202 14.73C17.8202 14.64 17.5602 14.24 17.6502 13.83C17.7402 13.43 18.1402 13.17 18.5502 13.26C19.4102 13.45 20.1602 13.79 20.7702 14.26C21.7002 14.96 22.2302 15.95 22.2302 16.99C22.2302 18.03 21.6902 19.02 20.7602 19.73C20.1402 20.21 19.3602 20.56 18.5002 20.73C18.4402 20.75 18.3902 20.75 18.3402 20.75Z"
                                    fill="#6366F1"
                                  />
                                </svg>

                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  {t("companies&users")}
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && "rotate-180"
                                  }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/community/users-tabs"
                                  className={({ isActive }) =>
                                    "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                    (isActive ? "!text-indigo-500" : "")
                                  }
                                >
                                  <span
                                    onClick={() =>
                                      navigateWithoutSave("company")
                                    }
                                    className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                                  >
                                    {t("global")}
                                  </span>
                                </NavLink>
                              </li>
                              {companies?.length > 0 &&
                                companies.map((data, index) => (
                                  <li
                                    key={`company-user-${index}`}
                                    className="mb-1 last:mb-0"
                                  >
                                    <NavLink
                                      end
                                      to="/community/users-tiles"
                                      className={({ isActive }) =>
                                        "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                        (isActive ? "!text-indigo-500" : "")
                                      }
                                    >
                                      <span
                                        onClick={() => {
                                          navigateWithoutSave("user");
                                          setCompanyForUser(
                                            data._id,
                                            false,
                                            data.name
                                          );
                                        }}
                                        className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200"
                                      >
                                        {data.name}
                                      </span>
                                    </NavLink>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                  <li
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                      pathname.includes("chat") && "bg-slate-900"
                    }`}
                  >
                    <NavLink
                      end
                      to="/messages"
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        pathname.includes("chat") && "hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className={`fill-current text-slate-600 ${
                                pathname.includes("chat") && "text-indigo-500"
                              }`}
                              d="M17.8701 21.8698C17.5601 21.8698 17.2501 21.7898 16.9701 21.6198L12.9601 19.2397C12.5401 19.2297 12.1201 19.1998 11.7201 19.1398C11.4501 19.0998 11.2201 18.9197 11.1201 18.6597C11.0201 18.3997 11.0701 18.1197 11.2501 17.9097C11.9101 17.1397 12.2501 16.2197 12.2501 15.2397C12.2501 12.8197 10.1201 10.8497 7.50008 10.8497C6.52008 10.8497 5.58007 11.1198 4.79007 11.6398C4.57007 11.7798 4.30007 11.7998 4.06007 11.6898C3.83007 11.5798 3.66008 11.3597 3.63008 11.0997C3.60008 10.8197 3.58008 10.5398 3.58008 10.2498C3.58008 5.28975 7.88008 1.25977 13.1601 1.25977C18.4401 1.25977 22.7401 5.28975 22.7401 10.2498C22.7401 12.9698 21.4801 15.4697 19.2601 17.1797L19.6001 19.8998C19.6801 20.5798 19.3801 21.2198 18.8101 21.5898C18.5301 21.7698 18.2001 21.8698 17.8701 21.8698ZM13.1501 17.7297C13.2901 17.7197 13.4301 17.7598 13.5501 17.8398L17.7401 20.3298C17.8501 20.3998 17.9401 20.3698 18.0001 20.3298C18.0501 20.2998 18.1301 20.2198 18.1101 20.0798L17.7201 16.9197C17.6901 16.6397 17.8101 16.3698 18.0301 16.2098C20.0701 14.7798 21.2401 12.5997 21.2401 10.2297C21.2401 6.09974 17.6201 2.73975 13.1601 2.73975C8.87008 2.73975 5.35007 5.85979 5.09007 9.77979C5.84007 9.48979 6.65008 9.32977 7.49008 9.32977C10.9401 9.32977 13.7401 11.9697 13.7401 15.2197C13.7501 16.0997 13.5401 16.9497 13.1501 17.7297Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-600 ${
                                pathname.includes("chat") && "text-indigo-500"
                              }`}
                              d="M4.57977 22.7498C4.31977 22.7498 4.06977 22.6798 3.83977 22.5298C3.38977 22.2398 3.14978 21.7398 3.20978 21.2098L3.40977 19.6698C2.05977 18.5698 1.25977 16.9398 1.25977 15.2298C1.25977 13.2798 2.27978 11.4598 3.98978 10.3698C5.01978 9.69981 6.23977 9.33984 7.50977 9.33984C10.9598 9.33984 13.7598 11.9798 13.7598 15.2298C13.7598 16.5498 13.2798 17.8498 12.3998 18.8798C11.2698 20.2498 9.57977 21.0498 7.71977 21.1098L5.27977 22.5598C5.05977 22.6898 4.81977 22.7498 4.57977 22.7498ZM7.49977 10.8398C6.51977 10.8398 5.57976 11.1098 4.78976 11.6298C3.50976 12.4498 2.74977 13.7898 2.74977 15.2298C2.74977 16.6198 3.42978 17.8898 4.62978 18.7098C4.85978 18.8698 4.97977 19.1398 4.94977 19.4198L4.72977 21.1298L7.11977 19.7098C7.23977 19.6398 7.36977 19.5998 7.49977 19.5998C8.96977 19.5998 10.3598 18.9698 11.2398 17.8998C11.8998 17.1198 12.2498 16.1998 12.2498 15.2198C12.2498 12.8098 10.1198 10.8398 7.49977 10.8398Z"
                              fill="#6366F1"
                            />
                          </svg>

                          <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            Chat
                          </span>
                        </div>
                        {/* Badge */}
                        <div className="flex flex-shrink-0 ml-2">
                          <span className="inline-flex items-center justify-center h-5 text-xs font-medium text-white bg-indigo-500 px-2 rounded">
                            4
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                      pathname.includes("products") && "bg-slate-900"
                    }`}
                  >
                    <NavLink
                      end
                      to="/products"
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        pathname.includes("products") && "hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <svg
                            className="shrink-0 h-6 w-6"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className={`fill-current text-slate-400 ${
                                (pathname === "/" ||
                                  pathname.includes("products")) &&
                                "!text-indigo-500"
                              }`}
                              d="M19.77 11.25H15.73C13.72 11.25 12.75 10.36 12.75 8.52V3.98C12.75 2.14 13.73 1.25 15.73 1.25H19.77C21.78 1.25 22.75 2.14 22.75 3.98V8.51C22.75 10.36 21.77 11.25 19.77 11.25ZM15.73 2.75C14.39 2.75 14.25 3.13 14.25 3.98V8.51C14.25 9.37 14.39 9.74 15.73 9.74H19.77C21.11 9.74 21.25 9.36 21.25 8.51V3.98C21.25 3.12 21.11 2.75 19.77 2.75H15.73Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                (pathname === "/" ||
                                  pathname.includes("products")) &&
                                "!text-indigo-500"
                              }`}
                              d="M19.77 22.75H15.73C13.72 22.75 12.75 21.77 12.75 19.77V15.73C12.75 13.72 13.73 12.75 15.73 12.75H19.77C21.78 12.75 22.75 13.73 22.75 15.73V19.77C22.75 21.77 21.77 22.75 19.77 22.75ZM15.73 14.25C14.55 14.25 14.25 14.55 14.25 15.73V19.77C14.25 20.95 14.55 21.25 15.73 21.25H19.77C20.95 21.25 21.25 20.95 21.25 19.77V15.73C21.25 14.55 20.95 14.25 19.77 14.25H15.73Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                (pathname === "/" ||
                                  pathname.includes("products")) &&
                                "!text-indigo-500"
                              }`}
                              d="M8.27 11.25H4.23C2.22 11.25 1.25 10.36 1.25 8.52V3.98C1.25 2.14 2.23 1.25 4.23 1.25H8.27C10.28 1.25 11.25 2.14 11.25 3.98V8.51C11.25 10.36 10.27 11.25 8.27 11.25ZM4.23 2.75C2.89 2.75 2.75 3.13 2.75 3.98V8.51C2.75 9.37 2.89 9.74 4.23 9.74H8.27C9.61 9.74 9.75 9.36 9.75 8.51V3.98C9.75 3.12 9.61 2.75 8.27 2.75H4.23Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                (pathname === "/" ||
                                  pathname.includes("products")) &&
                                "!text-indigo-500"
                              }`}
                              d="M8.27 22.75H4.23C2.22 22.75 1.25 21.77 1.25 19.77V15.73C1.25 13.72 2.23 12.75 4.23 12.75H8.27C10.28 12.75 11.25 13.73 11.25 15.73V19.77C11.25 21.77 10.27 22.75 8.27 22.75ZM4.23 14.25C3.05 14.25 2.75 14.55 2.75 15.73V19.77C2.75 20.95 3.05 21.25 4.23 21.25H8.27C9.45 21.25 9.75 20.95 9.75 19.77V15.73C9.75 14.55 9.45 14.25 8.27 14.25H4.23Z"
                              fill="#6366F1"
                            />
                          </svg>
                          <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            {t("products")}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                  <li
                    className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 ${
                      pathname.includes("menu") && "bg-slate-900"
                    }`}
                  >
                    <NavLink
                      end
                      to="/menu"
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        pathname.includes("menu") && "hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="grow flex items-center">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className={`fill-current text-slate-400 ${
                                pathname.includes("menu") && "text-indigo-300"
                              }`}
                              d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                pathname.includes("menu") && "text-indigo-300"
                              }`}
                              d="M18 15.25C17.59 15.25 17.25 14.91 17.25 14.5C17.25 13.81 16.69 13.25 16 13.25H8C7.31 13.25 6.75 13.81 6.75 14.5C6.75 14.91 6.41 15.25 6 15.25C5.59 15.25 5.25 14.91 5.25 14.5V7.75C5.25 6.23 6.48 5 8 5H16C17.52 5 18.75 6.23 18.75 7.75V14.5C18.75 14.91 18.41 15.25 18 15.25ZM8 11.75H16C16.45 11.75 16.88 11.86 17.25 12.05V7.75C17.25 7.06 16.69 6.5 16 6.5H8C7.31 6.5 6.75 7.06 6.75 7.75V12.05C7.12 11.86 7.55 11.75 8 11.75Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                pathname.includes("menu") && "text-indigo-300"
                              }`}
                              d="M19 16.5H18C17.59 16.5 17.25 16.16 17.25 15.75C17.25 15.34 17.59 15 18 15H19C19.41 15 19.75 15.34 19.75 15.75C19.75 16.16 19.41 16.5 19 16.5Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                pathname.includes("menu") && "text-indigo-300"
                              }`}
                              d="M6 16.5H5C4.59 16.5 4.25 16.16 4.25 15.75C4.25 15.34 4.59 15 5 15H6C6.41 15 6.75 15.34 6.75 15.75C6.75 16.16 6.41 16.5 6 16.5Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                pathname.includes("menu") && "text-indigo-300"
                              }`}
                              d="M18 14.75C17.59 14.75 17.25 14.41 17.25 14V11C17.25 10.31 16.69 9.75 16 9.75H8C7.31 9.75 6.75 10.31 6.75 11V14C6.75 14.41 6.41 14.75 6 14.75C5.59 14.75 5.25 14.41 5.25 14V11C5.25 9.48 6.48 8.25 8 8.25H16C17.52 8.25 18.75 9.48 18.75 11V14C18.75 14.41 18.41 14.75 18 14.75Z"
                              fill="#6366F1"
                            />
                            <path
                              className={`fill-current text-slate-400 ${
                                pathname.includes("menu") && "text-indigo-300"
                              }`}
                              d="M12 19C10.47 19 9.18003 17.93 8.84003 16.5H6C5.59 16.5 5.25 16.16 5.25 15.75V14.5C5.25 12.98 6.48 11.75 8 11.75H16C17.52 11.75 18.75 12.98 18.75 14.5V15.75C18.75 16.16 18.41 16.5 18 16.5H15.16C14.82 17.93 13.53 19 12 19ZM6.75 15H9.5C9.91 15 10.25 15.34 10.25 15.75C10.25 16.71 11.04 17.5 12 17.5C12.96 17.5 13.75 16.71 13.75 15.75C13.75 15.34 14.09 15 14.5 15H17.25V14.5C17.25 13.81 16.69 13.25 16 13.25H8C7.31 13.25 6.75 13.81 6.75 14.5V15Z"
                              fill="#6366F1"
                            />
                          </svg>

                          <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                            {t("wine_menus")}
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </li>
                  <SidebarLinkGroup
                    activecondition={pathname.includes("company")}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <a
                            href="#0"
                            className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                              pathname.includes("company") &&
                              "hover:text-slate-200"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M9.16055 11.62C9.13055 11.62 9.11055 11.62 9.08055 11.62C9.03055 11.61 8.96055 11.61 8.90055 11.62C6.00055 11.53 3.81055 9.25 3.81055 6.44C3.81055 3.58 6.14055 1.25 9.00055 1.25C11.8605 1.25 14.1905 3.58 14.1905 6.44C14.1805 9.25 11.9805 11.53 9.19055 11.62C9.18055 11.62 9.17055 11.62 9.16055 11.62ZM9.00055 2.75C6.97055 2.75 5.31055 4.41 5.31055 6.44C5.31055 8.44 6.87055 10.05 8.86055 10.12C8.92055 10.11 9.05055 10.11 9.18055 10.12C11.1405 10.03 12.6805 8.42 12.6905 6.44C12.6905 4.41 11.0305 2.75 9.00055 2.75Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M16.5404 11.75C16.5104 11.75 16.4804 11.75 16.4504 11.74C16.0404 11.78 15.6204 11.49 15.5804 11.08C15.5404 10.67 15.7904 10.3 16.2004 10.25C16.3204 10.24 16.4504 10.24 16.5604 10.24C18.0204 10.16 19.1604 8.96 19.1604 7.49C19.1604 5.97 17.9304 4.74 16.4104 4.74C16.0004 4.75 15.6604 4.41 15.6604 4C15.6604 3.59 16.0004 3.25 16.4104 3.25C18.7504 3.25 20.6604 5.16 20.6604 7.5C20.6604 9.8 18.8604 11.66 16.5704 11.75C16.5604 11.75 16.5504 11.75 16.5404 11.75Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M9.16961 22.55C7.20961 22.55 5.23961 22.05 3.74961 21.05C2.35961 20.13 1.59961 18.87 1.59961 17.5C1.59961 16.13 2.35961 14.86 3.74961 13.93C6.74961 11.94 11.6096 11.94 14.5896 13.93C15.9696 14.85 16.7396 16.11 16.7396 17.48C16.7396 18.85 15.9796 20.12 14.5896 21.05C13.0896 22.05 11.1296 22.55 9.16961 22.55ZM4.57961 15.19C3.61961 15.83 3.09961 16.65 3.09961 17.51C3.09961 18.36 3.62961 19.18 4.57961 19.81C7.06961 21.48 11.2696 21.48 13.7596 19.81C14.7196 19.17 15.2396 18.35 15.2396 17.49C15.2396 16.64 14.7096 15.82 13.7596 15.19C11.2696 13.53 7.06961 13.53 4.57961 15.19Z"
                                    fill="#6366F1"
                                  />
                                  <path
                                    className={`fill-current text-slate-600 ${
                                      pathname.includes("company") &&
                                      "text-indigo-500"
                                    }`}
                                    d="M18.3402 20.75C17.9902 20.75 17.6802 20.51 17.6102 20.15C17.5302 19.74 17.7902 19.35 18.1902 19.26C18.8202 19.13 19.4002 18.88 19.8502 18.53C20.4202 18.1 20.7302 17.56 20.7302 16.99C20.7302 16.42 20.4202 15.88 19.8602 15.46C19.4202 15.12 18.8702 14.88 18.2202 14.73C17.8202 14.64 17.5602 14.24 17.6502 13.83C17.7402 13.43 18.1402 13.17 18.5502 13.26C19.4102 13.45 20.1602 13.79 20.7702 14.26C21.7002 14.96 22.2302 15.95 22.2302 16.99C22.2302 18.03 21.6902 19.02 20.7602 19.73C20.1402 20.21 19.3602 20.56 18.5002 20.73C18.4402 20.75 18.3902 20.75 18.3402 20.75Z"
                                    fill="#6366F1"
                                  />
                                </svg>

                                <span className="text-sm font-medium ml-3 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                  {t("companies&users")}
                                </span>
                              </div>
                              {/* Icon */}
                              <div className="flex shrink-0 ml-2">
                                <svg
                                  className={`w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 ${
                                    open && "rotate-180"
                                  }`}
                                  viewBox="0 0 12 12"
                                >
                                  <path
                                    className={`fill-current text-slate-400 ${
                                      pathname.includes("menu") &&
                                      "text-indigo-300"
                                    }`}
                                    d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </a>
                          <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                            <ul className={`pl-9 mt-1 ${!open && "hidden"}`}>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/company"
                                  className={({ isActive }) =>
                                    "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                    (isActive ? "!text-indigo-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    {t("company")}
                                  </span>
                                </NavLink>
                              </li>
                              <li className="mb-1 last:mb-0">
                                <NavLink
                                  end
                                  to="/user"
                                  className={({ isActive }) =>
                                    "block text-slate-400 hover:text-slate-200 transition duration-150 truncate " +
                                    (isActive ? "!text-indigo-500" : "")
                                  }
                                >
                                  <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                    {t("user")}
                                  </span>
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                </>
              )}
            </ul>
          </div>
          {/* More group */}
          <div>
            <h3 className="text-xs uppercase text-slate-500 font-semibold pl-3">
              <span
                className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6"
                aria-hidden="true"
              >
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                More
              </span>
            </h3>
            <ul className="mt-3">
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <a
                      href="#0"
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        open && "hover:text-slate-200"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      Contact
                    </a>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <a
                      href="#0"
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        open && "hover:text-slate-200"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      Policy
                    </a>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup>
                {(handleClick, open) => {
                  return (
                    <a
                      href="#0"
                      className={`block text-slate-200 hover:text-white truncate transition duration-150 ${
                        open && "hover:text-slate-200"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      Imprint
                    </a>
                  );
                }}
              </SidebarLinkGroup>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:!inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              <span className="sr-only">Expand / collapse sidebar</span>
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
