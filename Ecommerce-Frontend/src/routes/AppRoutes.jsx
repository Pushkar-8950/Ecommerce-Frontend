import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import ArtisanLayout from "../layouts/ArtisanLayout";
import Home from "../pages/buyer-side-pages/Home";
import Explore from "../pages/buyer-side-pages/Explore";
import BuyerLogin from "../pages/buyer-side-pages/BuyerLogin";
import BuyerRegister from "../pages/buyer-side-pages/BuyerRegister";
import ProductDetails from "../pages/buyer-side-pages/ProductDetails";
import NotFound from "../pages/buyer-side-pages/NotFound";
import Cart from "../pages/buyer-side-pages/Cart";
import Wishlist from "../pages/buyer-side-pages/Wishlist";
import Account from "../pages/buyer-side-pages/Account";
import Orders from "../pages/buyer-side-pages/Orders";
import ArtisanHome from "../pages/artisan-side-pages/ArtisanHome";
import AddProduct from "../pages/artisan-side-pages/AddProduct";
import ArtisanProducts from "../pages/artisan-side-pages/ArtisanProducts";
import ArtisanOrders from "../pages/artisan-side-pages/ArtisanOrders";
import ArtisanProfile from "../pages/artisan-side-pages/ArtisanProfile";
import RegistrationPage from "../pages/common-pages/RegistrationPage";
import ArtisanRegisterFirstPage from "../pages/artisan-side-pages/ArtisanRegisterFirstPage";
import ArtisanRegisterSecondPage from "../pages/artisan-side-pages/ArtisanRegisterSecondPage"
import ArtisanRegisterThirdPage from "../pages/artisan-side-pages/ArtisanRegisterThirdPage"
import ArtisanRegisterFourthPage from "../pages/artisan-side-pages/ArtisanRegisterFourthPage"
import ArtisanRegisterFifthPage from "../pages/artisan-side-pages/ArtisanRegisterFifthPage"
import ArtisanRegisterSixthPage from "../pages/artisan-side-pages/ArtisanRegisterSixthPage"

function AppRoutes() {
  return (

    // {/* ================= BUYER SIDE ================= */}

    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      <Route path="/buyer-login" element={<BuyerLogin />} />
      <Route path="/buyer-register" element={<BuyerRegister />} />

      {/* ================= ARTISAN SIDE ================= */}

      <Route element={<ArtisanLayout />}>
        <Route path="/artisan" element={<ArtisanHome />} />
        <Route path="/artisan/add-product" element={<AddProduct />} />
        <Route path="/artisan/products" element={<ArtisanProducts />} />
        <Route path="/artisan/orders" element={<ArtisanOrders />} />
        <Route path="/artisan/profile" element={<ArtisanProfile />} />
      </Route>

      <Route path="/artisan-register-1" element={<ArtisanRegisterFirstPage />} />
      <Route path="/artisan-register-2" element={<ArtisanRegisterSecondPage />} />
      <Route path="/artisan-register-3" element={<ArtisanRegisterThirdPage />} />
      <Route path="/artisan-register-4" element={<ArtisanRegisterFourthPage />} />
      <Route path="/artisan-register-5" element={<ArtisanRegisterFifthPage />} />
      <Route path="/artisan-register-6" element={<ArtisanRegisterSixthPage />} />

      {/* ================= ERROR 404 ================= */}

      <Route path="*" element={<NotFound />} />
    
      {/* ================= COMMON SIDE =============== */}
      <Route path="/RegistrationPage" element={<RegistrationPage />} />
    </Routes>
  );
}

export default AppRoutes;