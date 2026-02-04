import { useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { logout } = useAuth();
  const [msg, setMsg] = useState("");

  async function testApi() {
    const res = await apiFetch("/protected");
    setMsg(res.message);
  }

  return (
    <>
      <h2>Dashboard</h2>
      <button onClick={testApi}>Test API</button>
      <button onClick={logout}>Logout</button>
      <p>{msg}</p>
    </>
  );
}
