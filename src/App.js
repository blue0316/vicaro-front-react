import { Suspense, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import "./i18n";
import Forgot from './pages/auth/forgot';
import SignIn from './pages/auth/signin';
import SignUp from './pages/auth/signup';

import Company from './pages/company';
import Menu from './pages/menu';
import MenuEdit from './pages/menuedit';
import Product from './pages/products';
import User from './pages/user';

import Sortable from './components/MenuEdit/Sortable';

import {
  getAllAllergy,
  getAllAroma,
  getAllBottleSize,
  getAllCategory,
  getAllClosureType,
  getAllCountry,
  getAllFood,
  getAllGlobalProductType,
  getAllGrape,
  getAllTaste,
  getAllWineColor,
  getTotalRegion,
  getTotalSubRegion
} from './redux/locationReducer';
import { getTotalProducer } from './redux/producerReducer';


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCategory());
    dispatch(getAllWineColor());
    dispatch(getAllBottleSize());
    dispatch(getAllCountry());
    dispatch(getTotalRegion());
    dispatch(getTotalSubRegion());
    dispatch(getAllGrape());
    dispatch(getAllAroma());
    dispatch(getAllFood());
    dispatch(getAllAllergy());
    dispatch(getAllClosureType());
    dispatch(getAllTaste());
    dispatch(getTotalProducer());
    dispatch(getAllGlobalProductType());
  }, [])

  return (
    <Suspense fallback="loading">
      <div className="App h-full">
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/products" element={<Product />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/menuedit" element={<MenuEdit />} />
          <Route path="/company" element={<Company />} />
          <Route path="/user" element={<User />} />

          <Route path="/sort" element={<Sortable />} />
        </Routes>
      </div>
    </Suspense>
  );
}

export default App;
