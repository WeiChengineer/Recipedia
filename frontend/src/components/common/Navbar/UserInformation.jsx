import { useEffect, useRef, useState } from "react";
import "./userInfo.css";
import { Link } from "react-router-dom";

const UserInformation = ({ cookies, removeCookie }) => {
  const [user, setUser] = useState(null);
  const [menuActive, setMenuActive] = useState(false);
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setMenuActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/api/users/${cookies.auth.userId}`
      );
      const data = await response.json();
      if (data.status === 200) {
        console.log("data is ", data);
        setUser(data.data[0]);
        console.log(data.data[0].image);
      } else {
        console.log("Error fetching user data");
      }
    } catch (err) {
      console.log("error: " + err);
    }
  };

  const handleLogout = () => {
    removeCookie("auth");
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      {user && (
        <>
          <div className="profile" onClick={toggleMenu} ref={profileRef}>
            <div className="img-box">
              <img src={user.image} alt="User" />
            </div>
            {menuActive && (
              <div className="menu active">
                <ul>
                  <li>
                    <Link
                      to="/auth/updateUser"
                      className="btn btn-primary"
                      onClick={removeCookie}
                    >
                      Update Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      to="#"
                      onClick={handleLogout}
                      className="btn btn-primary"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default UserInformation;
