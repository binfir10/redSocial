import { Navigate, Outlet } from "react-router-dom";


function AuthLayout() {
  const isAuth = false;
  return (
    <>
      {isAuth ? <Navigate to="/" />
        :
        <>
          <section className="flex flex-col flex-1 justify-center items-center">
            <Outlet />
          </section>
          <img src="/assets/images/side-img.svg" alt="" className="hidden md:block h-screen w-1/2 object-cover bg-no-repeat"/>
        </>
      }
      
    
    </>
  )
}

export default AuthLayout
