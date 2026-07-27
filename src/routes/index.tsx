import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CircleUserRound,
  Menu,
  MessageSquareHeart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  category: string;
  name: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
};

const stockFallbackImages: Record<string, string> = {
  Entradas:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=82",
  Saladas:
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=600&q=82",
  Lanches:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=82",
  Espetinhos:
    "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=82",
  Bebidas:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=82",
  Vinhos:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=82",
};

function ProductImage({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const fallback =
    stockFallbackImages[product.category] || stockFallbackImages.Entradas;
  return (
    <img
      className={className}
      src={product.image?.trim() || fallback}
      alt={product.name}
      loading="lazy"
      onError={(event) => {
        const image = event.currentTarget;
        if (image.src !== fallback) image.src = fallback;
      }}
    />
  );
}

const initialProducts: Product[] = [
  { id: 1, category: "Lanches", name: "Smash Fenda do Biquíni", price: 37, tag: "NOVO", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=88", description: "Pão brioche macio, burger smash de 100g, queijo muçarela, bacon crocante, alface e um generoso abacaxi grelhado caramelizado no mel." },
  { id: 2, category: "Lanches", name: "Smash Pac Baby", price: 29, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=88", description: "Pão brioche, burger smash de 100g, maionese da casa e queijo muçarela. Acompanha batata frita crocante." },
  { id: 3, category: "Lanches", name: "Smash Bacon Melt", price: 42, tag: "MAIS PEDIDO", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=900&q=88", description: "Dois burgers smash, cheddar cremoso, cebola caramelizada, bacon crocante e nosso molho secreto no brioche." },
  { id: 4, category: "Vinhos", name: "Malbec Reserva", price: 79, tag: "DESTAQUE", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=88", description: "Vinho argentino encorpado, com notas de frutas negras, especiarias e final elegante. Garrafa 750ml." },
  { id: 5, category: "Vinhos", name: "Cabernet Sauvignon", price: 72, image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=88", description: "Tinto seco de corpo médio, aroma de frutas maduras e taninos macios. Perfeito para acompanhar burgers." },
  { id: 6, category: "Entradas", name: "Batata Rústica", price: 24, tag: "NOVO", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=88", description: "Batatas com casca, crocantes por fora e macias por dentro, finalizadas com páprica e ervas." },
  { id: 7, category: "Entradas", name: "Onion Rings", price: 26, image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=88", description: "Anéis de cebola empanados e crocantes, servidos com maionese defumada da casa." },
  { id: 8, category: "Saladas", name: "Salada House", price: 31, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=900&q=88", description: "Mix de folhas frescas, tomate-cereja, queijo, cebola roxa, croutons e molho cítrico." },
  { id: 9, category: "Espetinhos", name: "Carne", price: 10, image: "/products/generated/espeto-carne.png", description: "Espetinho de carne preparado na brasa e servido no ponto escolhido." },
  { id: 10, category: "Espetinhos", name: "Carne com Bacon", price: 14, tag: "DESTAQUE", image: "/products/generated/espeto-carne-bacon.png", description: "Espetinho de carne intercalada com bacon, assado na brasa." },
  { id: 11, category: "Espetinhos", name: "Frango com Bacon", price: 12, image: "/products/generated/espeto-frango-bacon.png", description: "Cubos de frango com bacon, grelhados até ficarem dourados e suculentos." },
  { id: 12, category: "Espetinhos", name: "Linguiça", price: 10, image: "/products/generated/espeto-linguica.png", description: "Espetinho de linguiça assada na brasa, dourada e suculenta." },
  { id: 13, category: "Bebidas", name: "Água c/ Gás", price: 4, image: "/products/generated/agua-com-gas.png", description: "Água mineral com gás, gelada." },
  { id: 14, category: "Bebidas", name: "Água s/ Gás", price: 3, image: "/products/generated/agua-sem-gas.png", description: "Água mineral sem gás, gelada." },
  { id: 15, category: "Bebidas", name: "Coca Cola 1,5L", price: 12, image: "/products/generated/coca-cola-15l.png", description: "Refrigerante Coca-Cola 1,5 litro, servido gelado." },
  { id: 16, category: "Bebidas", name: "Coca Cola 1L", price: 10, image: "/products/generated/coca-cola-1l.png", description: "Refrigerante Coca-Cola 1 litro, servido gelado." },
  { id: 17, category: "Bebidas", name: "Coca Cola Lata", price: 6, image: "/products/generated/coca-cola-lata.png", description: "Refrigerante Coca-Cola em lata, servido gelado." },
  { id: 18, category: "Bebidas", name: "Fanta Lata", price: 6, image: "/products/generated/fanta-lata.png", description: "Refrigerante Fanta em lata, servido gelado." },
  { id: 19, category: "Bebidas", name: "Guaraná Lata", price: 6, image: "/products/generated/guarana-lata.png", description: "Refrigerante Guaraná em lata, servido gelado." },
];

const nav = [
  { label: "Entradas", icon: Utensils },
  { label: "Saladas", icon: CircleUserRound },
  { label: "Lanches", icon: ShoppingBag },
  { label: "Espetinhos", icon: Utensils },
  { label: "Bebidas", icon: Wine },
  { label: "Vinhos", icon: Wine },
];

const meatCategories = new Set(["Lanches", "Espetinhos"]);
const donenessOptions = ["Mal passado", "Ao ponto", "Bem passado"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Burguer House — Cardápio Digital" },
      { name: "description", content: "Cardápio digital da Burguer House: smash burgers, espetinhos, entradas, saladas, bebidas e vinhos. Peça direto da sua mesa." },
      { property: "og:title", content: "Burguer House — Cardápio Digital" },
      { property: "og:description", content: "Peça direto da sua mesa: smash burgers, espetinhos e mais na Burguer House." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

type ModalKind = "waiter" | "review" | "cart" | "about" | "doneness" | null;

function Home() {
  const [activeMain, setActiveMain] = useState("Lanches");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartDetails, setCartDetails] = useState<
    Record<number, { doneness: string; note: string }>
  >({});
  const [modal, setModal] = useState<ModalKind>(null);
  const [pendingMeatId, setPendingMeatId] = useState<number | null>(null);
  const [doneness, setDoneness] = useState("");
  const [meatNote, setMeatNote] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [sent, setSent] = useState(false);
  const [customerName, setCustomerName] = useState("Mesa 35");

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = useMemo(
    () =>
      initialProducts.reduce(
        (sum, p) => sum + (cart[p.id] ? p.price * cart[p.id] : 0),
        0,
      ),
    [cart],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialProducts.filter((p) => {
      if (q) {
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return p.category === activeMain;
    });
  }, [query, activeMain]);

  function addToCart(product: Product) {
    if (meatCategories.has(product.category)) {
      setPendingMeatId(product.id);
      setDoneness(cartDetails[product.id]?.doneness || "Ao ponto");
      setMeatNote(cartDetails[product.id]?.note || "");
      setModal("doneness");
      return;
    }
    setCart((c) => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
  }

  function confirmMeat() {
    if (pendingMeatId == null) return;
    setCart((c) => ({ ...c, [pendingMeatId]: (c[pendingMeatId] || 0) + 1 }));
    setCartDetails((d) => ({
      ...d,
      [pendingMeatId]: { doneness, note: meatNote },
    }));
    setPendingMeatId(null);
    setDoneness("");
    setMeatNote("");
    setModal(null);
  }

  function inc(id: number) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function dec(id: number) {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return c;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  function sendOrder() {
    setSent(true);
    setTimeout(() => {
      setCart({});
      setCartDetails({});
      setSent(false);
      setModal(null);
    }, 1600);
  }

  function sendWaiter() {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setModal(null);
    }, 1400);
  }

  function sendReview() {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setStars(0);
      setReviewText("");
      setModal(null);
    }, 1400);
  }

  const cartLines = initialProducts.filter((p) => cart[p.id]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <div className="brand" aria-label="Burguer House">
          <span className="brand-mark">
            <Utensils size={24} />
          </span>
          <span>
            <b>BURGUER</b>
            <small>HOUSE</small>
          </span>
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
          <button
            className="plain search-trigger"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={19} /> <span>BUSCAR</span>
          </button>
          <button
            className="action waiter"
            onClick={() => {
              setSent(false);
              setModal("waiter");
            }}
          >
            <Bell size={19} />
            <span>
              CHAMAR
              <br />
              GARÇOM
            </span>
          </button>
          <button
            className="action cart-button"
            onClick={() => setModal("cart")}
          >
            <ShoppingBag size={19} />
            <span>
              CARRINHO
              <br />
              DE COMPRAS
            </span>
            <b className="cart-badge">{count}</b>
          </button>
        </nav>
      </header>

      <div className="workspace">
        <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          >
            <X />
          </button>
          <div className="nav-list">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className={activeMain === item.label ? "active" : ""}
                  onClick={() => {
                    setActiveMain(item.label);
                    setQuery("");
                    setMenuOpen(false);
                  }}
                >
                  <Icon size={25} strokeWidth={1.7} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="side-bottom">
            <button onClick={() => setModal("review")}>
              <MessageSquareHeart size={18} /> Avaliação
            </button>
            <button className="about" onClick={() => setModal("about")}>
              Sobre
            </button>
          </div>
        </aside>

        <section className="content">
          <div className="category-strip">
            {nav.map((item) => (
              <button
                key={item.label}
                className={activeMain === item.label ? "active" : ""}
                onClick={() => {
                  setActiveMain(item.label);
                  setQuery("");
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="intro">
            <p className="eyebrow">CARDÁPIO</p>
            <h1>{query ? `Resultados para "${query}"` : activeMain}</h1>
            <p>
              {query
                ? `${filtered.length} item(ns) encontrado(s).`
                : "Peça direto da sua mesa. Nosso time recebe o pedido em tempo real."}
            </p>
          </div>

          <div className="product-list">
            {filtered.length === 0 && (
              <div className="empty">Nenhum item encontrado.</div>
            )}
            {filtered.map((product) => {
              const qty = cart[product.id] || 0;
              return (
                <article key={product.id} className="product-card">
                  <div className="photo">
                    {product.tag && (
                      <span className="new-badge">{product.tag}</span>
                    )}
                    <ProductImage product={product} />
                  </div>
                  <div className="product-info">
                    <div>
                      <h2>{product.name}</h2>
                      <p>{product.description}</p>
                      <small>Categoria · {product.category}</small>
                    </div>
                    <div className="buy">
                      <div className="price">
                        <span>a partir de</span>
                        <strong>
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </strong>
                      </div>
                      {qty === 0 ? (
                        <button
                          className="add-button"
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={14} /> ADICIONAR
                        </button>
                      ) : (
                        <div className="stepper">
                          <button onClick={() => dec(product.id)}>
                            <Minus />
                          </button>
                          <b>{qty}</b>
                          <button onClick={() => inc(product.id)}>
                            <Plus />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Doneness modal */}
      {modal === "doneness" && pendingMeatId !== null && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setModal(null);
            setPendingMeatId(null);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => {
                setModal(null);
                setPendingMeatId(null);
              }}
            >
              <X size={20} />
            </button>
            <div className="modal-icon">
              <Utensils />
            </div>
            <h3>Ponto da carne</h3>
            <p>Como você prefere sua carne?</p>
            <div className="doneness-options">
              {donenessOptions.map((opt) => (
                <button
                  key={opt}
                  className={doneness === opt ? "active" : ""}
                  onClick={() => setDoneness(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            <label className="meat-note">
              OBSERVAÇÕES
              <textarea
                value={meatNote}
                onChange={(e) => setMeatNote(e.target.value)}
                placeholder="Ex.: sem cebola, ponto do queijo..."
              />
            </label>
            <div className="doneness-actions">
              <button
                className="secondary"
                onClick={() => {
                  setModal(null);
                  setPendingMeatId(null);
                }}
              >
                CANCELAR
              </button>
              <button
                className="primary"
                disabled={!doneness}
                onClick={confirmMeat}
              >
                <Plus size={14} /> ADICIONAR AO PEDIDO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart modal */}
      {modal === "cart" && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={20} />
            </button>
            <div className="modal-icon">
              <ShoppingBag />
            </div>
            <h3>{sent ? "Pedido enviado!" : "Sua comanda"}</h3>
            {sent ? (
              <p>Seu pedido foi enviado para a cozinha. Bom apetite! 🍔</p>
            ) : cartLines.length === 0 ? (
              <p>Seu carrinho está vazio. Adicione itens do cardápio.</p>
            ) : (
              <>
                <div className="cart-lines">
                  {cartLines.map((p) => {
                    const detail = cartDetails[p.id];
                    return (
                      <div key={p.id} className="cart-line">
                        <div>
                          <b>{cart[p.id]}×</b>
                          <span>
                            {p.name}
                            {detail?.doneness && (
                              <small>
                                Ponto: {detail.doneness}
                                {detail.note ? ` · ${detail.note}` : ""}
                              </small>
                            )}
                          </span>
                        </div>
                        <strong>
                          R${" "}
                          {(p.price * cart[p.id])
                            .toFixed(2)
                            .replace(".", ",")}
                        </strong>
                      </div>
                    );
                  })}
                </div>
                <div className="cart-total">
                  <span>Total</span>
                  <strong>R$ {total.toFixed(2).replace(".", ",")}</strong>
                </div>
                <label className="customer-field">
                  IDENTIFICAÇÃO
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </label>
                <div className="cart-actions">
                  <button onClick={() => setCart({})}>LIMPAR</button>
                  <button
                    className="primary"
                    onClick={sendOrder}
                    disabled={!cartLines.length}
                  >
                    <Check size={14} /> ENVIAR PEDIDO
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Waiter modal */}
      {modal === "waiter" && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={20} />
            </button>
            <div className={`modal-icon ${sent ? "success-icon" : ""}`}>
              {sent ? <Check /> : <Bell />}
            </div>
            <h3>{sent ? "Garçom a caminho!" : "Chamar o garçom?"}</h3>
            <p>
              {sent
                ? "Um atendente já foi avisado e vai até você em instantes."
                : "Envie um aviso rápido para nosso time atender sua mesa."}
            </p>
            {!sent && (
              <button className="primary" onClick={sendWaiter}>
                <Bell size={14} /> CHAMAR AGORA
              </button>
            )}
          </div>
        </div>
      )}

      {/* Review modal */}
      {modal === "review" && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={20} />
            </button>
            <div className={`modal-icon ${sent ? "success-icon" : ""}`}>
              {sent ? <Check /> : <MessageSquareHeart />}
            </div>
            <h3>{sent ? "Obrigado!" : "Como foi sua experiência?"}</h3>
            {sent ? (
              <p>Sua avaliação foi registrada. Volte sempre!</p>
            ) : (
              <>
                <p>Sua opinião nos ajuda a melhorar cada dia.</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setStars(n)}>
                      <Star fill={n <= stars ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Conte para gente (opcional)"
                />
                <button
                  className="primary"
                  disabled={!stars}
                  onClick={sendReview}
                >
                  ENVIAR AVALIAÇÃO
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* About */}
      {modal === "about" && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>
              <X size={20} />
            </button>
            <div className="modal-icon">
              <Utensils />
            </div>
            <h3>Burguer House</h3>
            <p>
              Smash burgers artesanais, espetinhos na brasa, entradas e bebidas
              geladas. Peça direto da mesa pelo cardápio digital.
            </p>
            <button className="primary" onClick={() => setModal(null)}>
              FECHAR
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
