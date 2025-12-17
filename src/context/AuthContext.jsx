import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Available roles
export const ROLES = {
  SUPERADMIN: 'Superadmin',
  ADMIN: 'Admin',
  STAFF: 'Staff',
  USER: 'User',
};

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  [ROLES.SUPERADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.STAFF]: 2,
  [ROLES.USER]: 1,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - in real app, this would be an API call
    // For demo purposes, assign role based on email
    let role = ROLES.USER;
    if (email.includes('superadmin') || email.includes('admin@')) {
      role = ROLES.SUPERADMIN;
    } else if (email.includes('admin')) {
      role = ROLES.ADMIN;
    } else if (email.includes('staff')) {
      role = ROLES.STAFF;
    }

    const mockUser = {
      id: 1,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: email,
      role: role,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const signup = (name, email, password) => {
    // Mock signup - new users default to USER role
    const mockUser = {
      id: Date.now(),
      name: name,
      email: email,
      role: ROLES.USER,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Check if user has required role or higher
  const hasRole = (requiredRole) => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  };

  // Check if user has exact role
  const hasExactRole = (role) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loading,
      hasRole,
      hasExactRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
