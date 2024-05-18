import { bottombarLinks } from "@/constants"

import { Link,  useLocation } from "react-router-dom"


export default function BottomBar() {
  const {pathname} = useLocation()
  return (
    <section  className="bottom-bar">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route
        return (
  
          <Link to={link.route} className={` hover:bg-primary-500 rounded-xl ${isActive && 'bg-primary-500 rounded-xl'} group flex-center flex-col gap-1 p-2 transition`} key={link.label}>{
              <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`}  width={16} height={16}/>
          }
            <p className="tiny-medium ">
              {link.label}
            </p>

            </Link>

        )
      })}
    </section>
  )
}
