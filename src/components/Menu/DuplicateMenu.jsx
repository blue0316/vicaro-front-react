import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, TextInput } from "flowbite-react"
import { HiOutlineDuplicate } from "react-icons/hi";
import { FaRegTimesCircle } from 'react-icons/fa';
import { duplicateMenu } from '../../redux/menuReducer';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import { createWineMenuSearchText } from '../../utils'
import { useTranslation } from "react-i18next";

function DuplicateMenu(props) {
    const { t } = useTranslation();
    const { authState } = useSelector((state) => state);
    const { userInfo } = authState;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
    }, [])


    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [search, setSearch] = useState("");   //search bar text 

    const changeSearch = (e) => {
        setSearch(e.target.value);
    }

    const clickDuplicate = async () => {
        if (search) {
            const { id, company, name } = userInfo;
            let search_field = createWineMenuSearchText({ menu_name: search, user_name: name, created_at: new Date().toLocaleString() });
            const res = await dispatch(duplicateMenu({ menu_name: search, user_id: id, company, search_field, menu_id: props.product_id }))
            console.log(res);
            if (res !== false) {
                dispatch(openSnackBar({ message: t("msg_success_duplicate_menu"), status: 'success' }));
                navigate('/menuedit')
            }
        } else {
            dispatch(openSnackBar({ message: t("msg_fill_menu"), status: 'error' }));
        }
    }

    const openModal = () => {
        if (props.permission) {
            setModalShow(true);
        } else {
            dispatch(openSnackBar({ status: "error", message: t("msg_not_permission") }));
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
            <div onClick={() => openModal()} className="flex text-gray-600 p-1 cursor-pointer hover:bg-gray-100">
                <HiOutlineDuplicate className="h-6 w-6 mr-2 text-gray-600" />
                {t("duplicate")}
            </div>
            <Modal
                show={modalShow}
                size="md"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("duplicate_menu")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6">
                        <div className="m-2 ml-2 text-sm block">
                            {t("duplicate_menu_name")}<span className='text-red-700'>*</span>
                        </div>
                        <TextInput
                            id="searchmenu"
                            type="search"
                            sizing="lg"
                            // placeholder="Wine Menu Name"
                            required={true}
                            value={search}
                            onChange={(e) => changeSearch(e)}
                        />
                    </div>
                </Modal.Body>
                <hr />
                <Modal.Footer>
                    <div className="flex flex-wrap items-center gap-4 m-auto">
                        <div>
                            <Button onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => clickDuplicate()} outline={true} className="bg-sitebg-50" >
                                {t("duplicate_menu")}
                                <HiOutlineDuplicate className="ml-2 h-6 w-6 text-sitebg-50" />
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DuplicateMenu;
