import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel Admin — Cardápio SaaS" },
      { name: "description", content: "Painel do super-administrador: gestão de lojas, assinaturas e pagamentos." },
      { property: "og:title", content: "Painel Admin" },
      { property: "og:description", content: "Gestão das lojas do SaaS." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPanel,
});

type Store = {
  id: string;
  owner_user_id: string;
  name: string;
  phone: string | null;
  active: boolean;
  subscription_status: "trial" | "active" | "past_due" | "suspended" | "cancelled";
  trial_ends_at: string;
  current_period_end: string | null;
  monthly_price_cents: number;
  created_at: string;
  notes: string | null;
};

const statusLabel: Record<Store["subscription_status"], string> = {
  trial: "Trial",
  active: "Ativa",
  past_due: "Atrasada",
  suspended: "Suspensa",
  cancelled: "Cancelada",
};

const statusColor: Record<Store["subscription_status"], string> = {
  trial: "#3b82f6",
  active: "#10b981",
  past_due: "#f59e0b",
  suspended: "#ef4444",
  cancelled: "#6b7280",
};

function AdminPanel() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Store["subscription_status"]>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: userData }) => {
      if (!userData.user) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      const admin = roles?.some((r) => r.role === "super_admin") ?? false;
      setIsAdmin(admin);
    });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setStores(data as Store[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function updateStore(id: string, patch: Partial<Store>) {
    const { error } = await supabase.from("stores").update(patch).eq("id", id);
    if (error) {
      alert("Erro ao atualizar: " + error.message);
      return;
    }
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function extendTrial(id: string, days: number) {
    const store = stores.find((s) => s.id === id);
    if (!store) return;
    const base = new Date(store.trial_ends_at);
    if (base < new Date()) base.setTime(Date.now());
    base.setDate(base.getDate() + days);
    await updateStore(id, { trial_ends_at: base.toISOString(), subscription_status: "trial" });
  }

  async function activateSubscription(id: string, months: number) {
    const end = new Date();
    end.setMonth(end.getMonth() + months);
    await updateStore(id, {
      subscription_status: "active",
      current_period_end: end.toISOString(),
      active: true,
    });
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (isAdmin === null) {
    return <div style={centerBox}>Verificando permissões…</div>;
  }
  if (isAdmin === false) {
    return (
      <div style={{ ...centerBox, flexDirection: "column", gap: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>Acesso restrito</div>
        <div style={{ color: "#888" }}>Este painel é apenas para super-administradores.</div>
        <Link to="/app" style={{ padding: "10px 20px", background: "#FFC107", color: "#000", borderRadius: 8, textDecoration: "none", fontWeight: 700 }}>
          Ir para meu cardápio
        </Link>
      </div>
    );
  }

  const filtered = stores.filter((s) => {
    if (filter !== "all" && s.subscription_status !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: stores.length,
    active: stores.filter((s) => s.subscription_status === "active").length,
    trial: stores.filter((s) => s.subscription_status === "trial").length,
    suspended: stores.filter((s) => s.subscription_status === "suspended" || !s.active).length,
    mrr: stores.filter((s) => s.subscription_status === "active").reduce((a, s) => a + s.monthly_price_cents, 0) / 100,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", padding: "20px 16px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ color: "#FFC107", fontWeight: 800, fontSize: 12, letterSpacing: 2 }}>SUPER-ADMIN</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Painel de Lojas</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={load} style={btnGhost}>Atualizar</button>
            <button onClick={signOut} style={btnGhost}>Sair</button>
          </div>
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
          <StatCard label="Total de lojas" value={stats.total} />
          <StatCard label="Ativas" value={stats.active} color="#10b981" />
          <StatCard label="Em trial" value={stats.trial} color="#3b82f6" />
          <StatCard label="Suspensas" value={stats.suspended} color="#ef4444" />
          <StatCard label="MRR (R$)" value={stats.mrr.toFixed(2)} color="#FFC107" />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            placeholder="Buscar por nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputBase, flex: "1 1 220px" }}
          />
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} style={{ ...inputBase, minWidth: 160 }}>
            <option value="all">Todos os status</option>
            <option value="trial">Trial</option>
            <option value="active">Ativa</option>
            <option value="past_due">Atrasada</option>
            <option value="suspended">Suspensa</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Carregando lojas…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#888", background: "#111", borderRadius: 12 }}>
            Nenhuma loja encontrada.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((s) => (
              <StoreCard key={s.id} store={s} onUpdate={updateStore} onExtendTrial={extendTrial} onActivate={activateSubscription} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StoreCard({
  store,
  onUpdate,
  onExtendTrial,
  onActivate,
}: {
  store: Store;
  onUpdate: (id: string, patch: Partial<Store>) => void;
  onExtendTrial: (id: string, days: number) => void;
  onActivate: (id: string, months: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const trialEnd = new Date(store.trial_ends_at);
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / 86400000);

  return (
    <div style={{ background: "#111", border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{store.name}</div>
          <div style={{ fontSize: 12, color: "#888" }}>
            Criada em {new Date(store.created_at).toLocaleDateString("pt-BR")}
            {store.subscription_status === "trial" && ` · Trial ${daysLeft >= 0 ? `termina em ${daysLeft}d` : `vencido há ${-daysLeft}d`}`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ background: statusColor[store.subscription_status], color: "#000", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
            {statusLabel[store.subscription_status]}
          </span>
          {!store.active && <span style={{ background: "#7c2d12", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>Inativa</span>}
          <button onClick={() => setOpen(!open)} style={btnGhost}>{open ? "Fechar" : "Gerenciar"}</button>
        </div>
      </div>

      {open && (
        <div style={{ padding: 16, borderTop: "1px solid #222", background: "#0a0a0a", display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => onExtendTrial(store.id, 7)} style={btnPrimary}>+7 dias trial</button>
            <button onClick={() => onExtendTrial(store.id, 30)} style={btnPrimary}>+30 dias trial</button>
            <button onClick={() => onActivate(store.id, 1)} style={btnGreen}>Ativar 1 mês</button>
            <button onClick={() => onActivate(store.id, 12)} style={btnGreen}>Ativar 1 ano</button>
            <button
              onClick={() => onUpdate(store.id, { subscription_status: "suspended", active: false })}
              style={btnRed}
            >
              Suspender
            </button>
            <button
              onClick={() => onUpdate(store.id, { active: true, subscription_status: store.subscription_status === "suspended" ? "trial" : store.subscription_status })}
              style={btnGhost}
            >
              Reativar acesso
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, fontSize: 13 }}>
            <Field label="Nome da loja">
              <input defaultValue={store.name} onBlur={(e) => e.target.value !== store.name && onUpdate(store.id, { name: e.target.value })} style={inputBase} />
            </Field>
            <Field label="Mensalidade (centavos)">
              <input type="number" defaultValue={store.monthly_price_cents} onBlur={(e) => onUpdate(store.id, { monthly_price_cents: Number(e.target.value) })} style={inputBase} />
            </Field>
            <Field label="Trial expira em">
              <div style={{ color: "#ccc" }}>{new Date(store.trial_ends_at).toLocaleString("pt-BR")}</div>
            </Field>
            <Field label="Período pago até">
              <div style={{ color: "#ccc" }}>{store.current_period_end ? new Date(store.current_period_end).toLocaleString("pt-BR") : "—"}</div>
            </Field>
          </div>
          <Field label="Anotações internas">
            <textarea defaultValue={store.notes ?? ""} onBlur={(e) => e.target.value !== (store.notes ?? "") && onUpdate(store.id, { notes: e.target.value })} rows={2} style={{ ...inputBase, resize: "vertical" }} />
          </Field>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div style={{ background: "#111", padding: 14, borderRadius: 10, border: "1px solid #222" }}>
      <div style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color ?? "#fff", marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
      {children}
    </label>
  );
}

const centerBox: React.CSSProperties = { minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0a", color: "#fff", padding: 20 };
const inputBase: React.CSSProperties = { padding: "10px 12px", background: "#0a0a0a", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", width: "100%" };
const btnBase: React.CSSProperties = { padding: "8px 14px", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" };
const btnPrimary: React.CSSProperties = { ...btnBase, background: "#3b82f6", color: "#fff" };
const btnGreen: React.CSSProperties = { ...btnBase, background: "#10b981", color: "#000" };
const btnRed: React.CSSProperties = { ...btnBase, background: "#ef4444", color: "#fff" };
const btnGhost: React.CSSProperties = { ...btnBase, background: "transparent", color: "#fff", border: "1px solid #333" };
