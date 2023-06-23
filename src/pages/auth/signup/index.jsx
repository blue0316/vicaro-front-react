import { Button } from '@material-ui/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { registerUser } from '../../../redux/authReducer';
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import Validator from 'validator';
import { openSnackBar } from '../../../redux/snackBarReducer';

export default function Index() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const clickSignUpBtn = () => {
    if (email === '') {
      dispatch(openSnackBar({ status: "warning", message: t("msg_fill_email") }))
      return false;
    } else {
      if (!Validator.isEmail(email)) {
        dispatch(openSnackBar({ status: "warning", message: t("msg_invalid_email") }))
        return false;
      }
    }
    if (password === '') {
      dispatch(openSnackBar({ status: "warning", message: t("msg_fill_password") }))
      return false;
    }
    return true;
  }

  return (
    <section className="bg-prime-color bg-prime-gradient dark:bg-gray-900">
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <Link to="#" className="flex items-center mb-6 text-4xl font-bold text-white dark:text-white">
          <img
            src="/faviconicontext_onDark.svg"
            className="h-20 w-auto sm:h-18 sm:w-auto"
            alt="Vicaro Logo"
          />
          {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
          {/* vicaro• */}
        </Link>
        <br />
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className='text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white' >{t("signup_page")}</h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-sitebg-300" placeholder="name@company.com" required="" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-sitebg-300" required="" />
              </div>
              <div className='mt-3 justify-center flex'>
                <div>
                  <Button color={'red'} className='mx-2 item-center text-white font-medium no-underline rounded-lg text-sm px-5 py-2.5 dark:text-primary-500' variant='contained' onClick={() => clickSignUpBtn()}>{t("signup")}</Button>
                </div>
                <Link to="/signin">
                  <Button color={'red'} className='w-48 items-center focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center' variant='contained'>{t("go_to_login_page")}</Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
