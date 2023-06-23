import { Modal, Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineCloseCircle } from "react-icons/ai";
import {
  HiDotsHorizontal,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineTrash,
} from "react-icons/hi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { TiArrowUnsorted } from "react-icons/ti";
import { VscSymbolNumeric } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert2";
import { API_BASE } from "../../config/constants";
import {
  insertProductInCart,
  removeProductInCart,
  setCartItemActive,
} from "../../redux/locationReducer";
import {
  getNextPrevProduct,
  getProductsByFilter,
  getProductTotalCount,
  removeProduct,
} from "../../redux/productReducer";
import { openSnackBar } from "../../redux/snackBarReducer";
import Loading from "../Global/Loading";
import DropdownEditMenu from "../theme/DropdownEditMenu";
import EditProduct from "./EditProduct";

function ProductTableItem(props) {
  const { t } = useTranslation();
  const { globalState, productState, locationState } = useSelector(
    (state) => state
  );

  const dispatch = useDispatch();

  const { getNextPrevProductState } = productState;
  const { carts } = locationState;

  const [modalShow, setModalShow] = useState(false); //modal modalShow hide
  const [productData, setProductData] = useState(props?.data);
  const [currentPos, setCurrentPos] = useState(props?.pos);

  useEffect(() => {
    setProductData(props.data);
    setCurrentPos(props.pos);
  }, [props.data, props.pos]);

  var check_state = false;
  if (carts?.length > 0) {
    carts.map((data, index) => {
      if (data._id === props?.data._id) {
        check_state = true;
      }
    });
  }

  // const clickDuplicate = () => {

  // }

  // const clickEdit = () => {

  // }

  const clickDelete = async (value) => {
    swal
      .fire({
        title: t("swal_are_you_sure"),
        text: t("swal_del_product"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal_delete"),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          let res = await dispatch(
            removeProduct({
              id: value,
              isGlobal: props.condition.isGlobal,
              company: props.condition.company,
              role: props.condition.role,
              user_id: props.condition.user_id,
            })
          );
          if (res !== false) {
            dispatch(
              openSnackBar({
                message: t("msg_success_del_product"),
                status: "success",
              })
            );

            await dispatch(getProductsByFilter(props.condition));
            await dispatch(getProductTotalCount(props.condition));

            setModalShow(false);
          }
        }
      });
  };

  const getPrevProduct = async () => {
    if (!getNextPrevProductState) {
      const res = await dispatch(
        getNextPrevProduct(props.condition, currentPos, "prev")
      );
      if (res !== false) {
        setProductData(res.data);
        setCurrentPos(currentPos - 1);
      } else {
        return false;
      }
    }
  };

  const getNextProduct = async () => {
    if (!getNextPrevProductState) {
      const res = await dispatch(
        getNextPrevProduct(props.condition, currentPos, "next")
      );
      if (res !== false) {
        setProductData(res.data);
        setCurrentPos(currentPos + 1);
      } else {
        return false;
      }
    }
  };

  const checkCart = async () => {
    var flag = false;
    var pos = 0;
    if (carts?.length > 0) {
      carts.map((data, index) => {
        if (data._id === props?.data._id) {
          flag = true;
          pos = index;
        }
      });
    }
    if (flag) {
      let res = await dispatch(removeProductInCart(pos));
      if (res !== false) {
        dispatch(
          openSnackBar({
            message: t("msg_success_remove_product_cart"),
            status: "success",
          })
        );
      }
    } else {
      let res = await dispatch(insertProductInCart(productData));
      if (res !== false) {
        dispatch(
          openSnackBar({
            message: t("msg_success_insert_product_cart"),
            status: "success",
          })
        );
      }
    }
  };

  const setProductActive = () => {
    swal
      .fire({
        title: t("swal_are_you_sure"),
        text: t("swal_active_product"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal_active"),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          var activeList = [props.data._id];

          let res = await dispatch(
            setCartItemActive({
              list: activeList,
              type: true,
              dozen: "single",
              isGlobal: props.condition.isGlobal,
              company: props.condition.company,
              role: props.condition.role,
              user_id: props.condition.user_id,
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
            await dispatch(getProductsByFilter(props.condition));
            await dispatch(getProductTotalCount(props.condition));
          }
        }
      });
  };

  const setProductInActive = () => {
    swal
      .fire({
        title: t("swal_are_you_sure"),
        text: t("swal_inactive_product"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal_inactive"),
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          var inActiveList = [props.data._id];

          let res = await dispatch(
            setCartItemActive({
              list: inActiveList,
              type: false,
              dozen: "single",
              isGlobal: props.condition.isGlobal,
              company: props.condition.company,
              role: props.condition.role,
              user_id: props.condition.user_id,
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
            await dispatch(getProductsByFilter(props.condition));
            await dispatch(getProductTotalCount(props.condition));
          }
        }
      });
  };

  const {
    country,
    region,
    sub_region,
    product_name,
    vintage,
    bottle_size,
    grape_variety,
    description_text,
    product_type,
    wine_color,
    taste,
    category,
    producer,
    active,
    article_nr,
    bottle_image,
    aroma,
    food_pairing,
    barrel_type,
    alc_vol,
    wine_acid,
    residual_sugar,
    closure_type,
    allergy,
    _id,
  } = productData;

  return (
    <>
      <tr
        className={
          props.last
            ? "bg-white"
            : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        }
      >
        <td className="pl-8 pr-2 py-4 w-4">
          <div className="flex items-center">
            <input
              id={`checkbox-table-search-${props.data._id}`}
              onChange={() => {
                checkCart();
              }}
              checked={check_state}
              type="checkbox"
              className="w-6 h-6 text-sitebg-50 rounded border-gray-300 focus:ring-sitebg-50 dark:focus:ring-sitebg-50 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`checkbox-table-search-${props.data._id}`}
              className="sr-only"
            >
              checkbox
            </label>
          </div>
        </td>
        <th
          onClick={() => setModalShow(true)}
          scope="row"
          className="flex items-center py-4 px-2 text-gray-900 whitespace-nowrap dark:text-white"
        >
          <div className="flex justify-center w-20 h-20">
            <img
              className="w-auto rounded-[6px]"
              src={`${API_BASE}/public/${
                props.data.bottle_image.changed_name
                  ? props.data.bottle_image.changed_name
                  : "empty.png"
              }`}
              alt="empty"
              width={80}
              height={80}
            />
          </div>
          <div className="pl-3">
            <div className="font-normal text-gray-500">
              {props.data.producer?.name}
            </div>
            <div className="text-base font-semibold">
              {props.data.product_name}
            </div>
          </div>
        </th>
        <td onClick={() => setModalShow(true)} className="py-4 px-2">
          <div className="pl-3">
            <div className="font-normal text-gray-500">
              {props.data.vintage ? vintage : "N/A"}
            </div>
            <div className="text-base font-semibold">
              {props.data.bottle_size?.bottle_size +
                props.data.bottle_size?.unit}
            </div>
          </div>
        </td>
        <td onClick={() => setModalShow(true)} className="py-4 px-2">
          <div className="pl-3">
            <div className="font-normal text-gray-500">
              {props.data.product_type?.name}
            </div>
            {wine_color ? (
              <div className="text-base font-semibold">
                {props.data.wine_color?.name +
                  ", " +
                  props.data.product_type?.sub[props.data.category - 1][
                    `${globalState.language}`
                  ] +
                  " " +
                  props.data.product_type?.name}
              </div>
            ) : (
              <div className="text-base font-semibold">
                {props.data.product_type?.sub[props.data.category][
                  `${globalState.language}`
                ] +
                  " " +
                  props.data.product_type?.name}
              </div>
            )}
          </div>
        </td>
        <td onClick={() => setModalShow(true)} className="py-4 px-2">
          <div className="pl-3">
            <div className="font-normal text-gray-500">
              {props.data.country?.name[`${globalState.language}`]}
            </div>
            <div className="text-base font-semibold">
              {props.data.region?.name[`${globalState.language}`]}
            </div>
          </div>
        </td>
        <td className="py-4 px-2">
          <DropdownEditMenu
            content={
              <>
                <li>
                    <a
                    onClick={() => setProductActive()}
                    className="font-medium text-sm text-slate-600 hover:text-green-500 flex py-1 px-3 cursor-pointer hover:bg-gray-100"
                    >
                    {/* <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div> active */}
                    <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                    {t("active")}
                    </a>
                </li>
                <li>
                  <a
                    onClick={() => setProductInActive()}
                    className="font-medium text-sm text-slate-600 flex py-1 px-3 cursor-pointer hover:bg-gray-100 hover:text-red-500"
                  >
                    {/* <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div> active */}
                    <AiOutlineCloseCircle className="mr-2 h-5 w-5" />
                    {t("inactive")}
                  </a>
                </li>
              </>
            }
            align={"right"}
            className="relative inline-flex"
          >
            <div className="pl-3">
              <div className="font-normal text-gray-500">
                {props.data.article_nr ? props.data.article_nr : "N/A"}
              </div>
              <div
                className={`text-xs inline-flex items-center font-medium rounded-full text-center px-2.5 py-1 ${
                  props.data.active ? "bg-green-100 text-green-600" : "bg-rose-100 text-rose-600"
                }`}
              >
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    props.data.active ? "bg-green-600" : "bg-rose-600"
                  } mr-2`}
                ></div>{" "}
                {props.data.active ? "active" : "inactive"}
              </div>
            </div>
          </DropdownEditMenu>
        </td>
        <td className="py-4 pl-2 pr-8">
          <DropdownEditMenu align={"right"} className="relative inline-flex">
            <li>
              <EditProduct product={props.data} condition={props.condition} />
            </li>
            <li>
              <a
                onClick={() => clickDelete(_id)}
                className="font-medium text-sm text-slate-600 hover:text-red-500 flex py-1 px-3 cursor-pointer hover:bg-gray-100"
              >
                <HiOutlineTrash className="h-6 w-6 mr-2" />
                {t("delete")}
              </a>
            </li>
          </DropdownEditMenu>
        </td>
      </tr>
      <Modal
        show={modalShow}
        size="2xl"
        popup={true}
        onClose={() => setModalShow(false)}
        style={{ height: "70vh" }}
      >
        <Modal.Header className="px-6 py-4">
          {t("product_information")}
        </Modal.Header>
        <hr />
        <Modal.Body className="overflow-y-auto !py-0">
          {getNextPrevProductState && <Loading />}
          {/* <div className={`text-center ${getNextPrevProductState ? "block" : "hidden"}`}>
                        <div role="status">
                            <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div> */}
          <div className="py-6 text-sitetx-200">
            <div className="grid grid-cols-5 pb-4">
              <div className="col-span-1 pl-6">
                <img
                  className="w-auto h-56 rounded-full"
                  src={`${API_BASE}/public/${
                    bottle_image.changed_name
                      ? bottle_image.changed_name
                      : "empty.png"
                  }`}
                  alt="empty"
                />
              </div>
              <div className="col-span-4">
                {wine_color ? (
                  <div className="text-base font-semibold">
                    {wine_color?.name +
                      ", " +
                      product_type?.sub[category - 1][
                        `${globalState.language}`
                      ] +
                      " " +
                      product_type?.name}
                  </div>
                ) : (
                  <div className="text-base font-semibold">
                    {product_type?.sub[category][`${globalState.language}`] +
                      " " +
                      product_type?.name}
                  </div>
                )}
                <div className="text-3xl font-bold">{product_name}</div>
                <div className="text-2xl font-bold pt-8 pb-2">
                  {producer?.name}
                </div>
                <div className="text-base">
                  {country.name[`${globalState.language}`] +
                    ">" +
                    region.name[`${globalState.language}`]}{" "}
                  {sub_region &&
                    ">" + sub_region.name[`${globalState.language}`]}
                </div>
                <div className="pt-4 grid grid-cols-3">
                  <div className="col-span-1 flex">
                    <HiOutlineCalendar className="w-6 h-6 mr-2" />
                    {vintage ? vintage : "N/A"}
                  </div>
                  <div className="col-span-1 flex">
                    <TiArrowUnsorted className="w-6 h-6 mr-2" />
                    {bottle_size?.bottle_size + bottle_size?.unit}
                  </div>
                  <div className="col-span-1 flex">
                    <VscSymbolNumeric className="w-6 h-6 mr-2" />
                    {article_nr ? article_nr : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <div className="pt-4 pl-8">
                {description_text ? description_text : "Not description"}
              </div>
              <div className="grid grid-cols-7 pt-4">
                <div className="col-span-4">
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-3 flex justify-end mr-3">
                      {t("grape_variety")}
                    </div>
                    <div className="col-span-4">
                      {grape_variety?.length > 0
                        ? grape_variety.map((data, i) => (
                            <div key={i}>
                              {data.grape[`${globalState.language}`]}
                              {data.percentage && "(" + data.percentage + " %)"}
                            </div>
                          ))
                        : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-3 flex justify-end mr-3">
                      {t("taste")}
                    </div>
                    <div className="col-span-4">
                      {product_type._id === 0 && taste >= 0
                        ? product_type.sub[category - 1].taste[taste]
                        : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-3 flex justify-end mr-3">
                      {t("aroma")}
                    </div>
                    <div className="col-span-4 flex flex-wrap gap-4">
                      {aroma?.length > 0
                        ? aroma.map((data, i) => (
                            <div key={i}>{data[`${globalState.language}`]}</div>
                          ))
                        : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-3 flex justify-end mr-3">
                      {t("food_pairing")}
                    </div>
                    <div className="col-span-4 flex flex-wrap gap-4">
                      {food_pairing?.length > 0
                        ? food_pairing.map((data, i) => (
                            <div key={i}>{data[`${globalState.language}`]}</div>
                          ))
                        : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-3 flex justify-end mr-3">
                      {t("barrel_type")}
                    </div>
                    <div className="col-span-4 flex gap-4">
                      {barrel_type ? barrel_type : "N/A"}
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-4 flex justify-end mr-3">
                      {t("alc_vol")}
                    </div>
                    <div className="col-span-3 flex gap-4">
                      {alc_vol ? alc_vol + " %/vol" : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-4 flex justify-end mr-3">
                      {t("wine_acid")}
                    </div>
                    <div className="col-span-3 flex gap-4">
                      {wine_acid ? wine_acid + " g/l" : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-4 flex justify-end mr-3">
                      {t("residual_sugar")}
                    </div>
                    <div className="col-span-3 flex gap-4">
                      {residual_sugar ? residual_sugar + " g/l" : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-4 flex justify-end mr-3">
                      {t("closure_type")}
                    </div>
                    <div className="col-span-3 flex gap-4">
                      {closure_type
                        ? closure_type[`${globalState.language}`]
                        : "N/A"}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 p-2">
                    <div className="font-bold col-span-4 flex justify-end mr-3">
                      {t("allergenes")}
                    </div>
                    <div className="col-span-3 flex flex-wrap gap-4">
                      {allergy?.length > 0
                        ? allergy.map((data, i) => (
                            <div key={i}>{data[`${globalState.language}`]}</div>
                          ))
                        : "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <hr />
        <Modal.Footer className="justify-between">
          <div className="grid grid-cols-8">
            <div className="col-span-5 flex pl-6 gap-8">
              <div
                onClick={() => clickDelete(_id)}
                className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100"
              >
                <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                {t("delete")}
              </div>
              <EditProduct product={productData} condition={props.condition} />
            </div>
          </div>
          <div className="col-span-3 flex gap-4 pr-2 justify-end">
            <label
              onClick={() => getPrevProduct()}
              className="flex flex-col justify-center items-center float-right w-10 h-10 bg-white rounded-lg border-2 border-sitetx-100 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-sitebg-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-150"
            >
              <div className="flex flex-col justify-center items-center">
                <SlArrowLeft className="text-black h-4 w-4" />
              </div>
            </label>
            <label
              onClick={() => getNextProduct()}
              className="flex flex-col justify-center items-center float-right w-10 h-10 bg-white rounded-lg border-2 border-sitetx-100 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-sitebg-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors duration-150"
            >
              <div className="flex flex-col justify-center items-center">
                <SlArrowRight className="text-black h-4 w-4" />
              </div>
            </label>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductTableItem;
