import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  name: string;
  email?: string;
  exp: number;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("token");

    if (incoming) {
      const decoded = jwtDecode<User>(incoming);

      localStorage.setItem("token", incoming);
      setToken(incoming);      
      setUser(decoded);      
      window.history.replaceState({}, "", "/dashboard");
      setIsLoading(false);
      return;
    }

    const saved = localStorage.getItem("token");
    if (saved) {
      try {
        const decoded = jwtDecode<User>(saved);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setToken(saved);
          setUser(decoded);
        }
      } catch {
        localStorage.removeItem("token");
      }
    }

    setIsLoading(false);
  }, []);


  function login() {
    // Redirect to backend OpenID login
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    // open MindX logout in a new tab instead of redirect
    window.open("https://id-dev.mindx.edu.vn/session/end", "_blank");

    // stay in your app
    window.location.href = "/";
  }




  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
