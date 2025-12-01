import "./LandingPage.css";
import { Link } from "react-router";
import Logo from "../assets/logo.png";

function LandingPage () {
  return (
   <div className="landing-container">

   {/* left side */}
   <div className="landing-left">
   <img 
      src={Logo} 
      alt="Roses & Thorns logo" 
      className="landing-logo"
   />
   </div>

   {/* right side */}
   <div className="landing-right">

   <div className="landing-header">
      <h1>Roses & Thorns</h1>
      <p>
         A reflective social platform where you can share meaningful moments 
         from your day — the roses and the thorns — and everything in between.
      </p>
   </div>

   <div>
      <form className="landing-form">
         <input type="text" placeholder="Username" />
         <input type="password" placeholder="Password" />
         <button type="submit">Log In</button>
      </form>
      <p className="signup-text">
      New here? <Link to="/signup"> Sign Up</Link>
      </p>
   </div>



   </div>

   </div>
  );
}

export default LandingPage;