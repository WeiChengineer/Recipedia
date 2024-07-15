import { useEffect, useState } from "react";
import "./userInfo.css";

const UserInformation = ({ cookies, removeCookie }) => {
  const [user, setUser] = useState(null); // useState at the top level

  const getUserInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${cookies.auth.userid}`);
      const data = await response.json();
      if (data.status === 200) {
        setUser(data.data[0]);
        console.log(data.data[0].image);

      } else {
        console.log("Error fetching user data");
      }
    } catch (err) {
      console.log("error: " + err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []); 

  return (
    <>
      {user && <> 
       <img className="userImage" src={user.image} alt="User" />
      </>
       }
    </>
  );
};

export default UserInformation;