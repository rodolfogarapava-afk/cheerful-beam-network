import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Cardápio SaaS" },
      { name: "description", content: "Acesse sua loja no Cardápio SaaS ou crie a sua em segundos." },
      { property: "og:title", content: "Entrar — Cardápio SaaS" },
      { property: "og:description", content: "Acesse ou crie sua conta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { store_name: storeName || "Minha Loja" },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setNotice("Conta criada! Verifique seu e-mail para confirmar o cadastro e depois faça login.");
          setMode("login");
        } else {
          navigate({ to: "/", replace: true });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/", replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      const traduzido =
        msg.includes("Invalid login credentials") ? "E-mail ou senha inválidos" :
        msg.includes("already registered") || msg.includes("User already") ? "E-mail já cadastrado. Faça login." :
        msg.includes("Password should be at least") ? "A senha precisa ter no mínimo 6 caracteres" :
        msg;
      setError(traduzido);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#111", padding: 32, borderRadius: 16, border: "1px solid #222", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Link to="/" style={{ color: "#FFC107", fontWeight: 800, letterSpacing: 1, textDecoration: "none", fontSize: 14 }}>← CARDÁPIO SAAS</Link>
        </div>
        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 6, textAlign: "center" }}>
          {mode === "login" ? "Entrar na sua loja" : "Criar minha loja"}
        </h1>
        <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 24 }}>
          {mode === "login" ? "Acesse seu painel" : "Grátis por 7 dias, sem cartão"}
        </p>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {mode === "signup" && (
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>Nome da loja</span>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ex: Bar do Zé"
                required
                style={inputStyle}
              />
            </label>
          )}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
              autoComplete="email"
              style={inputStyle}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ color: "#ccc", fontSize: 13, fontWeight: 600 }}>Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={inputStyle}
            />
          </label>

          {error && <div style={{ background: "#3a1010", color: "#ffb0b0", padding: 10, borderRadius: 8, fontSize: 13 }}>{error}</div>}
          {notice && <div style={{ background: "#0f2f1a", color: "#a8f0c8", padding: 10, borderRadius: 8, fontSize: 13 }}>{notice}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "14px", background: "#FFC107", color: "#000", border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer", marginTop: 6 }}
          >
            {loading ? "Aguarde…" : mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setNotice(null); }}
          style={{ marginTop: 18, width: "100%", background: "transparent", color: "#FFC107", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >
          {mode === "login" ? "Não tem conta? Criar loja grátis" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: "#0a0a0a",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  color: "#fff",
  fontSize: 16,
  outline: "none",
};
