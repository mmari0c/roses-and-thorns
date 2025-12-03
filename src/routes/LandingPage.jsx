import "./LandingPage.css";
import { useNavigate, Link } from "react-router"
import { useState, useEffect} from "react"
import { supabase } from "../client";
import Logo from "../assets/logo.png";

function LandingPage () {

   const [form, setForm] = useState({ username: "", password: "" });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();

useEffect( () => {
   document.body.classList.add("landing-body");
   document.documentElement.classList.add("landing-html");


   supabase.auth.getSession().then( ({ data }) => {
      if (data.session) {
         navigate("/feed");
      }
   });

   return () => {
     document.body.classList.remove("landing-body");
     document.documentElement.classList.remove("landing-html");
   };
}, [navigate] );

   const handleChange = (e) => {
      const {name, value} = e.target;
      setForm( (prev) => ({...prev, [name]: value}) );
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      setError("");

      const { email, password } = form;

      const { data, error } = await supabase.auth.signInWithPassword({
         email,
         password,
      });

      if (error) {
         console.log(error)
         setError(error.message);
         return;
      }

      navigate("/feed");
   };

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
      <form className="landing-form" onSubmit={handleLogin}>
         <input name="email" value={form.email} type="email" placeholder="Email" required onChange={handleChange}/>
         <input name="password" value={form.password} type="password" placeholder="Password" required onChange={handleChange}/>
         <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
         </button>
      </form>

      { error && <p className="error-text">{error}</p> }

      <p className="signup-text">
      New here? <Link to="/signup"> Sign Up</Link>
      </p>
   </div>



   </div>

   </div>
  );
}

export default LandingPage;