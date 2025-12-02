import { Outlet, useNavigate, Link } from "react-router"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { supabase } from "../client";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons"

import Logo from "../assets/logo.png";
import "./Layout.css"

function Layout() {

   const navigate = useNavigate();
   const [username, setUsername] = useState("");
   const [menuOpen, setMenuOpen] = useState(false);

   const toggleMenu = () => {
   setMenuOpen((prev) => !prev);
   };


   useEffect( () => {
      const getUsername = async () => {
         const { data, error } = await supabase.auth.getUser();
         if (!error) {
            setUsername(data.user.user_metadata.username);
         }
       };
      getUsername();
   },[]);

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

            <nav className="app-nav">
               <div className="user-menu-wrapper" onClick={toggleMenu}>
                  <span className="username">{username}</span>
                  <FontAwesomeIcon icon={faCircleUser} size="2x" />
               </div>

               {menuOpen && (
                  <div className="user-dropdown">
                     <Link to={`/profile/${username}`} >
                        <button>View Profile</button>
                     </Link>
                     <button onClick={handleLogout}>Log Out</button>
                  </div>
               )}
            </nav>

         </header>

         <main>
            <Outlet />
         </main>
      </div>
   )
}

export default Layout