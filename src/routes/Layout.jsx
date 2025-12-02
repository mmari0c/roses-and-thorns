import { Outlet, useNavigate, Link } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { supabase } from "../client";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"

import Logo from "../assets/logo.png";
import "./Layout.css"

function Layout() {
   const navigate = useNavigate();

   const handleLogout = async () => {
      await supabase.auth.signOut();
      navigate("/");
   }

   return (
      <div className="layout">
         <header className="app-header">
            <h1 className="app-title">
               <div>
                  <Link to="/feed" className="brand">
                     <img src={Logo} alt="Roses & Thorns logo" className="brand-logo" />
                  </Link>
               </div>
               <div>
                  <span className="title-rose">Roses</span>
                  <span className="and-brown"> & </span>
                  <br />
                  <span className="title-thorn">Thorns</span>
               </div>
            </h1>

            <button onClick={handleLogout} className="logout-button">
               Log Out
            </button>

            <nav className="app-nav">
               <FontAwesomeIcon icon={faCircleUser} size="2x" />
               {/* You can swap for Login / Sign Up */}
            </nav>
         </header>

         <main>
            <Outlet />
         </main>
      </div>
   )
}

export default Layout