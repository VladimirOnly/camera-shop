import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formStatus, setFormStatus] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // --- ЗАГРУЗКА ДАННЫХ И ПРОВЕРКА ССЫЛКИ ---
  useEffect(() => {
    async function loadProducts() {
      const sheetUrl = "https://docs.google.com/spreadsheets/d/1Y423RJnyWCGu2UFceA5TWej1FufDx8lA/gviz/tq?tqx=out:json";
      try {
        const response = await fetch(sheetUrl);
        const text = await response.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));

        const parsedProducts = json.table.rows.map((row) => {
          const name = row.c[0]?.v || "Produkt";
          // Создаем КРАСИВЫЙ ID: только буквы, цифры и тире (убираем скобки и %20)
          const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          
          return {
            id: id,
            name: name,
            description: row.c[1]?.v || "",
            price: row.c[2]?.v ? `${row.c[2].v} Kč` : "Na vyžádání",
            image: row.c[3]?.v || "https://via.placeholder.com/400x300?text=Foto",
          };
        });
        
        setProducts(parsedProducts);

        // Смотрим в ссылку только ПОСЛЕ того, как скачали все товары
        const urlParams = new URLSearchParams(window.location.search);
        const productIdFromUrl = urlParams.get("product");
        if (productIdFromUrl) {
          const foundProduct = parsedProducts.find(p => p.id === productIdFromUrl);
          if (foundProduct) {
            setSelectedProduct(foundProduct);
          }
        }

      } catch (error) {
        console.error("Chyba:", error);
      } finally {
        setLoading(false); // Сообщаем сайту, что загрузка окончена
      }
    }
    loadProducts();
  }, []);

  // --- ИЗМЕНЕНИЕ ССЫЛКИ ПРИ ОТКРЫТИИ/ЗАКРЫТИИ МОДАЛКИ ---
  useEffect(() => {
    // ВАЖНО: Ничего не делаем со ссылкой, пока сайт загружается
    if (loading) return;

    const url = new URL(window.location);
    if (selectedProduct) {
      url.searchParams.set("product", selectedProduct.id);
    } else {
      url.searchParams.delete("product");
    }
    // Используем replaceState, чтобы не ломать кнопку "Назад" в браузере
    window.history.replaceState({}, '', url);
  }, [selectedProduct, loading]);

  // --- ОТПРАВКА ФОРМЫ ---
  async function handleSubmit(event) {
    event.preventDefault();
    setFormStatus("Odesílání...");
    const formData = new FormData(event.target);
    const data = new URLSearchParams(formData).toString();
    const scriptUrl = "https://script.google.com/macros/s/AKfycbz5vandXsZCaSPHanD2m0Uq6kfR91IQwS0sr1z06NmaZCTglkieKg-OtvL_4NQSi7Sw_g/exec";

    try {
      await fetch(scriptUrl, {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      setFormStatus("✅ Poptávka odeslána! Ozveme se vám.");
      event.target.reset();
    } catch (error) {
      setFormStatus("❌ Chyba! Zkuste to znovu.");
    }
  }

  return (
    // ГЛОБАЛЬНЫЙ ФОН
    <div className="min-h-screen bg-[#F5F5F2] text-[#121826] font-sans flex flex-col">

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#121826]/95 backdrop-blur-md border-b border-[#2A3441] shadow-xl">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">

          <div className="flex items-center gap-3 cursor-pointer h-full py-2" onClick={() => window.scrollTo(0,0)}>
            <img
              src="/images/logo.png"
              alt="I SEE YOU 24"
              className="h-full w-auto object-contain"
            />
          </div>

          <a href="#contact" className="text-xs font-bold uppercase tracking-widest text-[#E7E6E1] border border-[#E7E6E1]/30 px-6 py-2 hover:bg-[#E7E6E1] hover:text-[#121826] transition duration-300 rounded-sm">
            Poptávka
          </a>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div className="bg-[#121826] text-[#E7E6E1] py-24 px-4 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase tracking-wide text-white">
            Bezpečnost <br/> Pod Kontrolou
          </h1>
          <p className="text-[#9CA3AF] max-w-2xl mx-auto mb-12 text-lg md:text-xl font-light leading-relaxed">
            Profesionální montáž kamerových systémů, zabezpečení objektů a kompletní IT servis.
            Zajistíme klid pro váš domov i firmu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#services" className="bg-[#E7E6E1] text-[#121826] px-8 py-4 font-bold uppercase tracking-widest hover:bg-white transition shadow-lg">
              Naše Služby
            </a>
            <a href="#contact" className="border border-[#E7E6E1]/30 text-[#E7E6E1] px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#E7E6E1]/10 transition">
              Kontaktovat
            </a>
          </div>
        </div>
      </div>

      {/* --- SLUŽBY --- */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-wide text-[#121826]">Co děláme</h2>
            <div className="w-20 h-1 bg-[#121826] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#F5F5F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#121826] transition duration-300 shadow-sm">
                <svg className="w-10 h-10 text-[#121826] group-hover:text-white transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">Kamerové systémy</h3>
              <p className="text-gray-600 leading-relaxed px-4">
                Návrh a instalace moderních kamer. Vzdálený dohled přes mobil, záznam ve vysokém rozlišení a noční vidění.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#F5F5F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#121826] transition duration-300 shadow-sm">
                <svg className="w-10 h-10 text-[#121826] group-hover:text-white transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">Zabezpečení</h3>
              <p className="text-gray-600 leading-relaxed px-4">
                Komplexní alarmy pro byty i komerční objekty. Detekce pohybu, kouře a záplavy. Ochrana 24/7.
              </p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#F5F5F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#121826] transition duration-300 shadow-sm">
                <svg className="w-10 h-10 text-[#121826] group-hover:text-white transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">IT & Internet</h3>
              <p className="text-gray-600 leading-relaxed px-4">
                Nastavení Wi-Fi routerů, natažení kabeláže (LAN), konfigurace domácích sítí a servis počítačů.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRODUKTY --- */}
      <section id="products" className="container mx-auto px-4 py-20 flex-grow bg-[#F5F5F2]">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Co například instalujeme</span>
          <h2 className="text-3xl font-bold uppercase tracking-wide text-[#121826] mt-2">Ukázka techniky</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#121826]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index}
                   className="bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer border border-transparent hover:border-gray-200"
                   onClick={() => setSelectedProduct(product)}>

                {/* Картинка */}
                <div className="h-64 p-8 flex items-center justify-center bg-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#E7E6E1] opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain relative z-10 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Инфо */}
                <div className="p-6 flex-1 flex flex-col bg-white border-t border-gray-100">
                  <h3 className="font-bold text-base mb-4 text-[#121826] uppercase tracking-wide leading-snug line-clamp-2">
                    {product.name}
                  </h3>

                  <div className="mt-auto pt-4 flex justify-between items-end border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold">Orientační cena</span>
                      <span className="text-lg font-bold text-[#121826] leading-none">{product.price}</span>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-[#F5F5F2] flex items-center justify-center text-[#121826] group-hover:bg-[#121826] group-hover:text-white transition shadow-sm">
                      ➜
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- KONTAKT --- */}
      <section id="contact" className="bg-[#121826] text-[#E7E6E1] py-24 relative">
        <div className="container mx-auto px-4 max-w-2xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold uppercase tracking-widest mb-4 text-white">Nezávazná poptávka</h2>
            <p className="text-[#9CA3AF]">Napište nám, co potřebujete vyřešit. Návrh řešení je zdarma.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text" name="name" placeholder="Jméno" required
                className="w-full bg-[#1A2332] border-b border-[#2A3441] text-white px-4 py-4 focus:outline-none focus:border-[#E7E6E1] transition placeholder-gray-500"
              />
              <input
                type="email" name="email" placeholder="E-mail" required
                className="w-full bg-[#1A2332] border-b border-[#2A3441] text-white px-4 py-4 focus:outline-none focus:border-[#E7E6E1] transition placeholder-gray-500"
              />
            </div>
            <textarea
              name="message" placeholder="Popište váš projekt..." required rows="4"
              className="w-full bg-[#1A2332] border-b border-[#2A3441] text-white px-4 py-4 focus:outline-none focus:border-[#E7E6E1] transition placeholder-gray-500 resize-none"
            ></textarea>

            <button type="submit" className="w-full bg-[#E7E6E1] text-[#121826] font-bold py-5 uppercase tracking-widest hover:bg-white transition shadow-lg">
              Odeslat
            </button>
            {formStatus && <p className="text-center mt-4 text-green-400">{formStatus}</p>}
          </form>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-16 text-sm text-[#9CA3AF] uppercase tracking-widest">
            <a href="mailto:info@iseeyou24.cz" className="hover:text-white transition flex items-center gap-2">
              <span>✉</span> info@iseeyou24.cz
            </a>
            <a href="tel:+420777938847" className="hover:text-white transition flex items-center gap-2">
              <span>📞</span> +420 777 938 847
            </a>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#0D111A] text-[#4B5563] py-8 text-center text-[10px] uppercase tracking-[0.2em] border-t border-[#1A2332]">
        <p>&copy; 2025 I SEE YOU 24. Profesionální instalace a IT servis.</p>
      </footer>

      {/* --- MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#121826]/90 backdrop-blur-sm transition-opacity duration-300" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-[#121826] transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="w-full md:w-1/2 bg-[#F5F5F2] flex items-center justify-center p-12">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="max-h-[300px] object-contain mix-blend-multiply" />
            </div>

            <div className="w-full md:w-1/2 p-10 flex flex-col">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#121826] uppercase leading-tight">{selectedProduct.name}</h3>
              
              {/* Кнопка копирования ссылки */}
              <button 
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}?product=${selectedProduct.id}`;
                  navigator.clipboard.writeText(url);
                  setCopySuccess(true);
                  setTimeout(() => setCopySuccess(false), 2000);
                }}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#121826] mb-6 transition w-fit"
              >
                <span>{copySuccess ? "✅" : "🔗"}</span>
                <span className={copySuccess ? "font-bold text-green-600" : "underline"}>
                  {copySuccess ? "Odkaz zkopírován!" : "Zkopírovat odkaz na produkt"}
                </span>
              </button>

              <div className="prose prose-sm text-gray-600 mb-8 whitespace-pre-line flex-grow overflow-y-auto max-h-60 custom-scrollbar">
                {selectedProduct.description}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Orientační cena hardwaru:</p>
                <p className="text-2xl font-bold text-[#121826] mb-6">{selectedProduct.price}</p>
                <a href="#contact" onClick={() => setSelectedProduct(null)} className="block text-center w-full bg-[#121826] text-[#E7E6E1] py-4 font-bold uppercase tracking-widest hover:bg-[#2A3441] transition">
                  Poptat instalaci
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
