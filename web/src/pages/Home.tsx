export default function Home() {
  return (
    <>
      <h2>Public Home</h2>

      <a
        href={`${import.meta.env.VITE_API_URL}/auth/login`}
        style={{
          padding: "10px 16px",
          background: "#333",
          color: "white",
          borderRadius: 6,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Login with MindX
      </a>
    </>
  );
}
