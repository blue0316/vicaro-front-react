import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { openSnackBar } from '../../../redux/snackBarReducer';
import { forgotPassword } from '../../../redux/authReducer';
import { isEmail } from '../../../utils';
import { useTranslation } from "react-i18next";

export default function Forgot() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validation = () => {
    if (email === '') {
      dispatch(openSnackBar({ status: "warning", message: t("msg_fill_email") }))
      return false;
    } else {
      if (isEmail(email) === false) {
        dispatch(openSnackBar({ status: "warning", message: t("msg_invalid_email") }))
        return false;
      }
    }
    return true;
  }

  const forgot = () => {
    if (validation()) {
      dispatch(forgotPassword(email));
    }
  }

  return (
    <section className="bg-sitebg-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link href="#" className="flex items-center mb-6 text-4xl font-bold text-white dark:text-white">
          <img
            src="/faviconicontext_onDark.svg"
            className="mr-3 h-20 w-auto sm:h-18 sm:w-auto"
            alt="Vicaro Logo"
          />
          {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" /> */}
          {/* vicaro• */}
        </Link>
        <br />
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("forgot_password")}
            </h1>
            <h5 className='text-sm text-center font-medium text-gray-500'>{t("enter_email_reset_password")}</h5>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t("email")}</label>
                <input type="email" name="email" onChange={e => setEmail(e.target.value)} id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-sitebg-300" placeholder="name@company.com" required />
              </div>
              <div className='flex justify-center items-center'>
                <button onClick={() => forgot()} type="button" className="w-32  items-center text-white bg-sitebg-50 hover:bg-sitebg-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 mx-2 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t("submit")}</button>
                <button onClick={() => navigate("/signin")} type="button" className="w-32 items-center text-gray-500 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 mx-2 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t("cancel")}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
