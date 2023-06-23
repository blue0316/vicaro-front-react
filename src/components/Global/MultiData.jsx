import React, { useState } from "react";
import { HiOutlineMinus, HiOutlinePlus } from "react-icons/hi";
import { useDispatch } from 'react-redux'
import Select from 'react-tailwindcss-select';
import styled from 'styled-components';
import { openSnackBar } from '../../redux/snackBarReducer';
import { useTranslation } from "react-i18next";

export const StyleWrapper = styled.div`
.flex.text-sm.text-gray-500.border.border-gray-300.rounded.shadow-sm.transition.duration-300{
	height: 42px
}
`

function MultiData(props) {
	const { t } = useTranslation();
	const { title, itemTitle, option_data, exist_data, setExistData, addMultiData } = props;
	const dispatch = useDispatch();

	const [showSelectData, setShowSelectData] = useState("");

	const clickAddMultiData = () => {
		var flag = false;
		if (showSelectData) {
			exist_data.map((data, i) => {
				if (data.label === showSelectData.label) {
					flag = true;
					setShowSelectData("");
					dispatch(openSnackBar({ status: "error", message: `${t("msg_already_exist")} ${showSelectData.label.toLowerCase()} in ${title.toLowerCase()}` }));
				}
			})

			if (!flag) {
				addMultiData(itemTitle, showSelectData);

				setShowSelectData("");
			}
		} else {
			dispatch(openSnackBar({ status: "error", message: `${t("msg_plz_select")} ${title.toLowerCase()} ${t("name")}` }));
		}
	}

	return (
		<div>
			<div className="m-2 ml-2 text-sm block">
				{title}
			</div>

			{
				exist_data.length > 0 && exist_data?.map((item, index) =>
					<div key={index} className="grid gap-4 align-middle pb-2" style={{ gridTemplateColumns: "2fr 0.5fr" }}>
						<div>
							<StyleWrapper>
								<Select
									value={item}
									onChange={value => setExistData(itemTitle, "change", value, index)}
									options={option_data}
									isSearchable
								/>
							</StyleWrapper>
						</div>
						<div>
							<label
								onClick={() => setExistData(itemTitle, "remove", index)}
								className="flex flex-col justify-center items-center float-right w-10 h-10 bg-red-100 rounded-lg border-2 border-red-500 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-red-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
							>
								<div className="flex flex-col justify-center items-center pt-5 pb-6">
									<HiOutlineMinus className="text-red-500 h-6 w-6" />
								</div>
							</label>
						</div>
					</div>
				)
			}
			<div>
				<div className="grid gap-4 align-middle" style={{ gridTemplateColumns: "2fr 0.5fr" }}>
					<div>
						<StyleWrapper>
							<Select
								value={showSelectData}
								onChange={value => setShowSelectData(value)}
								options={option_data}
								isSearchable
							/>
						</StyleWrapper>

					</div>
					<div>
						<label
							onClick={() => setShowSelectData("")}
							className="flex flex-col justify-center items-center float-right w-10 h-10 bg-red-100 rounded-lg border-2 border-red-500 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-red-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							<div className="flex flex-col justify-center items-center pt-5 pb-6">
								<HiOutlineMinus className="text-red-500 h-6 w-6" />
							</div>
						</label>
					</div>
				</div>
				<div onClick={() => clickAddMultiData()} className="flex justify-center items-center w-full pt-2">
					<label className="flex flex-col justify-center items-center w-full h-14 bg-gray-50 rounded-lg border-2 border-sitebg-50 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
						<div className="flex flex-col justify-center items-center pt-5 pb-6">
							<HiOutlinePlus className="ml-2 h-7 w-7 text-sitebg-50" />
						</div>
					</label>
				</div>
			</div>

		</div>
	);
}

export default MultiData;
