import { createContext, useContext } from "react";

/**
 * Authentication Context for Front Section
 * Provides user authentication state, user data, and login/registration URLs
 * Exposes data from WordPress wpApiSettings localization
 */
const AuthContext = createContext();

/**
 * AuthProvider component
 * Wraps the app and provides authentication context with WordPress integration.
 * Extracts auth data from wpApiSettings and makes it available to all children.
 *
 * @param {ReactNode} children - Child components that will have access to auth context
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
 * Throws an error if used outside of AuthProvider to ensure proper setup.
 *
 * @returns {Object} Authentication state and utilities:
 * { isLoggedIn, currentUser, loginUrl, registerUrl }
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
