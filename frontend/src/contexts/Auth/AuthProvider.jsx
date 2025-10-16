import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../../services/api";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const refresh = async () => {
    try {
      const { data } = await api.get("/auth/current");
      setUser(data.user || data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
