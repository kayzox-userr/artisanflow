export default function Home() {
  return (
    <main
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#333" }}>👋 Hello ArtisansFlow</h1>
      <p style={{ fontSize: "1.2rem", color: "#555", marginTop: "1rem" }}>
        Bienvenue sur ta première application web Next.js
      </p>
    </main>
  );
}
