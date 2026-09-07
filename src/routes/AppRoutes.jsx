import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Account from "../pages/Account";
import Orders from "../pages/Orders";
import ArtisanHome from "../components/artisan/ArtisanHome";

function AppRoutes() {
  return (

    // Buyer Side

    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
      </Route>

      {/* ================= ARTISAN SIDE ================= */}

      <Route path="/artisan" element={<ArtisanHome />} />

      {/* ================= ERROR 404 ================= */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;