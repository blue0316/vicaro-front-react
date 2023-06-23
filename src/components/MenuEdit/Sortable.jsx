import { useState, useEffect } from "react";
import SortableTree, { toggleExpandedForAll, removeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getTreeFromFlatData, changeNodeAtPath } from "@nosferatu500/react-sortable-tree";
// import FileExplorerTheme from "react-sortable-tree-theme-full-node-drag";
// import FileExplorerTheme from "react-sortable-tree-theme-minimal";
import { BsArrowsAngleExpand, BsArrowsAngleContract } from "react-icons/bs";
import { HiOutlineArrowRight, HiOutlineSearch, HiOutlineArrowLeft, HiDotsHorizontal, HiOutlineDuplicate, HiOutlineTrash, HiOutlinePrinter } from "react-icons/hi";
import {BiExport} from "react-icons/bi";
import { FiSave, FiEdit3 } from "react-icons/fi";
import SortModal from "./SortModal";
import { Button, TextInput, Tooltip } from "flowbite-react"
import { useDispatch, useSelector } from 'react-redux'
import MenuProductItem from "./MenuProductItem";
import styled from 'styled-components';
import CreateGroupModal from "./CreateGroupModal";
import AddProductsModal from "./AddProductsModal";
import "@nosferatu500/react-sortable-tree/style.css";
import swal from 'sweetalert2';
import { openSnackBar } from '../../redux/snackBarReducer';
import { saveSortableTree } from '../../redux/menuReducer';
import { setNoSavedEditedWineMenuPage } from '../../redux/globalReducer';
import { parse, stringify } from 'flatted';
import flatten from 'tree-flatten'
import flatToTree from "flat-to-tree";
import recursively from 'recursively';
import _ from "lodash";
import groupArray from 'group-array';
import arrSort from 'arr-sort';
import downloadCsv from 'download-csv';
import { useBeforeunload } from 'react-beforeunload';
import { useTranslation } from "react-i18next";

export const SortableStyle = styled.div`
.text-base, .font-semibold{
    white-space: normal;
}
.rst__virtualScrollOverride{
    height: 1000px !important;
}
`

const maxDepth = 8;
var temper = [];
var group, group_order, ungroup, ungroup_order, ungroup_final, group_final, total_group, total_group_order, total_group_final;

