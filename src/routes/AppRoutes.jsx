import { Routes, Route } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductDetails from "../pages/ProductDetails";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;