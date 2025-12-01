import { Link } from "react-router"

function SignUp() {
  return (
      <div className="landing-container">
      <div className="landing-right">
      <div className="landing-header">
         <img className="signup-img" src="src/assets/logo.png" alt="roses & thorns logo" />
         <h1>Create your account</h1>
         <p>Start sharing your roses and thorns with the community.</p>
      </div>

      <form className="landing-form">
         <input type="email" placeholder="Email" />
         <input type="text" placeholder="Username" />
         <input type="password" placeholder="Password" />
         <button type="submit">Sign Up</button>
      </form>

      <p className="signup-text">
         Already have an account? <Link to="/">Log In</Link>
      </p>
      </div>
   </div>
  )
}

export default SignUp