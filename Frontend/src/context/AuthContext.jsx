import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'; // Import axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken && storedToken !== "undefined") {
          setToken(storedToken);
          setIsAuthenticated(true);
          const config = {
            headers: {
              'x-auth-token': storedToken,
            },
          };
          const res = await axios.get('http://localhost:5000/api/auth/me', config);
          setUser(res.data);
        } else {
          setIsAuthenticated(false);
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing authentication or fetching user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const login = (userData, newToken) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    toast.success(`Welcome ${userData.name}!`);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.info("You have logged out!");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
