import React, { useEffect, useState } from "react";

// Вкладки для КАТАЛОГА ТОВАРОВ
const PRODUCT_TABS = ["Kamerové systémy", "Zabezpečení", "Příslušenství"];
// Вкладка для ПОРТФОЛИО
const PORTFOLIO_TAB = "Naše práce";

// Список всех листов для скачивания
const ALL_SHEETS = [...PRODUCT_TABS, PORTFOLIO_TAB];

export default function App() {
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formStatus, setFormStatus] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const [activeTab, setActiveTab] = useState(PRODUCT_TABS[0]);

  // --- ЗАГРУЗКА ДАННЫХ С РАЗНЫХ ЛИСТОВ ---
  useEffect(() => {
    async function loadProducts() {
      const sheetId = "1Y423RJnyWCGu2UFceA5TWej1FufDx8lA";
      
      try {
        const fetchPromises = ALL_SHEETS.map(async (tabName) => {
          const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(tabName)}`;
          
          try {
            const response = await fetch(sheetUrl);
            const text = await response.text();
            
            if (!text.includes("google.visualization.Query.setResponse")) return [];
            
            const json = JSON.parse(text.substr(47).slice(0, -2));
            if (!json.table || !json.table.rows) return [];

            // ИСКЛЮЧАЕМ СТРОКУ С ЗАГОЛОВКАМИ (где в первой колонке написано Name)
            const validRows = json.table.rows.filter(row => {
              const firstCol = row.c[0]?.v;
              return firstCol && firstCol.toString().toLowerCase() !== "name";
            });

            return validRows.map((row) => {
              const name = row.c[0]?.v || "";
              const id = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Math.random().toString(36).substr(2, 9);
              
              return {
                id: id,
                name: name,
                description: row.c[1]?.v || "",
                price: row.c[2]?.v ? `${row.c[2].v} Kč` : "Na vyžádání",
                image: row.c[3]?.v || "https://via.placeholder.com/400x300?text=Foto",
                category: tabName,
              };
            });
          } catch (err) {
            console.warn(`Не удалось загрузить лист: ${tabName}`, err);
            return [];
          }
        });

        const results = await Promise.all(fetchPromises);
        const allItems = results.flat();
        
        // Разделяем товары и портфолио по разным массивам
        setProducts(allItems.filter(item => PRODUCT_TABS.includes(item.category)));
        setPortfolio(allItems.filter(item => item.category === PORTFOLIO_TAB));

        const urlParams = new URLSearchParams(window.location.search);
        const productIdFromUrl = urlParams.get("product");
        if (productIdFromUrl) {
          const foundProduct = allItems.find(p => p.id === productIdFromUrl);
          if (foundProduct) {
            setSelectedProduct(foundProduct);
            if (PRODUCT_TABS.includes(foundProduct.category)) {
              setActiveTab(foundProduct.category);
            }
          }
        }

      } catch (error) {
        console.error("Глобальная ошибка загрузки:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // --- ИЗМЕНЕНИЕ ССЫЛКИ ПРИ ОТКРЫТИИ/ЗАКРЫТИИ МОДАЛКИ ---
  useEffect(() => {
    if (loading) return;

    const url = new URL(window.location);
    if (selectedProduct) {
      url.searchParams.set("product", selectedProduct.id);
    } else {
      url.searchParams.delete("product");
    }
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

  const filteredProducts = products.filter(product => product.category === activeTab);

  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#121826] font-sans flex flex-col">

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 bg-[#121826]/95 backdrop-blur-md border-b border-[#2A3441] shadow-xl">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer h-full py-2" onClick={() => window.scrollTo(0,0)}>
            <img src="/images/logo.png" alt="I SEE YOU 24" className="h-full w-auto object-contain" />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 mr-4">
              <a href="#services" className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition">Služby</a>
              <a href="#portfolio" className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-white transition">Naše práce</a>
            </div>
            <a href="#contact" className="text-xs font-bold uppercase tracking-widest text-[#E7E6E1] border border-[#E7E6E1]/30 px-6 py-2 hover:bg-[#E7E6E1] hover:text-[#121826] transition duration-300 rounded-sm">
              Poptávka
            </a>
          </div>
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
            <a href="#portfolio" className="bg-[#1A2332] border border-[#2A3441] text-[#E7E6E1] px-8 py-4 font-bold uppercase tracking-widest hover:bg-[#2A3441] transition shadow-lg">
              Naše práce
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
              <p className="text-gray-600 leading-relaxed px-4">Návrh a instalace moderních kamer. Vzdálený dohled přes mobil, záznam ve vysokém rozlišení a noční vidění.</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-[#F5F5F2] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#121826] transition duration-300 shadow-sm">
                <svg className="w-10 h-10 text-[#121826] group-hover:text-white transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase">Zabezpečení</h3>
              <p className="text-gray-600 leading-relaxed px-4">Komplexní alarmy pro byty i kom
