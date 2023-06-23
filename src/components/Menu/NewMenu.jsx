import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, TextInput } from "flowbite-react"
import { HiOutlineDocumentAdd, HiOutlineBookOpen } from "react-icons/hi";
import { FaRegTimesCircle } from 'react-icons/fa';
import { registerWineMenu } from '../../redux/menuReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import { createWineMenuSearchText } from '../../utils'
import Loading from "../Global/Loading";
import { useTranslation } from "react-i18next";

function Menu(props) {
    const { t } = useTranslation();
    const { authState, globalState, menuState } = useSelector((state) => state);
    const { userInfo } = authState;
    const { createWineMenuState } = menuState;
    const { menuCondition } = globalState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
    }, [])


    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [search, setSearch] = useState("");   //search bar text 

    const changeSearch = (e) => {
        setSearch(e.target.value);
    }

    const createWineMenu = async () => {
        if (search) {
            const { name } = userInfo;
            const formData = new FormData();
            let search_field = createWineMenuSearchText({ menu_name: search, user_name: name, created_at: new Date().toLocaleString() });
            formData.append("user_id", menuCondition.user_id);
            formData.append("company", menuCondition.company);
            formData.append("isGlobal", menuCondition.isGlobal);
            formData.append("role", menuCondition.role);
            formData.append("menu_name", search);
            formData.append("search_field", search_field);
            const res = await dispatch(registerWineMenu(formData))
            if (res) {
                dispatch(openSnackBar({ message: t("msg_success_create_menu"), status: 'success' }));
                navigate('/menuedit');
            } else {
                dispatch(openSnackBar({ status: "error", message: t("msg_menu_exist") }));
            }
        } else {
            dispatch(openSnackBar({ message: t("msg_fill_menu"), status: 'error' }));
        }
    }

    const closeModal = () => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_leave_page"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_leave")
        })
            .then(result => {
                if (result.isConfirmed) {
                    close();
                }
            });

    }

    function close() {
        setModalShow(false);
    }

    return (
        <>
            <Button color={'red'} onClick={() => setModalShow(true)} outline={true} className="bg-sitebg-50" >
                <HiOutlineDocumentAdd className="mr-2 h-6 w-6 text-sitebg-50" />
                {t("create_new_wine_menu")}
            </Button>
            <Modal
                show={modalShow}
                size="md"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("create_new_wine_menu")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    {createWineMenuState && <Loading />}
                    <div className="py-6">
                        <div className="m-2 ml-2 text-sm block">
                            {t("wine_menu_name")}<span className='text-red-700'>*</span>
                        </div>
                        <TextInput
                            id="searchmenu"
                            type="search"
                            sizing="lg"
                            // placeholder="Wine Menu Name"
                            required={true}
                            // icon={HiOutlineSearch}
                            value={search}
                            onChange={(e) => changeSearch(e)}
                        />
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button color={'red'} onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <Button color={'red'} onClick={() => createWineMenu()} outline={true} className="bg-sitebg-50" >
                                <HiOutlineBookOpen className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("create_new_wine_menu")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Menu;
