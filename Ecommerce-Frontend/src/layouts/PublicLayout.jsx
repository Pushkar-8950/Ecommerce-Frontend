import { Outlet } from "react-router-dom";
import Navbar from "../components/buyer-side-components/Navbar";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PublicLayout;