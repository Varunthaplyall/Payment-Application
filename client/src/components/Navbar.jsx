import React from "react";
import {
  Menu,
  X,
  Home,
  CreditCard,
  History,
  Settings,
  LogIn,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isAuthenticated, logout }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate("");

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashbord" },
    { icon: CreditCard, label: "Payments", href: "/payment" },
    { icon: History, label: "History", href: "/viewTransactions" },
    // { icon: Settings, label: 'Settings', href: '/settings' },
  ];
  return (
    <nav className="bg-white text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-blue-400">
            MyApp
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center text-black hover:text-blue-500 transition-colors"
                  >
                    {item.icon && (
                      <item.icon className="w-5 h-5 mr-2 hover:shadow-md" />
                    )}
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Log In
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 hover:text-white"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-2">
            {isAuthenticated ? (
              <>
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded-md"
                  >
                    <item.icon className="w-5 h-5 mr-2" />
                    {item.label}
                  </Link>
                ))}

                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <Link
                className="w-full flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                to="/login"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
