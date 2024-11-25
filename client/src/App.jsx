import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("useId");
    setIsAuthenticated(false);
    navigate("/");
    toast.success("Logout successfully");
  };

  const handleLogin = (userId) => {
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-blue-100 to-blue-50">
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>

      <Navbar isAuthenticated={isAuthenticated} logout={logout} />

      <div>
        {" "}
        <AppRoutes handleLogin={handleLogin} />{" "}
      </div>
    </div>
  );
};

export default App;
