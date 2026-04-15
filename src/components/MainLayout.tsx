// App shell. Every route renders inside the <Outlet/>, which keeps the header
// and footer mounted across navigations (no full-page re-renders).

import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MainLayout;
