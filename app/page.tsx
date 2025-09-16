export default function Page() {
  return (
    <main style={{maxWidth:720,margin:"24px auto",padding:"0 16px",fontFamily:"system-ui, sans-serif"}}>
      <h1>AuthGrow — Lite Publisher</h1>
      <ol>
        <li><a href="/api/auth/ig/start">Connect Instagram</a></li>
        <li>Then open <a href="/publish">/publish</a> to post now or schedule.</li>
      </ol>
      <p style={{color:"#666",fontSize:12}}>Instagram Login (no Facebook Page). Secrets live in Vercel env vars only.</p>
    </main>
  );
}
