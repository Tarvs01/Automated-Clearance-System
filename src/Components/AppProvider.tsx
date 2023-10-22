import React from "react";
import { createContext } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { ContextItems, UserProfile, ResponseMessage } from "./types";

const AppContext = createContext<ContextItems | null>(null);

function AppProvider({ children }: any) {
  const [isSignIn, setIsSignIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    image: "",
  });

  function setUserData(data: ResponseMessage) {
    let user: UserProfile = {
      _id: data._id,
      firstName: data.name.split(" ")[0] || "----",
      lastName: data.name.split(" ")[1] || "----",
      email: data.email,
      image: data.image,
    };
    console.log(user);

    if (localStorage) {
      localStorage.setItem("foodcate", user._id);
    }
    setUserProfile(user);
  }

  function getAndSetUserProfile() {
    let id: string | null = localStorage.getItem("foodcate");
    if (id !== null) {
      axios
        .get("https://foodcate-api.onrender.com/api/users/" + id)
        .then((response) => {
          setUserData(response.data.message);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  /* useEffect(() => {
    getAndSetUserProfile();
  }, []); */

  return (
    <AppContext.Provider
      value={{
        isSignIn,
        setIsSignIn,
        currentPage,
        setCurrentPage,
        isLoggedIn,
        setIsLoggedIn,
        userProfile,
        setUserProfile,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