function Sortable(props) {
    const { t } = useTranslation();
    const { authState, globalState } = useSelector((state) => state);
    const { userInfo } = authState;

    const [searchString, setSearchString] = useState("");
    const [searchFocusIndex, setSearchFocusIndex] = useState(0);
    const [searchFoundCount, setSearchFoundCount] = useState(null);
    const [treeData, setTreeData] = useState(props.tree ? parse(props.tree) : []);
    const [sortData, setSortData] = useState([]);
    const [changedMenuProducts, setChangedMenuProducts] = useState([]); //when user edit the menu, duplicate and add products changed, save product list
    const [uniqueIndex, setUniqueIndex] = useState(props.tree ? props?.products[props?.products?.length - 1].index + 1 : props?.products?.length); // for identify the product
    const [isSaveDisable, setIsSaveDisable] = useState(true);

    // var products = currentWineMenu?.products;
    const { products, menu_id, menu_name } = props;

    const dispatch = useDispatch();

    useEffect(() => {
        setMenuSaveDisable(true);
        if (props.tree) {
            const getKey = node => node._id;
            const getParentKey = node => node.parent_id;
            const rootKey = null;

            const newTreeData = parse(props.tree);

            const flatData = newTreeData.map(node => ({
                ...node,
                _id: node.treeIndex,
                parent_id: node.path.length > 1 ? node.path[node.path.length - 2] : null,
            }));

            console.log("flatData:", flatData);

            const data = getTreeFromFlatData({
                flatData,
                getKey,
                getParentKey,
                rootKey,
            });

            let tmpProducts = [];//for add index to changedMenuProducts
            let addNode = [];
            let productss = [];

            products.map((data) => {
                if (data.index !== null) {
                    tmpProducts = [...tmpProducts, { ...data }];
                } else {
                    productss = [...productss, { ...data, price: [] }]
                }
            })

            productss.map((data, index) => {
                productss[index] = { ...productss[index], index: tmpProducts[tmpProducts.length - 1].index + 1 + index };
                addNode = [...addNode, {
                    title: data.product.search_field,
                    subtitle: <MenuProductItem priceFunc={changePriceOfProduct} key={index} data={data} menu_id={menu_id} index={tmpProducts[tmpProducts.length - 1].index + 1 + index} isNew={true} />,
                    index: tmpProducts[tmpProducts.length - 1].index + 1 + index
                }]
            })

            tmpProducts = [...tmpProducts, ...productss];
            temper = tmpProducts; //global products
            setUniqueIndex(tmpProducts[tmpProducts.length - 1].index + 1 + productss.length);
            setChangedMenuProducts([...tmpProducts]);

            console.log("data:", data)
            let treeStructure = [];
            const customize = (item, index) => {
                // console.log("item", index, item);
                const pos = tmpProducts.findIndex(x => x.index === item.node.index);
                if (item.node.subtitle) {//if exist the subtitle this is product
                    treeStructure = [...treeStructure, {
                        title: item.node.title,
                        subtitle: <MenuProductItem priceFunc={changePriceOfProduct} key={item.node.index} data={tmpProducts[pos]} menu_id={item.node.subtitle.props.menu_id} index={item.node.index} />,
                        id: item._id,
                        parentId: item.parent_id,
                        index: item.node.index
                    }]
                } else {// else this isnt product, this is node
                    treeStructure = [...treeStructure, {
                        title: item.node.title,
                        parentId: item.parent_id,
                        id: item._id,
                    }]
                }
            }
            recursively(data, customize, 'children');

            let existTreeData = flatToTree(treeStructure);

            setTreeData([...addNode, ...existTreeData]);

            console.log("changedPRoducts:", changedMenuProducts)
            console.log("treeStruc", existTreeData);
            console.log("unique", tmpProducts[tmpProducts.length - 1].index + 1 + productss.length)
        } else {
            let tmpProducts = [];//for add index to changedMenuProducts
            products?.length > 0 && products.map((data, index) => {
                tmpProducts = [...tmpProducts, { ...data, index: index }];
            })

            let customized_products = customizeProducts(tmpProducts);    //customize the products list for group add some field and change

            // customizeGroup(data);   // get the checked group and unchecked group also total group for sort and make the node
            group = ["product_type.sort_id", "product.product_sub_category.sort_id"];
            group_order = ["no", "no"];
            ungroup = ["product.producer_sort"];
            ungroup_order = [true];
            total_group = ["product_type._id", "product.product_sub_category.index", "product.producer_sort"];
            total_group_order = [true, true, true];

            ungroup_final = []; //initialize
            group_final = [];   //initialize
            total_group_final = []; //initialize

            if (total_group.length > 0) {   //customize for tatal sort products
                total_group.map((data, index) => {
                    total_group_final = [...total_group_final, { attr: data, asc: total_group_order[index] }]
                })
            }

            customized_products = arrSort(customized_products, [...total_group_final]);     //total sort products

            if (group.length === 0) {    //when not checked the group
                let result = [];

                customized_products.map((data, index) => {
                    result = [...result, {
                        title: data.product.search_field,
                        subtitle: <MenuProductItem priceFunc={changePriceOfProduct} key={data.index} data={data} menu_id={menu_id} index={data.index} />,
                        index: data.index
                    }]
                });

                setTreeData(result);
            } else {
                if (ungroup.length > 0) {   //customize for ungroup sort products
                    ungroup.map((data, index) => {
                        ungroup_final = [...ungroup_final, { attr: data, asc: ungroup_order[index] }]
                    })
                }
                if (group.length > 0) { //customize for group sort products
                    group_order.map((data, index) => {
                        group_final = [...group_final, { attr: 'title', asc: data }]
                    })
                }


                let grouped_product = group.length > 0 ? groupArray(customized_products, [...group]) : customized_products; //group by the products

                let customizedTreeData = getNodes(grouped_product); //flat JSON file to tree data with children

                const sortGroup = (item, index) => {    //when title with & so mean sort by id, remove the unnecessary field
                    let pos = item.title.indexOf('&');
                    if (pos !== -1) {
                        item.title = item.title.substring(pos + 1);
                    }
                }
                recursively(customizedTreeData, sortGroup, 'children'); //customize the data to show the react-sortable-tree

                setTreeData(customizedTreeData);
            }

            temper = tmpProducts;
            setChangedMenuProducts([...tmpProducts]);
            setUniqueIndex(tmpProducts.length); //for indentify the products
        }
    }, [])

    /////////////////for leave site action detect////////////////////////////////////////
    // useEffect(() => {
    //     // the handler for actually showing the prompt
    //     // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
    //     const handler = (event) => {
    //         event.preventDefault();
    //         event.returnValue = "";
    //     };

    //     // if the form is NOT unchanged, then set the onbeforeunload
    //     if (isSaveDisable === false) {
    //         window.addEventListener("beforeunload", handler);
    //         // clean it up, if the dirty state changes
    //         return () => {
    //             window.removeEventListener("beforeunload", handler);
    //         };
    //     }
    //     // since this is not dirty, don't do anything
    //     return () => { };
    // }, [isSaveDisable]);
    useBeforeunload((event) => {
        if (isSaveDisable === false) {
            event.preventDefault();
        }
    });
    /////////////////for leave site action detect////////////////////////////////////////

    const handleTreeOnChange = (treeData) => {
        setTreeData(treeData);
        setMenuSaveDisable(false);
    };

    const changePriceOfProduct = (index, data) => {
        const pos = temper.findIndex(x => x.index === index);
        temper[pos].price = [...data]
        setChangedMenuProducts([...temper]);
        setMenuSaveDisable(false);
    }

    ////////sortable tree search begin////////////////////////////
    const handleSearchOnChange = (e) => {
        setSearchString(e.target.value);
    };

    const customSearchMethod = ({ node, searchQuery }) =>
        searchQuery &&
        node.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

    const selectPrevMatch = () => {
        setSearchFocusIndex(searchFocusIndex !== null
            ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
            : searchFoundCount - 1);
    };

    const selectNextMatch = () => {
        setSearchFocusIndex(
            searchFocusIndex !== null
                ? (searchFocusIndex + 1) % searchFoundCount
                : 0);
    };

    /////////sortable tree search end//////////////////////////

    ///////////for row height of react sortable tree begin///////////////////

    const customRowHeight = (treeIndex, node, path) =>
        node.subtitle ? 200 : 70;

    ///////////for row height of react sortable tree end////////////////////

    const toggleNodeExpansion = (expanded) => {
        setTreeData((toggleExpandedForAll({ treeData: treeData, expanded })));
    };

    const clickDuplicate = (rowInfo) => {
        console.log(rowInfo);
        const { node, path } = rowInfo;
        let duplicateNode = _.cloneDeep(node);
        let count = 0;

        console.log("prevNOde", node);
        const cast = (item, index) => {
            console.log("count", count);
            console.log("item", index, item);
            if (item.subtitle) {//if exist the subtitle this is product
                item.index = uniqueIndex + count;
                item.subtitle.props.index = uniqueIndex + count
            }
            count++;
        }
        recursively([duplicateNode], cast, 'children');
        console.log("duplicate", duplicateNode);
        console.log("node", node);
        console.log("changed", changedMenuProducts);
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_duplicate_this"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_duplicate")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    await setTreeData(
                        addNodeUnderParent({
                            treeData: treeData,
                            parentKey: path[path.length - 2], //the "-2" adds the new node as a sibling, if it was "-1" it will add it as a child
                            expandParent: true,
                            getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
                                return number;
                            },
                            newNode: {
                                title: node.title, //the new node's title should be the same as the clicked one
                                subtitle: duplicateNode.subtitle, //the new node's subtitle should be the same as the clicked one
                                children: duplicateNode.children,
                                index: node.index >= 0 ? uniqueIndex : undefined
                            }
                        }).treeData
                    )

                    let tmp = [...changedMenuProducts];
                    const flat = flatten(node, 'children');
                    if (flat.length > 0) {
                        flat.map((data, index) => {
                            if (data.index >= 0) {
                                const pos = changedMenuProducts.findIndex(x => x.index === data.index);
                                tmp = [...tmp, { ...changedMenuProducts[pos], index: uniqueIndex + index }];
                            }
                        })
                    }

                    temper = tmp;   //global
                    setChangedMenuProducts([...tmp]);
                    setUniqueIndex(uniqueIndex + flat.length);
                    console.log("unique", uniqueIndex + flat.length);

                    setMenuSaveDisable(false);
                    dispatch(openSnackBar({ message: t("msg_success_duplicate"), status: 'success' }));
                }
            });
    }

    const clickDelete = (rowInfo) => {
        const { node, path } = rowInfo;

        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_del_this"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_delete")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    await setTreeData(
                        removeNodeAtPath({
                            treeData: treeData,
                            path: path,   // You can use path from here
                            getNodeKey: ({ node: TreeNode, treeIndex: number }) => {
                                return number;
                            },
                            ignoreCollapsed: true,
                        })
                    )
                    setMenuSaveDisable(false);
                    dispatch(openSnackBar({ message: t("msg_success_delete"), status: 'success' }));

                    console.log(node.index);

                    let tmp = [...changedMenuProducts];
                    const flat = flatten(node, 'children');
                    if (flat.length > 0) {
                        flat.map((data, index) => {
                            if (data.index >= 0) {
                                const pos = tmp.findIndex(x => x.index === data.index);
                                tmp.splice(pos, 1);
                            }
                        })
                    }

                    temper = tmp;   //global
                    setChangedMenuProducts([...tmp]);
                    console.log("delete tmp", tmp);
                }
            });
    }

    const createGroup = (groupName) => {
        setTreeData([{
            title: groupName,
            children: []
        }, ...treeData]);
        setMenuSaveDisable(false);
    }

    const insertProducts = (menuproducts) => {
        let addNode = [];
        let productss = [];

        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_duplicate_product_menu"),
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: t("swal_no_duplicate"),
            confirmButtonText: t("swal_duplicate")
        })
            .then(async result => {
                if (result.isConfirmed) { //yes
                    menuproducts.map((data, index) => {
                        productss = [...productss, { product: data, product_type: data.product_type, category: data.category, sub_category: data.sub_category, price: [] }]
                    })
                } else if (result.isDenied) { //no
                    menuproducts.map((data, index) => {
                        if (changedMenuProducts.filter(e => e.product._id === data._id).length === 0) {
                            productss = [...productss, { product: data, product_type: data.product_type, category: data.category, sub_category: data.sub_category, price: [] }]
                        }
                    })
                }

                productss.map((data, index) => {
                    productss[index] = { ...productss[index], index: uniqueIndex + index };
                    addNode = [...addNode, {
                        title: data.product.search_field,
                        subtitle: <MenuProductItem priceFunc={changePriceOfProduct} key={index} data={data} menu_id={menu_id} index={uniqueIndex + index} isNew={true} />,
                        index: uniqueIndex + index
                    }]
                })

                console.log("insert products", productss);
                console.log("insert unique", uniqueIndex + productss.length);
                setUniqueIndex(uniqueIndex + productss.length);

                temper = [...changedMenuProducts, ...productss];
                setChangedMenuProducts([...changedMenuProducts, ...productss]);
                setTreeData([...addNode, ...treeData]);
                setMenuSaveDisable(false);
            });
    }

    const saveTreeData = () => {
        swal.fire({
            title: t("swal_are_you_sure"),
            text: t("swal_save_this"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: t("swal_save")
        })
            .then(async result => {
                if (result.isConfirmed) {
                    const getNodeKey = ({ treeIndex }) => treeIndex;
                    let extendedTreeData = toggleExpandedForAll({ treeData: treeData, expanded: true });
                    const flatteningNestedArray = getFlatDataFromTree({ treeData: extendedTreeData, getNodeKey });

                    console.log("flatte:", flatteningNestedArray);

                    let saveProducts = [];
                    changedMenuProducts.map((data) => {
                        saveProducts = [...saveProducts, { product: data.product._id, price: data.price, product_type: data.product_type._id, category: data.category, sub_category: data.sub_category, index: data.index }]
                    })

                    let res = await dispatch(saveSortableTree({ tree: stringify(flatteningNestedArray), menu_id: menu_id, user_id: userInfo.id, products: JSON.stringify(saveProducts) }))
                    if (res !== false) {
                        dispatch(openSnackBar({ message: t("msg_success_save"), status: 'success' }));
                    }
                    setMenuSaveDisable(true);
                }
            });
    }

    function setMenuSaveDisable(type) {
        setIsSaveDisable(type);
        dispatch(setNoSavedEditedWineMenuPage(type));
    }

    //////////////begin of sort function///////////////////////

    const setSort = (data) => {
        setSortData(data);

        let customized_products = customizeProducts(temper);    //customize the products list for group add some field and change

        customizeGroup(data);   // get the checked group and unchecked group also total group for sort and make the node
        ungroup_final = []; //initialize
        group_final = [];   //initialize
        total_group_final = []; //initialize

        if (total_group.length > 0) {   //customize for tatal sort products
            total_group.map((data, index) => {
                total_group_final = [...total_group_final, { attr: data, asc: total_group_order[index] }]
            })
        }

        customized_products = arrSort(customized_products, [...total_group_final]);     //total sort products

        if (group.length === 0) {    //when not checked the group
            let result = [];

            customized_products.map((data, index) => {
                result = [...result, {
                    title: data.product.search_field,
                    subtitle: <MenuProductItem priceFunc={changePriceOfProduct} key={data.index} data={data} menu_id={menu_id} index={data.index} />,
                    index: data.index
                }]
            });

            setTreeData(result);
        } else {
            if (ungroup.length > 0) {   //customize for ungroup sort products
                ungroup.map((data, index) => {
                    ungroup_final = [...ungroup_final, { attr: data, asc: ungroup_order[index] }]
                })
            }
            if (group.length > 0) { //customize for group sort products
                group_order.map((data, index) => {
                    group_final = [...group_final, { attr: 'title', asc: data }]
                })
            }


            let grouped_product = group.length > 0 ? groupArray(customized_products, [...group]) : customized_products; //group by the products

            let customizedTreeData = getNodes(grouped_product); //flat JSON file to tree data with children

            const sortGroup = (item, index) => {    //when title with & so mean sort by id, remove the unnecessary field
                let pos = item.title.indexOf('&');
                if (pos !== -1) {
                    item.title = item.title.substring(pos + 1);
                }
            }
            recursively(customizedTreeData, sortGroup, 'children'); //customize the data to show the react-sortable-tree

            setTreeData(customizedTreeData);
        }

        setMenuSaveDisable(false);
    }

    function customizeProducts(products) {
        let res_products = [];
        if (products.length > 0) {
            products.map((data) => {
                res_products = [
                    ...res_products, {
                        ...data, product: {
                            ...data.product,
                            product_sub_category: data.product_type._id === 0 ? { ...data.product_type.sub[data.category - 1], sort_id: data.product_type.sub[data.category - 1].index + "&" + data.product_type.sub[data.category - 1][`${globalState.language}`] } : { ...data.product_type.sub[data.category], sort_id: data.product_type.sub[data.category].index + "&" + data.product_type.sub[data.category][`${globalState.language}`] },
                            country: { ...data.product.country, sort_id: data.product.country._id + "&" + data.product.country.name[`${globalState.language}`] },
                            region: { ...data.product.region, sort_id: data.product.region._id + "&" + data.product.region.name[`${globalState.language}`] },
                            sub_region: data.product.sub_region ? { ...data.product.sub_region, sort_id: data.product.sub_region._id + "&" + data.product.region.name[`${globalState.language}`] } : { name: { en: "No Sub Region" }, _id: 999999, sort_id: "999999&No Sub Region" },
                            producer_sort: data.product.producer.country + "" + data.product.producer.region + "&" + data.product.producer.name,
                            grape: data.product.grape_variety.length > 0 ? { name: data.product.grape_variety[0].grape[`${globalState.language}`], percentage: data.product.grape_variety[0].percentage } : { name: "No Grape", percentage: 0 },
                        },
                        product_type: {
                            ...data.product_type,
                            sort_id: data.product_type._id + "&" + data.product_type.name
                        }
                    }
                ]
            })
        }
        return res_products;
    }

    function getNodes(object) {
        return Object
            .entries(object)
            .map(([key, value]) => value && typeof value === 'object'
                ? value?.length > 0 ? { title: key, key, children: customizeValue(value) } : { title: key, key, children: getNodes(value) }
                : { title: key, key, value }
            );
    }

    function customizeValue(products) {
        let result = [];
        // console.log("non group:", ungroup);
        // console.log("notsort:", products);
        products = arrSort(products, [...ungroup_final])
        // console.log("sorted:", products);

        products.map((data, index) => {
            result = [...result, {
                title: data.product.search_field,
                subtitle: <MenuProductItem priceFunc={changePriceOfProduct} key={data.index} data={data} menu_id={menu_id} index={data.index} />,
                index: data.index
            }]
        });
        return result;
    }

    function customizeGroup(data) {
        group = []; //this will be node
        group_order = []; //this will node order
        ungroup = [];   //this will be product only sort
        ungroup_order = [];   //this will be product only sort
        total_group = [];
        total_group_order = [];

        data.map(sort => {
            if (sort.attr.label === "Product-Category") {
                if (sort.order.label !== "Classic") {
                    total_group = [...total_group, 'product_type.name'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        total_group_order = [...total_group_order, true]    //"asc" = true
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        total_group_order = [...total_group_order, false]   //"desc" = false
                    }
                } else {
                    total_group = [...total_group, 'product_type._id'];
                    total_group_order = [...total_group_order, true]
                }
            } else if (sort.attr.label === "Product-Sub-Category") {
                if (sort.order.label !== "Classic") {
                    total_group = [...total_group, 'product.product_sub_category.en'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        total_group_order = [...total_group_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        total_group_order = [...total_group_order, false]
                    }
                } else {
                    total_group = [...total_group, 'product.product_sub_category.index'];
                    total_group_order = [...total_group_order, true]
                }
            } else if (sort.attr.label === "Country") {
                if (sort.order.label !== "North to South") {
                    total_group = [...total_group, 'product.country.name.en'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        total_group_order = [...total_group_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        total_group_order = [...total_group_order, false]
                    }
                } else {
                    total_group = [...total_group, 'product.country._id'];
                    total_group_order = [...total_group_order, true]
                }
            } else if (sort.attr.label === "Region") {
                if (sort.order.label !== "North to South") {
                    total_group = [...total_group, 'product.region.name.en'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        total_group_order = [...total_group_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        total_group_order = [...total_group_order, false]
                    }
                } else {
                    total_group = [...total_group, 'product.region._id'];
                    total_group_order = [...total_group_order, true]
                }
            } else if (sort.attr.label === "Sub-Region") {
                if (sort.order.label !== "North to South") {
                    total_group = [...total_group, 'product.sub_region.name.en'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        total_group_order = [...total_group_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        total_group_order = [...total_group_order, false]
                    }
                } else {
                    total_group = [...total_group, 'product.sub_region._id'];
                    total_group_order = [...total_group_order, true]
                }
            } else if (sort.attr.label === "Producer") {
                if (sort.order.label !== "North to South") {
                    total_group = [...total_group, 'product.producer.name'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        total_group_order = [...total_group_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        total_group_order = [...total_group_order, false]
                    }
                } else {
                    total_group = [...total_group, 'product.producer_sort'];
                    total_group_order = [...total_group_order, true]
                }
            } else if (sort.attr.label === "Product-Name") {
                total_group = [...total_group, 'product.product_name'];
                if (sort.order.label === "Alphabetical (a to z)") {
                    total_group_order = [...total_group_order, true]
                } else if (sort.order.label === "Alphabetical (z to a)") {
                    total_group_order = [...total_group_order, false]
                }
            } else if (sort.attr.label === "Grape Variaty") {
                total_group = [...total_group, 'product.grape.name'];
                if (sort.order.label === "Alphabetical (a to z)") {
                    total_group_order = [...total_group_order, true]
                } else if (sort.order.label === "Alphabetical (z to a)") {
                    total_group_order = [...total_group_order, false]
                }
            }

            if (sort.is_group === true) {
                if (sort.attr.label === "Product-Category") {
                    if (sort.order.label !== "Classic") {
                        group = [...group, 'product_type.name'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            group_order = [...group_order, "asc"]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            group_order = [...group_order, "desc"]
                        }
                    } else {
                        group = [...group, 'product_type.sort_id'];
                        group_order = [...group_order, "no"]
                    }
                } else if (sort.attr.label === "Product-Sub-Category") {
                    if (sort.order.label !== "Classic") {
                        group = [...group, 'product.product_sub_category.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            group_order = [...group_order, "asc"]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            group_order = [...group_order, "desc"]
                        }
                    } else {
                        group = [...group, 'product.product_sub_category.sort_id'];
                        group_order = [...group_order, "no"]
                    }
                } else if (sort.attr.label === "Country") {
                    if (sort.order.label !== "North to South") {
                        group = [...group, 'product.country.name.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            group_order = [...group_order, "asc"]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            group_order = [...group_order, "desc"]
                        }
                    } else {
                        group = [...group, 'product.country.sort_id'];
                        group_order = [...group_order, "no"]
                    }
                } else if (sort.attr.label === "Region") {
                    if (sort.order.label !== "North to South") {
                        group = [...group, 'product.region.name.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            group_order = [...group_order, "asc"]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            group_order = [...group_order, "desc"]
                        }
                    } else {
                        group = [...group, 'product.region.sort_id'];
                        group_order = [...group_order, "no"]
                    }
                } else if (sort.attr.label === "Sub-Region") {
                    if (sort.order.label !== "North to South") {
                        group = [...group, 'product.sub_region.name.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            group_order = [...group_order, "asc"]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            group_order = [...group_order, "desc"]
                        }
                    } else {
                        group = [...group, 'product.sub_region.sort_id'];
                        group_order = [...group_order, "no"]
                    }
                } else if (sort.attr.label === "Producer") {
                    if (sort.order.label !== "North to South") {
                        group = [...group, 'product.producer.name'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            group_order = [...group_order, "asc"]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            group_order = [...group_order, "desc"]
                        }
                    } else {
                        group = [...group, 'product.producer_sort'];
                        group_order = [...group_order, "no"]
                    }
                } else if (sort.attr.label === "Grape Variaty") {
                    group = [...group, 'product.grape.name'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        group_order = [...group_order, "asc"]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        group_order = [...group_order, "desc"]
                    }
                }
            } else {
                if (sort.attr.label === "Product-Category") {
                    if (sort.order.label !== "Classic") {
                        ungroup = [...ungroup, 'product_type.name'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            ungroup_order = [...ungroup_order, true]    //"asc" = true
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            ungroup_order = [...ungroup_order, false]   //"desc" = false
                        }
                    } else {
                        ungroup = [...ungroup, 'product_type._id'];
                        ungroup_order = [...ungroup_order, true]
                    }
                } else if (sort.attr.label === "Product-Sub-Category") {
                    if (sort.order.label !== "Classic") {
                        ungroup = [...ungroup, 'product.product_sub_category.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            ungroup_order = [...ungroup_order, true]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            ungroup_order = [...ungroup_order, false]
                        }
                    } else {
                        ungroup = [...ungroup, 'product.product_sub_category.index'];
                        ungroup_order = [...ungroup_order, true]
                    }
                } else if (sort.attr.label === "Country") {
                    if (sort.order.label !== "North to South") {
                        ungroup = [...ungroup, 'product.country.name.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            ungroup_order = [...ungroup_order, true]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            ungroup_order = [...ungroup_order, false]
                        }
                    } else {
                        ungroup = [...ungroup, 'product.country._id'];
                        ungroup_order = [...ungroup_order, true]
                    }
                } else if (sort.attr.label === "Region") {
                    if (sort.order.label !== "North to South") {
                        ungroup = [...ungroup, 'product.region.name.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            ungroup_order = [...ungroup_order, true]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            ungroup_order = [...ungroup_order, false]
                        }
                    } else {
                        ungroup = [...ungroup, 'product.region._id'];
                        ungroup_order = [...ungroup_order, true]
                    }
                } else if (sort.attr.label === "Sub-Region") {
                    if (sort.order.label !== "North to South") {
                        ungroup = [...ungroup, 'product.sub_region.name.en'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            ungroup_order = [...ungroup_order, true]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            ungroup_order = [...ungroup_order, false]
                        }
                    } else {
                        ungroup = [...ungroup, 'product.sub_region._id'];
                        ungroup_order = [...ungroup_order, true]
                    }
                } else if (sort.attr.label === "Producer") {
                    if (sort.order.label !== "North to South") {
                        ungroup = [...ungroup, 'product.producer.name'];
                        if (sort.order.label === "Alphabetical (a to z)") {
                            ungroup_order = [...ungroup_order, true]
                        } else if (sort.order.label === "Alphabetical (z to a)") {
                            ungroup_order = [...ungroup_order, false]
                        }
                    } else {
                        ungroup = [...ungroup, 'product.producer_sort'];
                        ungroup_order = [...ungroup_order, true]
                    }
                } else if (sort.attr.label === "Product-Name") {
                    ungroup = [...ungroup, 'product.product_name'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        ungroup_order = [...ungroup_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        ungroup_order = [...ungroup_order, false]
                    }
                } else if (sort.attr.label === "Grape Variaty") {
                    ungroup = [...ungroup, 'product.grape.name'];
                    if (sort.order.label === "Alphabetical (a to z)") {
                        ungroup_order = [...ungroup_order, true]
                    } else if (sort.order.label === "Alphabetical (z to a)") {
                        ungroup_order = [...ungroup_order, false]
                    }
                }
            }
        })
        return { group, group_order, ungroup, ungroup_order };
    }

    //////////////end of sort function///////////////////////

    const exportCSV = () => {
        let datas = [];
        if (temper.length > 0) {
            temper.map((data, index) => {
                const { product, price, product_type } = data;
                const { producer_name, vintage, article_nr, aroma, food_pairing, allergy, product_name, wine_color, category, sub_category, grape_variety, bottle_image,
                    bottle_size, country, region, sub_region, description_text, alc_vol, barrel_type, closure_type, wine_acid, company, taste, residual_sugar } = product;

                let aroma_show = ""
                let food_show = ""
                let allergy_show = ""
                let grape_show = ""

                if (aroma.length > 0) {
                    aroma.map((data, index) => {
                        if (index === aroma.length - 1) {
                            aroma_show += data[`${globalState.language}`];
                        } else {
                            aroma_show += data[`${globalState.language}`] + ";"
                        }
                    })
                }
                if (food_pairing.length > 0) {
                    food_pairing.map((data, index) => {
                        if (index === food_pairing.length - 1) {
                            food_show += data[`${globalState.language}`];
                        } else {
                            food_show += data[`${globalState.language}`] + ";"
                        }
                    })
                }
                if (allergy.length > 0) {
                    allergy.map((data, index) => {
                        if (index === allergy.length - 1) {
                            allergy_show += data[`${globalState.language}`];
                        } else {
                            allergy_show += data[`${globalState.language}`] + ";"
                        }
                    })
                }
                if (grape_variety.length > 0) {
                    grape_variety.map((data, index) => {
                        if (index === grape_variety.length - 1) {
                            if (data.percentage === null) {
                                grape_show += data.grape[`${globalState.language}`];
                            } else {
                                grape_show += data.percentage + "% " + data.grape[`${globalState.language}`];
                            }
                        } else {
                            if (data.percentage == null) {
                                grape_show += data.grape[`${globalState.language}`] + ";";
                            } else {
                                grape_show += data.percentage + "% " + data.grape[`${globalState.language}`] + ";";
                            }
                        }
                    })
                }

                let bottlesize_options = ['6.0L', '3.0L', '1.5L', '1.0L', '0.75L', '0.7L', '0.5L', '0.375L', '0.33L', '0.2L'];
                let amount = [];
                let amount_price = [];
                if (price.length > 0) {
                    price.map((data, index) => {
                        amount = [...amount, bottlesize_options[data.bottle_size]];
                        amount_price = [...amount_price, data.price + data.price_unit]
                    })
                }
                datas = [...datas, {
                    producer_name: producer_name,
                    vintage: vintage && vintage,
                    article_nr: article_nr ? article_nr : "N/A",
                    aroma: aroma.length > 0 ? aroma_show : "N/A",
                    food_pairing: food_pairing.length > 0 ? food_show : "N/A",
                    allergy: allergy.length > 0 ? allergy_show : "N/A",
                    product_name: product_name ? product_name : "N/A",
                    product_type: product_type.name,
                    wine_color: wine_color ? wine_color?.name : "N/A",
                    category: category ? (product_type._id === 0 ? product_type.sub[category - 1][`${globalState.language}`] : product_type.sub[category][`${globalState.language}`]) : "N/A",
                    sub_category: sub_category ? (product_type._id === 0 ? product_type.sub[category - 1].sub[sub_category] : product_type.sub[category].sub[sub_category]) : "N/A",
                    bottle_size: bottle_size.bottle_size + " " + bottle_size.unit,
                    country: country.name[`${globalState.language}`],
                    region: region.name[`${globalState.language}`],
                    sub_region: sub_region ? sub_region.name[`${globalState.language}`] : "N/A",
                    grape_variety: grape_variety.length > 0 ? grape_show : "N/A",
                    company: company ? company.name : "N/A",
                    description_text: description_text ? description_text : "N/A",
                    taste: taste ? product_type.sub[category - 1].taste[taste] : "N/A",
                    alc_vol: alc_vol ? alc_vol : "N/A",
                    barrel_type: barrel_type ? barrel_type : "N/A",
                    closure_type: closure_type ? closure_type[`${globalState.language}`] : "N/A",
                    residual_sugar: residual_sugar ? residual_sugar : "N/A",
                    wine_acid: wine_acid ? wine_acid : "N/A",
                    image_path: bottle_image.changed_name ? "/Images/" + bottle_image.changed_name : "N/A",
                    amount_1: amount[0], price_1: amount_price[0],
                    amount_2: amount[1], price_2: amount_price[1],
                    amount_3: amount[2], price_3: amount_price[2],
                    amount_4: amount[3], price_4: amount_price[3],
                    amount_5: amount[4], price_5: amount_price[4],
                    amount_6: amount[5], price_6: amount_price[5],
                    amount_7: amount[6], price_7: amount_price[6],
                    amount_8: amount[7], price_8: amount_price[7],
                    amount_9: amount[8], price_9: amount_price[8],
                    amount_10: amount[9], price_10: amount_price[9],
                }]
            })
        }

        const columns = {
            producer_name: 'producer', vintage: 'vintage', article_nr: "article_nr", aroma: "aroma", price: "price",
            food_pairing: "food", allergy: "allergy", product_name: "name", product_type: "product_type", wine_color: "wine_color",
            category: "category", sub_category: "sub_category", bottle_size: "bottle_size", country: "country", region: "region",
            sub_region: "sub_region", grape_variety: "grape_variety", company: "company", description_text: "description",
            taste: "taste", alc_vol: "alc_vol", barrel_type: "barrel_type", closure_type: "closure_type", residual_sugar: "residual_sugar", wine_acid: "wine_acid",
            image_path: "@images",
            amount_1: "amount_1", price_1: "price_1", amount_2: "amount_2", price_2: "price_2", amount_3: "amount_3", price_3: "price_3", amount_4: "amount_4", price_4: "price_4",
            amount_5: "amount_5", price_5: "price_5", amount_6: "amount_6", price_6: "price_6", amount_7: "amount_7", price_7: "price_7", amount_8: "amount_8", price_8: "price_8",
            amount_9: "amount_9", price_9: "price_9", amount_10: "amount_10", price_10: "price_10",
        };
        // const columns = [
        //     'producer_name', 'vintage', "article_nr", "aroma", "price",
        //     "food_pairing", "allergy", "product_name", "product_type", "wine_color",
        //     "category", "sub_category", "bottle_size", "country", "region",
        //     "sub_region", "grape_variety", "company", "description_text",
        //     "taste", "alc_vol", "barrel_type", "closure_type", "residual_sugar", "wine_acid"
        // ];

        downloadCsv(datas, columns, menu_name);
    }

    return (
        <div>
            <div className="flex justify-between mx-8 py-4">
                <div className="flex gap-4">
                    <AddProductsModal addProducts={insertProducts} />
                    <CreateGroupModal addGroup={createGroup} />
                </div>
                <div className="flex gap-4">
                    {
                        userInfo?.role == 0 && 
                        <div>
                            <Button onClick={() => exportCSV()} outline={true} className="bg-sitebg-200" >
                                <BiExport className="mr-2 h-6 w-6 text-sitebg-50" />
                                {t("export_csv")}
                            </Button>
                        </div>
                    }
                    {/* <div>
                        <Button onClick={() => printList()} outline={true} className="bg-sitebg-200" >
                            <HiOutlinePrinter className="mr-2 h-6 w-6 text-sitebg-50" />
                            {t("print_list")}
                        </Button>
                    </div> */}
                    <div>
                        <Button onClick={() => saveTreeData()} outline={true} className="bg-sitebg-200" disabled={isSaveDisable} >
                            <FiSave className="mr-2 h-6 w-6 text-sitebg-300" />
                            {t("save_changes")}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mx-8 pb-2">
                <SortModal setData={setSort} />
                <div className="flex gap-4">
                    <div className="flex">
                        <div className="m-2 mr-4 block">
                            {t("search")}
                        </div>
                        <TextInput
                            type="search"
                            placeholder="Search name"
                            value={searchString}
                            icon={HiOutlineSearch}
                            onChange={(e) => handleSearchOnChange(e)}
                            color="info"
                        />
                    </div>
                    <div>
                        <Button onClick={() => selectPrevMatch()} >
                            <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
                            {t("previous")}
                        </Button>
                    </div>
                    <div>
                        <Button onClick={() => selectNextMatch()} >
                            {t("next")}
                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                    <div className="m-2 block">
                        {searchFocusIndex} / {searchFoundCount}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center">
                        <div onClick={() => toggleNodeExpansion(true)} className="flex justify-center items-center px-4 cursor-pointer rounded-lg">
                            <BsArrowsAngleExpand className="mr-2 h-6 w-6 text-sitebg-50 " />
                            <ul>{t("expand_all")}</ul>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div onClick={() => toggleNodeExpansion(false)} className="flex justify-center items-center px-4 cursor-pointer rounded-lg">
                            <BsArrowsAngleContract className="mr-2 h-6 w-6 text-sitebg-50" />
                            <ul>{t("collapse_all")}</ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <SortableStyle>
                    <SortableTree
                        // theme={FileExplorerTheme}
                        treeData={treeData}
                        onChange={data => handleTreeOnChange(data)}
                        onMoveNode={({ node, treeIndex, path }) =>
                            global.console.debug(
                                "node:",
                                node,
                                "treeIndex:",
                                treeIndex,
                                "path:",
                                path
                            )
                        }
                        maxDepth={maxDepth}                     //depth of tree
                        onlyExpandSearchedNodes={true}
                        searchMethod={customSearchMethod}       //for search regex
                        searchQuery={searchString}              //search string
                        searchFocusOffset={searchFocusIndex}    //search focus node
                        canDrag={({ node }) => !node.noDragging}
                        canDrop={({ nextParent }) => !nextParent || !nextParent.noChildren}
                        searchFinishCallback={(matches) => {
                            setSearchFoundCount(matches.length);
                            setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
                        }}
                        isVirtualized={true}
                        // style={{ borderRadius: "50px", width: "100%" }}
                        rowHeight={customRowHeight}
                        generateNodeProps={(rowInfo) => {
                            const { node, path } = rowInfo;
                            return {
                                title: (
                                    <TextInput
                                        type="search"
                                        sizing="md"
                                        required={true}
                                        icon={FiEdit3}
                                        value={node.title}
                                        className={`${node.subtitle ? "hidden" : "none"} `}
                                        onChange={event => {
                                            const title = event.target.value;

                                            setTreeData(changeNodeAtPath({
                                                treeData: treeData,
                                                path,
                                                getNodeKey: ({ treeIndex }) => treeIndex,
                                                newNode: { ...node, title },
                                            }));
                                        }}
                                    />
                                ),
                                buttons: [
                                    <Tooltip
                                        style="light"
                                        content={
                                            <div >
                                                <div onClick={() => clickDuplicate(rowInfo)} className="flex text-gray-600 p-1 cursor-pointer hover:bg-gray-100">
                                                    <HiOutlineDuplicate className="h-6 w-6 mr-2 text-gray-600" />
                                                    {t("duplicate")}
                                                </div>
                                                <div onClick={() => clickDelete(rowInfo)} className="flex text-red-500 p-1 cursor-pointer hover:bg-gray-100">
                                                    <HiOutlineTrash className="h-6 w-6 mr-2 text-red-500" />
                                                    {t("delete")}
                                                </div>
                                            </div>
                                        }
                                        placement="left"
                                        arrow={false}
                                        trigger="hover"
                                    >
                                        <HiDotsHorizontal className="w-6 h-6 text-sitetx-200" />
                                    </Tooltip>
                                ],
                                // style: { borderRadius: `10px`, maxWidth: "1100px" }
                            };
                        }}
                    />
                </SortableStyle>
            </div>
        </div>
    );
}

export default Sortable;
