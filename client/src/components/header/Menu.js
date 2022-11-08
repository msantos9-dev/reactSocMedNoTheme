import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authAction";
import { GLOBALTYPES } from "../../redux/actions/globalTypes";
import Avatar from "../Avatar";
import NotifyModal from "../NotifyModal";

const Menu = () => {
  
  const navLinks = [
    { label: "Home", icon: "home-sharp", path: "/" },
    { label: "Message", icon: "chatbubble-ellipses", path: "/message" },
    { label: "Discover", icon: "planet", path: "/discover" },
  ];

  const { auth, notify } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  
  const getUnread = () => {
    const newArr = notify.data.filter(item => item.isRead === false)
    return newArr.length;
}


  const isActive = (pn) => {
    if (pn === pathname) return "active";
  };

  return (
    <div className="menu mt-2">
      
      <ul className="navbar-nav flex-row">
        {navLinks.map((link, index) => (
          <li className={`nav-item px-2 ${isActive(link.path)} `} key={index}>
            <Link className="nav-link" to={link.path}>
             <span className="material-icons"
             style={{ color: `${isActive(link.path)? "#3c68b1 ":"gray"}` }}><ion-icon name={`${link.icon}`}></ion-icon></span>
            </Link>
          </li>
        ))}

                <li className="nav-item dropdown" style={{ opacity: 1 }} >
                    <span className="nav-link position-relative" id="navbarDropdown"
                        role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                       {/*  <span className="material-symbols-outlined text-primary"
                            style={{ color: notify.data.length > 0 ? 'primary' : '' }}>
                            notifications
                        </span> */}
                        <span className="material-icons">
                          <ion-icon name="notifications" style={{  color: getUnread() > 0 ? '#3c68b1' : 'gray' }}></ion-icon>
                        </span>
                        {getUnread() > 0 &&
                        <span className="notify_length badge badge-pill" style={{ outlineColor:"#3c68b1", outlineStyle: "solid", outlineWidth: "1px", backgroundColor: "white", color: "#3c68b1"}}>
                            {getUnread()}
                        </span>
                        }

          </span>
          
          <div
            className="dropdown-menu"
            aria-labelledby="navbarDropdown"
            style={{ transform: "translateX(75px)" }}
          >
            <NotifyModal />
          </div>
        </li>

        <li className="nav-item dropdown" style={{ opacity: 1 }}>
          <span
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <Avatar src={auth.user.avatar} size="medium-avatar" />
          </span>

          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>
            <span ><ion-icon  name="person-outline"></ion-icon> Profile</span>  : <span><ion-icon name="person-outline"></ion-icon> Profile</span>
            </Link>

            <label
              htmlFor=""
              className="dropdown-item"
              
            >
              <span ><ion-icon  name="sunny-outline"></ion-icon> Light Mode
              </span>  : 
              <span><ion-icon name="moon-outline"></ion-icon> 
             Dark Mode</span>
            </label>

            <div className="dropdown-divider"></div>
            <Link
              className="dropdown-item"
              to="/"
              onClick={() => dispatch(logout())}
            >
              <span ><ion-icon  name="exit-outline"></ion-icon> Sign-out</span> 
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
