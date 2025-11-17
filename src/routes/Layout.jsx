import { Outlet } from "react-router"

function Layout() {
   return (
      <div>
         <header>
            <h1>Roses & Thorns</h1>
            <nav>
               {/* Profile, sign up, or log in */}
            </nav>
         </header>
         <main>
            <Outlet />
         </main>
      </div>
   )
}

export default Layout