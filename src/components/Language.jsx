import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';

import DropdownClassic from "./theme/DropdownClassic";
import { setCurrentLanguage } from '../redux/globalReducer';

function Language() {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState("de");

    const dispatch = useDispatch();

    const handleLangChange = lang => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
        dispatch(setCurrentLanguage(lang));
    };

    return (
        <div className="px-4 m-auto">
            <DropdownClassic options={[
                {value: 'de', lang: 'Deutsch'},
                {value: 'en', lang: 'English'},
            ]} selectedIndex={1} action={handleLangChange} />
        </div>
    );
};

export default Language;
