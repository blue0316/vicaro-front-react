import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, TextInput } from "flowbite-react"
import { HiOutlineBookOpen } from "react-icons/hi";
import { FiFolderPlus } from "react-icons/fi";
import { FaRegTimesCircle } from 'react-icons/fa';
import { openSnackBar } from '../../redux/snackBarReducer';
import swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

function CreateGroupModal(props) {
    const { t } = useTranslation();

    const dispatch = useDispatch();

    useEffect(() => {
        // dispatch(getMenuTotalCount(id, company))
    }, [])


    const [modalShow, setModalShow] = useState(false);    //modal modalShow hide
    const [search, setSearch] = useState("");   //search bar text 

    const changeSearch = (e) => {
        setSearch(e.target.value);
    }

    const createNewGroup = () => {
        if (search) {
            props.addGroup(search);
            close();
        } else {
            dispatch(openSnackBar({ message: t("msg_fill_group_name"), status: 'error' }));
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
        setSearch("");
    }

    return (
        <>
            <div>
                <Button onClick={() => setModalShow(true)} outline={true} className="bg-sitebg-200" >
                    <FiFolderPlus className="mr-2 h-6 w-6 text-sitebg-50" />
                    {t("create_new_group")}
                </Button>
            </div>
            <Modal
                show={modalShow}
                size="md"
                popup={true}
                onClose={() => closeModal()}
            >
                <Modal.Header>
                    {t("create_new_group")}
                </Modal.Header>
                <hr />
                <Modal.Body>
                    <div className="py-6">
                        <div className="m-2 ml-2 text-sm block">
                            {t("group_name")}<span className='text-red-700'>*</span>
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
                            <Button onClick={() => closeModal()} className="bg-white bg-opacity-0 text-sitetx-100">
                                <FaRegTimesCircle className="mr-2 h-5 w-5" />
                                {t("dismiss")}
                            </Button>
                        </div>
                        <div>
                            <Button onClick={() => createNewGroup()} outline={true} className="bg-sitebg-50" >
                                <HiOutlineBookOpen className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("create_new_group")}
                            </Button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateGroupModal;
