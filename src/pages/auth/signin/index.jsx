import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Validator from 'validator';
import { login } from '../../../redux/authReducer';
import { openSnackBar } from '../../../redux/snackBarReducer';

const SignIn = (props) => {
  const { t } = useTranslation();
  const { authState } = useSelector((state) => state);
  const { loggedIn } = authState;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      dispatch(openSnackBar({ status: "success", message: t("msg_success_login") }))
      navigate('/products');
      return;
    }
  })

  const validation = () => {
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

  const signin = () => {
    if (validation() === true) {
      dispatch(login(email, password))
    }
  }

  return (
    <section className="bg-prime-color bg-prime-gradient dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
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
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t("signin")}
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-sitebg-300" placeholder="name@company.com" required="" />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-sitebg-300" required="" />
              </div>
              <div className="flex justify-center items-center">
                <Link className='mx-2 text-sm item-center font-medium text-gray-500 underline dark:text-primary-500' to="/forgot">
                  {t("forgot_password")}
                </Link>
              </div>
              <div className='flex justify-center items-center'>
                <button color={'red'} onClick={() => signin()} type="button" className="w-48 items-center text-white bg-sitebg-50 hover:bg-sitebg-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{t("signin")}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignIn;