import React from "react";
import { createContext } from "react";
import { useState } from "react";
import { ContextDetails } from "./types";

const AppContext = createContext<ContextDetails | null>(null);

function AppProvider({ children }: any) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
