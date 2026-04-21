const env = process.env.NEXT_PUBLIC_ENV ?? "local";
const isProd = env === "prod";

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      {!isProd && (
        <div
          style={{
            background: "#fbbf24",
            color: "#000",
            padding: "0.5rem 1rem",
            marginBottom: "1rem",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Entorno: {env.toUpperCase()}
        </div>
      )}
      <h1>Bacheo Gran Mendoza</h1>
      <p>Scaffold inicial. Pronto vas a poder reportar un bache.</p>
    </main>
  );
}
