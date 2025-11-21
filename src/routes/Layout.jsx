import { Outlet } from "react-router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"
import Logo from "../assets/logo.png";
import "./Layout.css"

function Layout() {
   return (
      <div className="layout">
         <header className="app-header">
            <h1 className="app-title">
               <div>
                  <img src={Logo} alt="Roses & Thorns Logo" />
               </div>
               <div>
                  <span className="title-rose">Roses</span>
                  <span className="and-brown"> & </span>
                  <br />
                  <span className="title-thorn">Thorns</span>
               </div>
            </h1>

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