import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';

import Transition from '../../utils/Transition';
import DropdownClassic from "./DropdownClassic";
import { setCurrentLanguage } from '../../redux/globalReducer';

function DropdownHelp({
  align,
}) {
  const options = [
    {value: 'de', lang: 'Deutsch'},
    {value: 'en', lang: 'English'},
  ];
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [language, setLanguage] = useState("de");
  const { i18n } = useTranslation();

  const dispatch = useDispatch();

  const trigger = useRef(null);
  const dropdown = useRef(null);


  const handleLangChange = lang => {
      setLanguage(lang);
      i18n.changeLanguage(lang);
      dispatch(setCurrentLanguage(lang));
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-full ${dropdownOpen && 'bg-slate-200'}`}
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">{options[selected].value?.toUpperCase()}</span>
        <svg className="w-4 h-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-current text-slate-500" d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
        </svg>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white border border-slate-200 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="text-xs font-semibold text-slate-400 uppercase pt-1.5 pb-2 px-4 whitespace-nowrap">Select your language.</div>
          <ul>
            {
              options.map((option, index) => (
                <li key={`lang-${option.value}`}>
                  <Link
                    className={selected === index ? "font-medium text-sm text-indigo-500 hover:text-indigo-600 flex items-center py-1 px-3" :  "font-medium text-sm hover:text-indigo-600 flex items-center py-1 px-3"}
                    to="#0"
                    onClick={() => {
                      setDropdownOpen(!dropdownOpen);
                      setSelected(index);
                      handleLangChange(option.value);
                    }}
                  >
                    <svg className="w-3 h-3 fill-current text-indigo-300 shrink-0 mr-2" viewBox="0 0 12 12">
                      <rect y="3" width="12" height="9" rx="1" />
                      <path d="M2 0h8v2H2z" />
                    </svg>
                    <span>{option.lang}</span>
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </Transition>
    </div>
  )
}

export default DropdownHelp;