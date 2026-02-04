import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginSuccess() {
  const nav = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      nav("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, nav]);

  return <p>Finishing login…</p>;
}
