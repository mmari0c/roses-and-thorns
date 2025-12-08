import { Outlet, useNavigate, Link } from "react-router"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHeart, faPencil, faBook, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons"
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
            <Link to="/feed" className="brand">
               <h1 className="app-title">
                  <img src={Logo} alt="Roses & Thorns logo" className="brand-logo" />
                  <div className="title">
                     <span className="title-rose">Roses & </span>
                     <span className="title-thorn">Thorns</span>
                  </div>
               </h1>
            </Link>

            <nav className="app-nav">
               <Link to={"/create-post"}>
               <button className="create-post-button"><FontAwesomeIcon icon={faPencil} />Write Entry</button>
               </Link>
               <div className="user-menu-wrapper" onClick={toggleMenu}>
                  <FontAwesomeIcon icon={faCircleUser} size="2x" />
               </div>

               {menuOpen && (
                  <div className="user-dropdown">
                     <span>{username}</span>
                     <Link to={`/profile/${username}`} >
                        <button className="dropdown-button">
                        <FontAwesomeIcon icon={faBook} />My Journal
                        </button>
                     </Link>
                     <button className="dropdown-button" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} />Log Out
                     </button>
                  </div>
               )}
            </nav>

         </header>

         <main className="paper-shell">
            <Outlet />
         </main>

         <footer>
            <p class="footer-tagline">every rose has its thorns.</p>
            <p class="footer-credit">
               Made with <FontAwesomeIcon icon={faHeart} /> by 
               <a target="_blank" className="footer-name" href="https://marionolasco.com/"> Mario Nolasco</a>
            </p>
            <p class="footer-app">© Roses & Thorns</p>
         </footer>


      </div>
   )
}

export default Layout