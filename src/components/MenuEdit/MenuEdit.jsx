import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import Sortable from "./Sortable";
// import { getMenusByFilter } from '../../redux/menuReducer';

function MenuEdit() {
    const { menuState } = useSelector((state) => state);
    const { currentWineMenu } = menuState;


    useEffect(() => {
    }, [])

    return (
        <div>
            <Sortable products={currentWineMenu?.products} menu_id={currentWineMenu._id} tree={currentWineMenu.treeData} menu_name={currentWineMenu.name} />
        </div>
    );
}

export default MenuEdit;
