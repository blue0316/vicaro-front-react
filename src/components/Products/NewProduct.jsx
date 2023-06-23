import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaRegTimesCircle } from "react-icons/fa";
import { HiOutlineDocumentAdd, HiOutlineSearch } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert2";
import { getAllProducer } from "../../redux/producerReducer";
import Loading from "../Global/Loading";
import AddProduct from "./AddProduct";
import NewProducer from "./NewProducer";

function Product(props) {
  const { t } = useTranslation();
  const { globalState, producerState } = useSelector((state) => state);
  const { producers, getAllProducerState } = producerState;

  const dispatch = useDispatch();

  const [modalShow, setModalShow] = useState(false); //modal modalShow hide
  const [producer, setProducer] = useState(null); //modal modalShow hide
  const [search, setSearch] = useState(""); //search bar text
  const [searchResShow, setSearchResShow] = useState(false);

  const changeSearch = (e) => {
    setSearch(e.target.value);
    setProducer(null);
    dispatch(getAllProducer(e.target.value));
    if (e.target.value) {
      setSearchResShow(true);
    } else {
      setSearchResShow(false);
    }
  };

  const selectProducer = (_id, name) => {
    setSearch(name);
    setProducer({ _id, name });
    setSearchResShow(false);

    //_id code here
  };

  const closeModal = () => {
    swal
      .fire({
        title: t("swal_are_you_sure"),
        text: t("swal_leave_page"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("swal_leave"),
      })
      .then((result) => {
        if (result.isConfirmed) {
          close();
        }
      });
  };

  const closeModalWithOutSwal = () => {
    close();
  };

  function close() {
    setModalShow(false);
    setSearch("");
    setSearchResShow(false);
    setProducer(null);
  }

  return (
    <>
      <div
        onClick={() => setModalShow(true)}
        className="transition duration-150 ease-in-out px-[13px] py-[9px] shadow-sm whitespace-nowrap bg-[#6366F1] flex items-center rounded leading-5 font-medium text-white"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="mr-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.3999 7H9.3999V1C9.3999 0.4 8.9999 0 8.3999 0C7.7999 0 7.3999 0.4 7.3999 1V7H1.3999C0.799902 7 0.399902 7.4 0.399902 8C0.399902 8.6 0.799902 9 1.3999 9H7.3999V15C7.3999 15.6 7.7999 16 8.3999 16C8.9999 16 9.3999 15.6 9.3999 15V9H15.3999C15.9999 9 16.3999 8.6 16.3999 8C16.3999 7.4 15.9999 7 15.3999 7Z"
            fill="white"
          />
        </svg>
        {t("add_new_product")}
      </div>
      <Modal
        show={modalShow}
        size="xl"
        popup={true}
        onClose={() => closeModal()}
      >
        <Modal.Header className="px-6 py-4">
          {t("add_new_product")}
        </Modal.Header>
        <hr />
        <Modal.Body className="overflow-y-auto !py-0">
          <div className="py-6">
            <div>
              <div className="mb-2 ml-2 block">
                <Label
                  htmlFor="searchproducer"
                  className="text-lg"
                  value="Search Producer"
                />
              </div>
              <TextInput
                id="searchproducer"
                type="search"
                sizing="lg"
                placeholder="Search Producer"
                required={true}
                icon={HiOutlineSearch}
                value={search}
                onChange={(e) => changeSearch(e)}
              />
              {getAllProducerState && <Loading />}
              {searchResShow && (
                <>
                  <div className="max-h-72 overflow-auto">
                    {producers?.length > 0 &&
                      producers.map((data, index) => (
                        <div
                          className="text-sm"
                          key={index}
                          onClick={() => selectProducer(data._id, data.name)}
                        >
                          <div className="grid grid-cols-2 cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                            <div className="flex-grow font-medium px-2">
                              {data.name}
                            </div>
                            <div className="text-sm font-normal text-gray-500 tracking-wide">
                              {data.country?.name[`${globalState.language}`] +
                                ", " +
                                data.region?.name[`${globalState.language}`]}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  <NewProducer
                    closePrevModal={closeModalWithOutSwal}
                    condition={props.condition}
                  />
                </>
              )}
            </div>

            <div className="mt-2 ml-2 text-sm block text-sitetx-100">
              {t("not_producer_create_new")}
            </div>
          </div>
        </Modal.Body>
        <hr />
        <Modal.Footer>
          <div className="flex flex-wrap items-center gap-4 m-auto">
            <div>
              <Button
                color={"red"}
                onClick={() => closeModal()}
                className="bg-white bg-opacity-0 text-sitetx-100"
              >
                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                {t("dismiss")}
              </Button>
            </div>
            <div>
              <AddProduct
                producer={producer}
                closePrevModal={closeModalWithOutSwal}
                type="fromProduct"
                condition={props.condition}
              />
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Product;
