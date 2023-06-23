import date from 'date-and-time';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE } from '../../config/constants';
import { selectMenuOfCart, unselectMenuOfCart } from '../../redux/menuReducer';

function MenuItem(props) {
    const { t } = useTranslation();
    const { menuState } = useSelector((state) => state);
    const { selectedMenusOfCart } = menuState;

    const dispatch = useDispatch();

    // const { id } = userInfo;
    // const { getNextPrevMenuState } = menuState;
    // const { menus } = locationState;
    // const [menuData, setMenuData] = useState(props?.data);
    // const [currentPos, setCurrentPos] = useState(props?.pos);

    useEffect(() => {
        // setMenuData(props.data);
        // setCurrentPos(props.pos);
    }, []);

    var check_state = false;
    if (selectedMenusOfCart?.length > 0) {
        selectedMenusOfCart.map((data, index) => {
            if (data === props?.data._id) {
                check_state = true;
            }
        })
    }

    const checkMenu = async () => {
        if (check_state) {
            await dispatch(unselectMenuOfCart(props.data._id));
            check_state = false;
        } else {
            await dispatch(selectMenuOfCart(props.data._id));
            check_state = true;
        }
    }


    const { name, restaurant_logo, created_by, created_at, modified_at, _id } = props.data;

    return (
        <>
            <div className="grid grid-cols-12 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <div className="p-4 w-4 col-span-1 m-auto">
                    <div className="flex items-center">
                        <input id={`checkbox-table-search-${_id}`} onChange={() => checkMenu()} checked={check_state} type="checkbox" className="w-6 h-6 text-sitebg-50 rounded border-gray-300 focus:ring-sitebg-50 dark:focus:ring-sitebg-50 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor={`checkbox-table-search-${_id}`} className="sr-only">checkbox</label>
                    </div>
                </div>
                <div className="col-span-3 py-4 px-6 flex">
                    <img className="w-auto h-12 rounded-full my-auto" src={`${API_BASE}/public/${restaurant_logo.changed_name ? restaurant_logo.changed_name : "menu-empty.png"}`} alt="empty" />
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{created_by?.firstname + created_by?.lastname}</div>
                        <div className="text-base font-semibold">{name ? name : "N/A"}</div>
                    </div>
                </div>
                <div className="col-span-4 py-4 px-6">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{t("created")}</div>
                        <div className="text-base font-semibold">{created_at ? date.format(new Date(created_at), 'YYYY/MM/DD HH:mm:ss') : "N/A"}</div>
                    </div>
                </div>
                <div className="col-span-4 py-4 px-6">
                    <div className="pl-3">
                        <div className="font-normal text-gray-500">{t("last_modified")}</div>
                        <div className="text-base font-semibold">{modified_at ? date.format(new Date(modified_at), 'YYYY/MM/DD HH:mm:ss') : "N/A"}</div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default MenuItem;