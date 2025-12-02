import { useNavigate, Link } from "react-router"
import { useState, useEffect } from "react"
import { supabase } from "../client";
import Logo from "../assets/logo.png";

function SignUp() {

   const [form, setForm] = useState({ email: "", password: "", username: "" });
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      document.body.classList.add("landing-body");
    
      return () => {
        document.body.classList.remove("landing-body");
      };
    }, []);    

   const handleChange = (e) => {
      const {name, value} = e.target;
      setForm( (prev) => ({...prev, [name]: value}) );
   };

   const handleSignUp = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const { email, password, username } = form;

      const { data, error } = await supabase.auth.signUp({
         email,
         password,
         options: {
            data: { username: username }
         }
      });

      setLoading(false);

      if (error) {
         console.log(error);
         setError(error.message);
         return;
      }

      navigate("/feed");
   }

  return (
      <div className="landing-container">
      <div className="landing-right">
      <div className="landing-header">
         <img className="signup-img" src={Logo} alt="roses & thorns logo" />
         <h1>Create your account</h1>
         <p>Start sharing your roses and thorns with the community.</p>
      </div>

      <form className="landing-form" onSubmit={handleSignUp}>
         <input name="email" value={form.email}type="email" placeholder="Email" required onChange={handleChange} />
         <input name="username" value={form.username} type="text" placeholder="Username" required onChange={handleChange}/>
         <input name="password" value={form.password} type="password" placeholder="Password" required onChange={handleChange}/>
         <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
         </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      <p className="signup-text">
         Already have an account? <Link to="/">Log In</Link>
      </p>
      </div>
   </div>
  )
}

export default SignUp