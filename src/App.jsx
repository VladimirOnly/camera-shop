import React from "react";

export default function App() {
  return (
    <div>
      {/* Хедер */}
      <header>
        <div className="header-content">
          <h1>Profesionální instalace kamerových systémů</h1>
          <p>
            Bezpečnost pro váš <span className="highlight">domov</span> i{" "}
            <span className="highlight">firmu</span>
          </p>
          <p>
            Chcete mít přehled o tom, co se děje kolem vašeho domu, bytu nebo firmy? Nabízíme
            profesionální montáž a konfiguraci kamerových systémů na míru vašim potřebám.
          </p>
          <ul>
            <li>✅ Kamerové systémy pro domácnosti i firmy</li>
            <li>✅ Montáž, nastavení a servis</li>
            <li>✅ Moderní technologie pro maximální bezpečnost</li>
            <li>✅ Vzdálený přístup k záznamům odkudkoliv</li>
          </ul>
        </div>
      </header>

      {/* Основной контент */}
      <h1>Profesionální instalace kamerových systémů</h1>
      <p>Bezpečnost pro váš domov i firmu</p>



      {/* Футер */}
      <footer>
        <p>Kontakt: plokhotnuik@gmail.com | Tel: +420 777 938 847</p>
      </footer>
    </div>
  );
}