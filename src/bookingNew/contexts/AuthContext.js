import { createContext, useContext } from "react";

/**
 * Authentication Context for Front Section
 * Provides user authentication state and utilities
 */
const AuthContext = createContext();

/**
 * AuthProvider component
 * Wraps the app and provides authentication context
 */
export const AuthProvider = ({ children }) => {
  // Get authentication data from WordPress localization
  const authData = window.wpApiSettings || {};

  const value = {
    isLoggedIn: authData.isLoggedIn || false,
    currentUser: authData.currentUser || {
      id: 0,
      name: "",
      email: "",
    },
    loginUrl: authData.loginUrl || "/wp-login.php",
    registerUrl: authData.registerUrl || "/wp-login.php?action=register",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use authentication context
 * @returns {Object} Authentication state and utilities
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
