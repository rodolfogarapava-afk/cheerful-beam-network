import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cardápio SaaS — Sistema para restaurantes e espetinhos" },
      { name: "description", content: "Sistema completo de cardápio digital, comandas, caixa e estoque para o seu restaurante ou barzinho." },
      { property: "og:title", content: "Cardápio SaaS — Sistema para restaurantes" },
      { property: "og:description", content: "Cardápio digital, comandas e controle de caixa em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  ssr: false,
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        // Route super-admins to /admin, owners to /app
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .then(({ data: roles }) => {
            const isAdmin = roles?.some((r) => r.role === "super_admin");
            navigate({ to: isAdmin ? "/admin" : "/app", replace: true });
          });
      } else {
        setChecking(false);
      }
    });
  }, [navigate]);

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0a", color: "#fff" }}>
        Carregando…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", color: "#fff", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: 1, color: "#FFC107" }}>CARDÁPIO SAAS</div>
        <Link to="/auth" style={{ padding: "10px 20px", background: "#FFC107", color: "#000", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
          Entrar
        </Link>
      </header>

      <main style={{ flex: 1, display: "grid", placeItems: "center", padding: "48px 24px" }}>
        <div style={{ maxWidth: 720, textAlign: "center" }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            Seu restaurante <span style={{ color: "#FFC107" }}>organizado</span> do cardápio à impressão da comanda.
          </h1>
          <p style={{ fontSize: 18, color: "#bbb", marginBottom: 32, lineHeight: 1.5 }}>
            Cardápio digital, comandas por mesa, estoque, caixa e relatórios — tudo em uma tela. Sem instalação, funciona no celular e no PC.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/auth" style={{ padding: "14px 28px", background: "#FFC107", color: "#000", borderRadius: 10, textDecoration: "none", fontWeight: 800, fontSize: 16 }}>
              Criar minha loja grátis (7 dias)
            </Link>
            <Link to="/auth" style={{ padding: "14px 28px", background: "transparent", color: "#fff", border: "2px solid #333", borderRadius: 10, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>
              Já tenho conta
            </Link>
          </div>

          <div style={{ marginTop: 64, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, textAlign: "left" }}>
            {[
              { t: "Comandas por mesa", d: "Abra, edite e feche comandas. Impressão automática para cozinha." },
              { t: "Estoque integrado", d: "Baixa automática na venda e retorno em cancelamentos." },
              { t: "Caixa e relatórios", d: "Fechamento diário, mensal ou personalizado. Vendas por forma de pagamento." },
            ].map((f) => (
              <div key={f.t} style={{ background: "#111", padding: 20, borderRadius: 12, border: "1px solid #222" }}>
                <div style={{ fontWeight: 800, marginBottom: 6, color: "#FFC107" }}>{f.t}</div>
                <div style={{ fontSize: 14, color: "#aaa" }}>{f.d}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer style={{ padding: 20, textAlign: "center", color: "#666", fontSize: 13, borderTop: "1px solid #1a1a1a" }}>
        © {new Date().getFullYear()} Cardápio SaaS
      </footer>
    </div>
  );
}
