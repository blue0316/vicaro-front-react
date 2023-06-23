import React, { useState } from "react";
import { HiOutlineUpload } from "react-icons/hi";
import { FaRegTimesCircle } from "react-icons/fa";
import Loading from "./Loading";
import { API_BASE } from '../../config/constants';

function UploadImage(props) {
    const { title, setImage, showImage, setShowImage } = props;
    // const [selectedImg, setSelectedImg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const selectImage = (e) => {
        setImage(e.target.files[0]);
        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onprogress = () => {
            setIsLoading(true);
        }
        reader.onloadend = () => {
            setShowImage(reader.result);
            // setSelectedImg(reader.result);
            setIsLoading(false);
        }

        reader.readAsDataURL(file)
    }

    return (
        <div>
            <div className="m-2 ml-2 block">
                {title}
            </div>
            {isLoading && <Loading />}
            {/* <div className={`text-center ${isLoading ? "block" : "hidden"}`}>
                <div role="status">
                    <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </div> */}
            {
                showImage !== null && showImage !== "/public/" && showImage ? <div className="flex">
                    <label htmlFor={`dropzone-file-${title}`} className="m-auto">
                        <img className="w-auto h-48 rounded-full cursor-pointer" src={showImage.indexOf('public') !== -1 ? `${API_BASE}${showImage}` : showImage} alt="image description" />
                    </label>
                    <FaRegTimesCircle onClick={() => { setImage(null); setShowImage(null) }} className="h-7 w-7 relative right-10 cursor-pointer" />
                </div>
                    :
                    <div className="flex justify-center items-center w-full">
                        <label htmlFor={`dropzone-file-${title}`} className="flex flex-col justify-center items-center w-full h-16 bg-gray-50 rounded-lg border-2 border-sitebg-50 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                <HiOutlineUpload className="ml-2 h-7 w-7 text-sitebg-50" />
                            </div>
                        </label>
                    </div>
            }

            <input id={`dropzone-file-${title}`} accept=".png, .jpg, .jpeg, .svg" onChange={(e) => selectImage(e)} type="file" className="hidden" />

            <div className="mt-2 ml-2 text-sm block text-sitetx-100">
                max. 10 mb
            </div>
        </div>
    );
}

export default UploadImage;
