import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
    HiOutlineCheckCircle, HiOutlineTrash
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert2";
import {
    removeAllProductInCart,
    setCartItemActive
} from "../redux/locationReducer";
import {
    getProductsByFilter,
    getProductTotalCount
} from "../redux/productReducer";
import { openSnackBar } from "../redux/snackBarReducer";
import AddProductInToWineMenu from "./AddProductInToWineMenu";
import CartItem from "./Global/CartItem";
import Loading from "./Global/Loading";

function ProductTable() {
  const { t } = useTranslation();
  const { globalState, locationState } = useSelector((state) => state);

  const { carts, setCartItemActiveState, getProductsByFilterState } =
    locationState;
  const { condition } = globalState;
  // const { company, role } = userInfo;
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const emptyCart = () => {
    if (carts.length > 0) {
      swal
        .fire({
          title: t("swal_are_you_sure"),
          text: t("swal_del_all_product_cart"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: t("swal_delete"),
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            let res = await dispatch(removeAllProductInCart());
            if (res !== false) {
              dispatch(
                openSnackBar({
                  message: t("msg_success_remove_all_product_cart"),
                  status: "success",
                })
              );
            }
          }
        });
    } else {
      dispatch(
        openSnackBar({
          status: "error",
          message: "There is no product in basket.",
        })
      );
    }
  };

  const setActive = () => {
    if (carts.length > 0) {
      swal
        .fire({
          title: t("swal_are_you_sure"),
          text: t("swal_active_all_product"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: t("swal_active_all"),
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            var activeList = [];
            carts.map((data, index) => {
              activeList = [...activeList, data._id];
            });

            let res = await dispatch(
              setCartItemActive({
                list: activeList,
                type: true,
                dozen: "multi",
                isGlobal: condition.isGlobal,
                company: condition.company,
                role: condition.role,
                user_id: condition.user_id,
              })
            );
            if (res !== false) {
              dispatch(
                openSnackBar({
                  message: `${t("success")} ${t("active")} ${t(
                    "msg_all_product_cart"
                  )}`,
                  status: "success",
                })
              );
              await dispatch(getProductsByFilter(condition));
              await dispatch(getProductTotalCount(condition));
            }
          }
        });
    } else {
      dispatch(
        openSnackBar({
          status: "error",
          message: "There is no product in basket.",
        })
      );
    }
  };

  const setInActive = () => {
    if (carts.length > 0) {
      swal
        .fire({
          title: t("swal_are_you_sure"),
          text: t("swal_inactive_all_product"),
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: t("swal_inactive_all"),
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            var inActiveList = [];
            carts.map((data, index) => {
              inActiveList = [...inActiveList, data._id];
            });

            let res = await dispatch(
              setCartItemActive({
                list: inActiveList,
                type: false,
                dozen: "multi",
                isGlobal: condition.isGlobal,
                company: condition.company,
                role: condition.role,
                user_id: condition.user_id,
              })
            );
            if (res !== false) {
              dispatch(
                openSnackBar({
                  message: `${t("success")} ${t("inactive")} ${t(
                    "msg_all_product_cart"
                  )}`,
                  status: "success",
                })
              );
              await dispatch(getProductsByFilter(condition));
              await dispatch(getProductTotalCount(condition));
            }
          }
        });
    } else {
      dispatch(
        openSnackBar({
          status: "error",
          message: "There is no product in basket.",
        })
      );
    }
  };

  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <div className="flex items-center pr-4">
        <div
          onClick={() => setModalShow(true)}
          className="w-full font-medium px-2  text-sm inline-flex items-center justify-center border-2 border-transparent rounded-lg leading-5 shadow-sm transition duration-150 ease-in-out bg-indigo-500 hover:!bg-indigo-400 text-white cursor-pointer"
        >
          <span className="py-[7px] md:pr-[10px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.19086 6.37994C5.00086 6.37994 4.80086 6.29994 4.66086 6.15994C4.37086 5.86994 4.37086 5.38994 4.66086 5.09994L8.29086 1.46994C8.58086 1.17994 9.06086 1.17994 9.35086 1.46994C9.64086 1.75994 9.64086 2.23994 9.35086 2.52994L5.72086 6.15994C5.57086 6.29994 5.38086 6.37994 5.19086 6.37994Z"
                fill="white"
              />
              <path
                d="M18.8091 6.37994C18.6191 6.37994 18.4291 6.30994 18.2791 6.15994L14.6491 2.52994C14.3591 2.23994 14.3591 1.75994 14.6491 1.46994C14.9391 1.17994 15.4191 1.17994 15.7091 1.46994L19.3391 5.09994C19.6291 5.38994 19.6291 5.86994 19.3391 6.15994C19.1991 6.29994 18.9991 6.37994 18.8091 6.37994Z"
                fill="white"
              />
              <path
                d="M20.21 10.6001C20.14 10.6001 20.07 10.6001 20 10.6001H19.77H4C3.3 10.6101 2.5 10.6101 1.92 10.0301C1.46 9.5801 1.25 8.8801 1.25 7.8501C1.25 5.1001 3.26 5.1001 4.22 5.1001H19.78C20.74 5.1001 22.75 5.1001 22.75 7.8501C22.75 8.8901 22.54 9.5801 22.08 10.0301C21.56 10.5501 20.86 10.6001 20.21 10.6001ZM4.22 9.1001H20.01C20.46 9.1101 20.88 9.1101 21.02 8.9701C21.09 8.9001 21.24 8.6601 21.24 7.8501C21.24 6.7201 20.96 6.6001 19.77 6.6001H4.22C3.03 6.6001 2.75 6.7201 2.75 7.8501C2.75 8.6601 2.91 8.9001 2.97 8.9701C3.11 9.1001 3.54 9.1001 3.98 9.1001H4.22Z"
                fill="white"
              />
              <path
                d="M9.75977 18.3C9.34977 18.3 9.00977 17.96 9.00977 17.55V14C9.00977 13.59 9.34977 13.25 9.75977 13.25C10.1698 13.25 10.5098 13.59 10.5098 14V17.55C10.5098 17.97 10.1698 18.3 9.75977 18.3Z"
                fill="white"
              />
              <path
                d="M14.3594 18.3C13.9494 18.3 13.6094 17.96 13.6094 17.55V14C13.6094 13.59 13.9494 13.25 14.3594 13.25C14.7694 13.25 15.1094 13.59 15.1094 14V17.55C15.1094 17.97 14.7694 18.3 14.3594 18.3Z"
                fill="white"
              />
              <path
                d="M14.8907 22.75H8.86073C5.28073 22.75 4.48073 20.62 4.17073 18.77L2.76073 10.12C2.69073 9.71 2.97073 9.33 3.38073 9.26C3.79073 9.19 4.17073 9.47 4.24073 9.88L5.65073 18.52C5.94073 20.29 6.54073 21.25 8.86073 21.25H14.8907C17.4607 21.25 17.7507 20.35 18.0807 18.61L19.7607 9.86C19.8407 9.45 20.2307 9.18 20.6407 9.27C21.0507 9.35 21.3107 9.74 21.2307 10.15L19.5507 18.9C19.1607 20.93 18.5107 22.75 14.8907 22.75Z"
                fill="white"
              />
            </svg>
          </span>

          <span className="hidden md:block pr-3">{t("cart")}</span>
          <div className="hidden md:flex justify-center items-center bg-white text-indigo-500 px-1 py-0.5 min-w-6 leading-normal rounded-full">
            {carts.length}
          </div>
        </div>
      </div>
      <Modal
        show={modalShow}
        size="5xl"
        popup={true}
        onClose={() => setModalShow(false)}
      >
        <Modal.Header>{t("basket")}</Modal.Header>
        <hr />
        <Modal.Body>
          {(setCartItemActiveState || getProductsByFilterState) && <Loading />}
          <div className="py-6">
            <div>
              <div
                className="overflow-x-auto overflow-y-auto relative shadow-md sm:rounded-lg"
                style={{ maxHeight: "70vh" }}
              >
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <tbody>
                    {carts && carts.length > 0 ? (
                      carts.map((data, index) => (
                        <CartItem key={data._id} data={data} pos={index} />
                      ))
                    ) : (
                      <tr>
                        <td>{t("nodata")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <hr />
        <Modal.Footer>
          <div className="flex justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <Button
                  color={"red"}
                  onClick={() => setActive()}
                  className="bg-green-100 text-green-500 hover:bg-green-200"
                >
                  <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                  {t("set_active")}
                </Button>
              </div>
              <div>
                <Button
                  color={"red"}
                  className="bg-red-100 text-red-500 hover:bg-red-300"
                  onClick={() => setInActive()}
                >
                  <AiOutlineCloseCircle className="mr-2 h-5 w-5" />
                  {t("set_inactive")}
                </Button>
              </div>
              <div>
                <Button
                  color={"red"}
                  className="bg-sitebg-200 text-sitetx-200 hover:bg-gray-300"
                  onClick={() => emptyCart()}
                >
                  <HiOutlineTrash className="mr-2 h-5 w-5" />
                  {t("empty_basket")}
                </Button>
              </div>
            </div>
            <AddProductInToWineMenu closePrevModal={setModalShow} />
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductTable;
