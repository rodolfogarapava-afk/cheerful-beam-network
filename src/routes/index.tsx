import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  Info,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { sendOrderTicketToPrinter, type OrderChange } from "@/lib/printReceipt";
import { initAudioContext, playNotificationSound } from "@/lib/sounds";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Deus Proveu Espetinhos — Cardápio digital" },
      { name: "description", content: "Cardápio digital da Deus Proveu Espetinhos. Monte seu pedido e envie para cozinha." },
      { property: "og:title", content: "Deus Proveu Espetinhos — Cardápio digital" },
      { property: "og:description", content: "Cardápio digital da Deus Proveu Espetinhos. Monte seu pedido e envie para cozinha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type Product = {
  id: number;
  category: string;
  name: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
  stock?: number;
  minStock?: number;
  trackStock?: boolean;
};

const stockFallbackImages: Record<string, string> = {
  Espetinhos: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=82",
  Acompanhamentos: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=82",
  Bebidas: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=82",
};

function ProductImage({ product, className = "" }: { product: Product; className?: string }) {
  const fallback = stockFallbackImages[product.category] || stockFallbackImages.Entradas;
  return (
    <img
      className={className}
      src={product.image?.trim() || fallback}
      alt={product.name}
      loading="eager"
      decoding="async"
      fetchPriority="high"
      width={600}
      height={600}
      onError={(event) => {
        const image = event.currentTarget;
        if (image.src !== fallback) image.src = fallback;
      }}
    />
  );
}

const initialProducts: Product[] = [
  { id: 9, category: "Espetinhos", name: "Carne", price: 10, image: "/products/generated/espeto-carne.webp", description: "Espetinho de carne preparado na brasa e servido no ponto escolhido.", stock: 30, minStock: 8, trackStock: true },
  { id: 12, category: "Espetinhos", name: "Linguiça", price: 10, image: "/products/generated/espeto-linguica.webp", description: "Espetinho de linguiça assada na brasa, dourada e suculenta.", stock: 30, minStock: 8, trackStock: true },
  { id: 11, category: "Espetinhos", name: "Frango com Bacon", price: 12, image: "/products/generated/espeto-frango-bacon.webp", description: "Cubos de frango com bacon, grelhados até ficarem dourados e suculentos.", stock: 30, minStock: 8, trackStock: true },
  { id: 10, category: "Espetinhos", name: "Carne com Bacon", price: 14, tag: "DESTAQUE", image: "/products/generated/espeto-carne-bacon.webp", description: "Espetinho de carne intercalada com bacon, assado na brasa.", stock: 30, minStock: 8, trackStock: true },

  { id: 20, category: "Acompanhamentos", name: "Farofa", price: 3, image: "", description: "Farofa crocante da casa.", stock: 40, minStock: 10, trackStock: true },
  { id: 21, category: "Acompanhamentos", name: "Molho Verde", price: 3, image: "", description: "Molho verde fresco da casa.", stock: 40, minStock: 10, trackStock: true },
  { id: 22, category: "Acompanhamentos", name: "Vinagrete", price: 5, image: "", description: "Vinagrete tradicional bem temperado.", stock: 40, minStock: 10, trackStock: true },
  { id: 23, category: "Acompanhamentos", name: "Arroz", price: 5, image: "", description: "Porção de arroz soltinho.", stock: 40, minStock: 10, trackStock: true },

  { id: 14, category: "Bebidas", name: "Água s/ Gás", price: 3, image: "/products/generated/agua-sem-gas.webp", description: "Água mineral sem gás, gelada.", stock: 30, minStock: 8, trackStock: true },
  { id: 13, category: "Bebidas", name: "Água c/ Gás", price: 4, image: "/products/generated/agua-com-gas.webp", description: "Água mineral com gás, gelada.", stock: 30, minStock: 8, trackStock: true },
  { id: 18, category: "Bebidas", name: "Fanta Lata", price: 6, image: "/products/generated/fanta-lata.webp", description: "Refrigerante Fanta em lata, servido gelado.", stock: 30, minStock: 8, trackStock: true },
  { id: 19, category: "Bebidas", name: "Guaraná Lata", price: 6, image: "/products/generated/guarana-lata.webp", description: "Refrigerante Guaraná em lata, servido gelado.", stock: 30, minStock: 8, trackStock: true },
  { id: 17, category: "Bebidas", name: "Coca Cola Lata", price: 6, image: "/products/generated/coca-cola-lata.webp", description: "Refrigerante Coca-Cola em lata, servido gelado.", stock: 30, minStock: 8, trackStock: true },
  { id: 16, category: "Bebidas", name: "Coca Cola 1L", price: 10, image: "/products/generated/coca-cola-1l.webp", description: "Refrigerante Coca-Cola 1 litro, servido gelado.", stock: 20, minStock: 5, trackStock: true },
  { id: 15, category: "Bebidas", name: "Coca Cola 1,5L", price: 12, image: "/products/generated/coca-cola-15l.webp", description: "Refrigerante Coca-Cola 1,5 litro, servido gelado.", stock: 20, minStock: 5, trackStock: true },
];

