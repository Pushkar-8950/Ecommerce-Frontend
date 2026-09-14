import { Outlet } from "react-router-dom";
import ArtisanNavbar from "../components/artisan-side-component/ArtisanNavbar";

function ArtisanLayout() {
  return (
    <>
      <ArtisanNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default ArtisanLayout;