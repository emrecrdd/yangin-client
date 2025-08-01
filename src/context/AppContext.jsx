// context/AppContext.jsx

import { createContext, useState, useEffect } from "react";

// Mock kullanıcı (backend bağlanınca burası değişir)
const mockUser = {
  name: "Emre CRD",
  avatar: "/user-avatar.png", // public klasörüne bir avatar atabilirsin
};

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [alerts, setAlerts] = useState([]); // aktif uyarılar
  const [isLoggedIn, setIsLoggedIn] = useState(true); // dev aşaması için true

  useEffect(() => {
    // Mock login – gerçek login olunca değişecek
    if (isLoggedIn) {
      setUser(mockUser);
    }
  }, [isLoggedIn]);

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // Gerçek uygulamada token silinir ve login ekranına yönlendirilir
    window.location.href = "/login";
  };

  return (
    <AppContext.Provider value={{ user, logout, alerts, setAlerts }}>
      {children}
    </AppContext.Provider>
  );
};
