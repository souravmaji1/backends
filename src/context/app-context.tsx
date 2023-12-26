import { client } from "@/app/client";
import axios from "axios";
import React, { useState, createContext, useContext, useEffect } from "react";
import { useCookies } from "react-cookie";

interface AppContextType {
  isEnter: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  user: any;
  updateUser: (user: any) => void;
  settings: any
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.log("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isEnter, setIsEnter] = useState<boolean>(false);
  const [cookie] = useCookies(["token"]);

  const [settings, setSettings] = useState(null)
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!settings)
      getSettings()

    if (!user)
      getUser()
  }, [])

  const getSettings = async () => {
    const res = await client.get('settings', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })
    setSettings(res.data.body)
  }

  const getUser = async () => {
    const res = await client.get('/user/me', {
      headers: {
        Authorization: `Bearer ${cookie.token}`,
      },
    })

    updateUser(res.data.body)
  }

  const updateUser = (user: any) => {
    setUser(user);
  };

  // handle mouse enter
  const handleMouseEnter = () => {
    setIsEnter(true);
  };
  // handle leave
  const handleMouseLeave = () => {
    setIsEnter(false);
  };

  const values = {
    isEnter,
    handleMouseEnter,
    handleMouseLeave,
    user,
    settings,
    updateUser,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default ContextProvider;
