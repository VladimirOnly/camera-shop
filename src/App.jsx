// src/App.jsx
import React, { useEffect, useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const sheetUrl =
        "https://docs.google.com/spreadsheets/d/1Y423RJnyWCGu2UFceA5TWej1FufDx8lA/gviz/tq?tqx=out:json";
      const response = await fetch(sheetUrl);
      const text = await response.text();
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const rows = json.table.rows;

      const productsData = rows.map((row) => {
        const [name, description, price, image] = row.c.map((cell) =>
          cell ? cell.v : ""
        );
        return { name, description, price, image };
      });

      setProducts(productsData);
    }

    loadProducts();
  }, []);

  return (
    <div>
      <h1>Profesionální instalace kamerových systémů</h1>
      <p>Bezpečnost pro váš domov i firmu</p>

      {/* Карточки товаров */}
      <div id="product-list">
        {products.map((product, index) => (
          <div className="product" key={index}>
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p className="short-desc">{product.description.substring(0, 100)}...</p>
            <p className="full-desc" style={{ display: "none" }}>{product.description}</p>
            <button
              className="toggle-desc"
              onClick={(e) => {
                const fullDesc = e.target.previousSibling;
                const shortDesc = fullDesc.previousSibling;
                if (fullDesc.style.display === "none") {
                  fullDesc.style.display = "block";
                  shortDesc.style.display = "none";
                  e.target.textContent = "Skrýt";
                } else {
                  fullDesc.style.display = "none";
                  shortDesc.style.display = "block";
                  e.target.textContent = "Rozbalit";
                }
              }}
            >
              Rozbalit
            </button>
            <p>
              <strong>Cena: {product.price} Kč</strong>
            </p>
            <button className="contact-btn">Kontaktovat</button>
          </div>
        ))}
      </div>
    </div>
  );
}