const nav = [
  { label: "Espetinhos", icon: Utensils },
  { label: "Acompanhamentos", icon: ShoppingBag },
  { label: "Bebidas", icon: Wine },
];

function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<string[]>(nav.map((item) => item.label));
  const [activeMain, setActiveMain] = useState("Espetinhos");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [modal, setModal] = useState<"waiter" | "review" | "cart" | "about" | "doneness" | "success" | null>(null);
  const [pendingMeatId, setPendingMeatId] = useState<number | null>(null);
  const [doneness, setDoneness] = useState("");
  const [meatNote, setMeatNote] = useState("");
  const [cartDetails, setCartDetails] = useState<Record<number, { doneness: string; note: string }>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [sent, setSent] = useState(false);
  const [customerName, setCustomerName] = useState("Mesa 35");
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    initAudioContext();
    const menuVersionKey = "deus-proveu-v1-menu";
    const menuDone = window.localStorage.getItem(menuVersionKey);
    const saved = window.localStorage.getItem("deus-proveu-products");
    if (!menuDone) {
      setProducts(initialProducts);
      window.localStorage.setItem("deus-proveu-products", JSON.stringify(initialProducts));
      window.localStorage.setItem(menuVersionKey, "1");
    } else if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch {}
    } else {
      setProducts(initialProducts);
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem("deus-proveu-products", JSON.stringify(products));
  }, [products, storageReady]);

  const persistProducts = (next: Product[]) => {
    setProducts(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("deus-proveu-products", JSON.stringify(next));
    }
  };

  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((item) => item.id === Number(id));
    return sum + (product?.price ?? 0) * qty;
  }, 0);

  const filtered = useMemo(
    () =>
      products.filter(
        (product) =>
          product.category === activeMain &&
          product.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, activeMain, products],
  );

  const currentCartItems = Object.entries(cart).flatMap(([id, qty]) => {
    const product = products.find((item) => item.id === Number(id));
    if (!product) return [];
    const detail = cartDetails[Number(id)];
    return [
      {
        name: product.name,
        qty,
        price: product.price,
        detail: detail
          ? [detail.doneness && `Ponto: ${detail.doneness}`, detail.note && `Obs.: ${detail.note}`]
              .filter(Boolean)
              .join(" · ")
          : "",
      },
    ];
  });

  const sectionCopy: Record<string, { title: string; description: string }> = {
    Espetinhos: {
      title: "Espetinhos",
      description: "Preparados na brasa e servidos no ponto escolhido. Acompanham farofa e mandioca.",
    },
    Acompanhamentos: {
      title: "Acompanhamentos",
      description: "Porções para incrementar o seu pedido.",
    },
    Bebidas: {
      title: "Bebidas",
      description: "Bebidas geladas para acompanhar seu pedido.",
    },
  };

  const add = (id: number) => {
    const product = products.find((item) => item.id === id);
    if (product?.trackStock && Number(product.stock || 0) <= 0) return;
    if (product?.category === "Espetinhos" && !cart[id]) {
      setPendingMeatId(id);
      setDoneness("");
      setMeatNote("");
      setModal("doneness");
      return;
    }
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
  };

  const change = (id: number, amount: number) =>
    setCart((current) => {
      const product = products.find((item) => item.id === id);
      const limit = product?.trackStock ? Number(product.stock || 0) : Number.POSITIVE_INFINITY;
      const next = Math.min(limit, Math.max(0, (current[id] || 0) + amount));
      const updated = { ...current, [id]: next };
      if (!next) {
        delete updated[id];
        setCartDetails((details) => {
          const copy = { ...details };
          delete copy[id];
          return copy;
        });
      }
      return updated;
    });

  const submitOrder = () => {
    const name = customerName.trim() || "Mesa 35";
    const items = currentCartItems.map((item) => ({ ...item, delivered: false }));
    printKitchenTicket(name, items);
    playNotificationSound("sale");

    // Abate estoque
    const deltas = items.map((item) => ({ name: item.name, qty: -item.qty }));
    setProducts((prev) => {
      const next = prev.map((p) => {
        if (!p.trackStock) return p;
        const delta = deltas.filter((d) => d.name === p.name).reduce((sum, d) => sum + d.qty, 0);
        if (!delta) return p;
        return { ...p, stock: Math.max(0, Number(p.stock || 0) + delta) };
      });
      if (typeof window !== "undefined") {
        window.localStorage.setItem("deus-proveu-products", JSON.stringify(next));
      }
      return next;
    });

    setCart({});
    setCartDetails({});
    setModal("success");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <div className="brand" aria-label="Deus Proveu Espetinhos">
          <span className="brand-mark"><Utensils size={24} /></span>
          <span><b>DEUS</b><small>PROVEU</small></span>
        </div>
        <div className={`search-box ${searchOpen ? "open" : ""}`}>
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar no cardápio"
            aria-label="Buscar no cardápio"
          />
        </div>
        <nav className="top-actions">
          <button className="plain search-trigger" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={19} /> <span>BUSCAR</span>
          </button>
          <button className="action waiter" onClick={() => { setSent(false); setModal("waiter"); }}>
            <Bell size={19} /><span>CHAMAR<br />GARÇOM</span>
          </button>
          <button className="action cart-button" onClick={() => setModal("cart")}>
            <ShoppingBag size={19} />
            <span>CARRINHO<br />DE COMPRAS</span>
            <b className="cart-badge">{count}</b>
          </button>
        </nav>
      </header>

      <div className="workspace order-only">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button>
          <div className="nav-list">
            <button className="active" onClick={() => setMenuOpen(false)}>
              <Utensils size={25} strokeWidth={1.7} /><span>Cardápio</span>
            </button>
          </div>
          <div className="side-bottom">
            <button onClick={() => { setSent(false); setModal("review"); }}>
              <Star size={19} /> AVALIE
            </button>
            <button className="about" onClick={() => { setModal("about"); setMenuOpen(false); }}><Info size={17} /> Sobre</button>
          </div>
        </aside>

        <section className="content">
          <div className="category-strip menu-category-strip" aria-label="Categorias do cardápio">
            {categories.map((category) => (
              <button
                key={category}
                className={activeMain === category ? "active" : ""}
                onClick={() => {
                  setActiveMain(category);
                  setQuery("");
                }}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="intro">
            <p className="eyebrow">CARDÁPIO · {activeMain.toUpperCase()}</p>
            <h1>{sectionCopy[activeMain]?.title || activeMain}</h1>
            <p>{sectionCopy[activeMain]?.description || `Produtos selecionados da categoria ${activeMain}.`}</p>
          </div>

          <div className="product-list">
            {filtered.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="photo">
                  {product.tag && <span className="new-badge">{product.tag}</span>}
                  <ProductImage product={product} />
                </div>
                <div className="product-info">
                  <div>
                    <h2>{product.name}</h2>
                    {product.trackStock && (
                      <span className={`stock-badge ${(product.stock || 0) <= 0 ? "out" : (product.stock || 0) <= (product.minStock || 0) ? "low" : ""}`}>
                        {(product.stock || 0) <= 0 ? "ESGOTADO" : `${product.stock || 0} EM ESTOQUE`}
                      </span>
                    )}
                    <p>{product.description}</p>
                    <small>*Consulte nossa equipe sobre alergênicos</small>
                  </div>
                  <div className="buy">
                    <div className="price"><span>A partir de</span><strong>R$ {product.price.toFixed(2).replace(".", ",")}</strong></div>
                    {cart[product.id] ? (
                      <div className="stepper">
                        <button onClick={() => change(product.id, -1)} aria-label="Remover um"><Minus /></button>
                        <b>{cart[product.id]}</b>
                        <button onClick={() => change(product.id, 1)} aria-label="Adicionar mais um"><Plus /></button>
                      </div>
                    ) : (
                      <button className="add-button" disabled={product.trackStock && Number(product.stock || 0) <= 0} onClick={() => add(product.id)}>
                        <Plus size={17} /> {product.trackStock && Number(product.stock || 0) <= 0 ? "PRODUTO ESGOTADO" : "ADICIONAR AO CARRINHO"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
            {!filtered.length && <p className="empty">Nenhum item encontrado para “{query}”.</p>}
          </div>
        </section>
      </div>

      {count > 0 && (
        <button className="floating-cart" onClick={() => setModal("cart")}>
          <span><ShoppingBag size={18} /> {count} {count === 1 ? "item" : "itens"}</span>
          <strong>Ver pedido · R$ {total.toFixed(2).replace(".", ",")}</strong>
        </button>
      )}

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(null)}>
          <section className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)} aria-label="Fechar"><X /></button>
            {modal === "waiter" && (
              sent ? <Success title="Garçom chamado!" text="Em instantes alguém da nossa equipe estará na mesa 35." /> :
              <>
                <span className="modal-icon"><Bell /></span>
                <h3>Chamar garçom</h3>
                <p>Precisa de ajuda? Enviaremos uma notificação para a equipe atender a mesa 35.</p>
                <button className="primary" onClick={() => { playNotificationSound("alert"); setSent(true); }}>SIM, CHAMAR GARÇOM</button>
                <button className="secondary" onClick={() => setModal(null)}>AGORA NÃO</button>
              </>
            )}
            {modal === "review" && (
              sent ? <Success title="Avaliação enviada!" text="Obrigado por compartilhar sua experiência com a gente." /> :
              <>
                <span className="modal-icon"><Star /></span>
                <h3>Como foi sua experiência?</h3>
                <p>Sua opinião ajuda a gente a ficar ainda melhor.</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setStars(n)} aria-label={`${n} estrelas`}>
                      <Star fill={n <= stars ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea placeholder="Conte mais pra gente (opcional)" />
                <button className="primary" disabled={!stars} onClick={() => { playNotificationSound("success"); setSent(true); }}>ENVIAR AVALIAÇÃO</button>
              </>
            )}
            {modal === "doneness" && pendingMeatId !== null && (
              <>
                <span className="modal-icon"><Utensils /></span>
                <h3>Ponto da carne</h3>
                <p><b>{products.find((product) => product.id === pendingMeatId)?.name}</b> — escolha como deseja o preparo.</p>
                <div className="doneness-options">
                  {["Mal passada", "Ao ponto", "Bem passada"].map((point) => (
                    <button key={point} className={doneness === point ? "active" : ""} onClick={() => setDoneness(point)}>{point}</button>
                  ))}
                </div>
                <label className="meat-note">Observação (opcional)
                  <textarea value={meatNote} onChange={(event) => setMeatNote(event.target.value)} placeholder="Ex.: sem sal, sem farofa..." />
                </label>
                <div className="doneness-actions">
                  <button className="secondary" onClick={() => setDoneness("Sem ponto")}>SEM PONTO</button>
                  <button className="primary" disabled={!doneness} onClick={() => {
                    setCart((current) => ({ ...current, [pendingMeatId]: (current[pendingMeatId] || 0) + 1 }));
                    setCartDetails((current) => ({ ...current, [pendingMeatId]: { doneness, note: meatNote.trim() } }));
                    setPendingMeatId(null);
                    setModal(null);
                  }}>ADICIONAR</button>
                </div>
              </>
            )}
            {modal === "cart" && (
              <>
                <span className="modal-icon"><ShoppingBag /></span>
                <h3>Seu pedido</h3>
                {!count ? (
                  <p>Seu carrinho está vazio. Que tal escolher um espetinho?</p>
                ) : (
                  <>
                    <div className="cart-lines">
                      {Object.entries(cart).map(([id, qty]) => {
                        const product = products.find((item) => item.id === Number(id))!;
                        return (
                          <div className="cart-line" key={id}>
                            <div>
                              <b>{qty}×</b>
                              <span>
                                {product.name}
                                {cartDetails[Number(id)] && (
                                  <small>
                                    {[cartDetails[Number(id)].doneness && `Ponto: ${cartDetails[Number(id)].doneness}`, cartDetails[Number(id)].note && `Obs.: ${cartDetails[Number(id)].note}`]
                                      .filter(Boolean)
                                      .join(" · ")}
                                  </small>
                                )}
                              </span>
                            </div>
                            <strong>R$ {(product.price * qty).toFixed(2).replace(".", ",")}</strong>
                          </div>
                        );
                      })}
                    </div>
                    <label className="customer-field">Nome / Mesa
                      <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Ex.: Mesa 5" />
                    </label>
                    <div className="cart-total"><span>Total</span><strong>R$ {total.toFixed(2).replace(".", ",")}</strong></div>
                    <div className="cart-actions">
                      <button className="primary" disabled={!customerName.trim()} onClick={submitOrder}>ENVIAR PARA COZINHA</button>
                    </div>
                  </>
                )}
              </>
            )}
            {modal === "success" && (
              <Success title="Pedido enviado!" text="Sua comanda foi enviada para a cozinha e será preparada em breve." />
            )}
            {modal === "about" && (
              <>
                <span className="modal-icon"><Info /></span>
                <h3>Sobre a Deus Proveu Espetinhos</h3>
                <p>Espetinhos preparados na brasa com ingredientes selecionados e um atendimento pensado para você aproveitar cada momento.</p>
                <button className="primary" onClick={() => setModal(null)}>VOLTAR AO CARDÁPIO</button>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function Success({ title, text }: { title: string; text: string }) {
  return (
    <div className="success">
      <span className="modal-icon success-icon"><Check /></span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function receiptHtml(title: string, customer: string, items: { name: string; qty: number; price: number; detail?: string }[]) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font:14px monospace;width:72mm;margin:0 auto;padding:8mm 2mm;color:#000}h1,h2{text-align:center;margin:4px 0}hr{border:0;border-top:1px dashed #000}.item{display:flex;justify-content:space-between;margin:7px 0}.detail{display:block;font-size:12px;margin:2px 0 8px 18px}.total{font-size:20px;font-weight:bold;text-align:right}@media print{button{display:none}}</style></head><body><h1>Deus Proveu Espetinhos</h1><h2>${title}</h2><p>${new Date().toLocaleString("pt-BR")}</p><hr><b>Mesa/Cliente: ${customer}</b><hr>${items.map((i) => `<div class="item"><span>${i.qty}x ${i.name}</span><span>R$ ${(i.qty * i.price).toFixed(2)}</span></div>${i.detail ? `<span class="detail">${i.detail}</span>` : ""}`).join("")}<hr><p class="total">TOTAL R$ ${items.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}</p><script>window.onload=()=>{window.print();setTimeout(()=>window.close(),500)}</script></body></html>`;
}

function openPrintDocument(html: string) {
  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);
  frame.contentDocument?.open();
  frame.contentDocument?.write(html);
  frame.contentDocument?.close();
  setTimeout(() => frame.remove(), 2000);
}

function toReceiptItems(items: { name: string; qty: number; price: number; detail?: string }[]) {
  return items.map((item) => ({ name: item.name, qty: item.qty, unitPrice: item.price, total: item.price * item.qty, notes: item.detail }));
}

async function printKitchenTicket(customer: string, items: { name: string; qty: number; price: number; detail?: string }[]) {
  try {
    await sendOrderTicketToPrinter({ customer, items: toReceiptItems(items) });
  } catch (error) {
    console.error("Impressão térmica indisponível, usando impressão do navegador:", error);
    openPrintDocument(receiptHtml("PEDIDO DA COZINHA", customer, items));
  }
}
