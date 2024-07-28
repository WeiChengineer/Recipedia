import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

export const AuthStateWrapper = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [loggedInUser, setLoggedInUser] = useState(undefined);
  const isUserLoggedIn = Boolean(loggedInUser);

  console.log(
    "ISLOGGEDIN",
    cookies?.auth,
    cookies?.auth?.userId,
    isUserLoggedIn
  );

  // console.log(
  //   "USE EFFECT ======= ",
  //   loggedInUser,
  //   cookies.auth && cookies.auth.userId ? cookies.auth : undefined
  // );
  useEffect(() => {
    setLoggedInUser(
      cookies.auth && cookies.auth.userId ? cookies.auth : undefined
    );
  }, [cookies]);

  const checkIsSameUser = (userId) => {
    console.log("There comes user");
    if (isUserLoggedIn) {
      return loggedInUser.userId === userId;
    } else {
      return false;
    }
  };

  const handleUserLogin = (userData) => {
    setCookie("auth", userData, { maxAge: 7 * 24 * 60 * 60 * 1000 });
  };

  const handleUserLogout = () => {
    removeCookie("auth");
  };

  let auth = {
    isUserLoggedIn,
    handleUserLogin,
    handleUserLogout,
    checkIsSameUser,
    loggedInUser,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export const useAuthContext = () => {
  return useContext(AuthContext);
};
