import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function loadProducts() {
            const sheetUrl =
              "https://docs.google.com/spreadsheets/d/1Y423RJnyWCGu2UFceA5TWej1FufDx8lA/gviz/tq?tqx=out:json";
            try {
                const response = await fetch(sheetUrl);
                const text = await response.text();
                const json = JSON.parse(text.substr(47).slice(0, -2));
                const rows = json.table.rows;

                const parsedProducts = rows.map((row) => ({
                    name: row.c[0]?.v || "",
                    description: row.c[1]?.v || "",
                    price: row.c[2]?.v || "",
                    image: row.c[3]?.v || "",
                    expanded: false,
                }));
                setProducts(parsedProducts);
            } catch (error) {
                console.error("Ошибка загрузки товаров:", error);
            }
        }

        loadProducts();
    }, []);

    function toggleDescription(index) {
        setProducts(
          products.map((product, i) =>
            i === index ? { ...product, expanded: !product.expanded } : product
          )
        );
    }

    return (
      <div id="product-list">
          {products.map((product, index) => (
            <div className="product" key={index}>
                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p className="short-desc">
                    {product.expanded ? "" : product.description.substring(0, 100) + "..."}
                </p>
                <p
                  className="full-desc"
                  style={{ display: product.expanded ? "block" : "none" }}
                >
                    {product.description}
                </p>
                <button className="toggle-desc" onClick={() => toggleDescription(index)}>
                    {product.expanded ? "Skrýt" : "Rozbalit"}
                </button>
                <p>
                    <strong>Cena: {product.price} Kč</strong>
                </p>
                <button className="contact-btn">Kontaktovat</button>
            </div>
          ))}
      </div>
    );
}

function ContactForm() {
    const [message, setMessage] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = new URLSearchParams(formData).toString();
        const sheetSubmitUrl =
          "https://script.google.com/macros/s/1UruaN0PZBpOvwLUmJXqfC_MseBnblj26rpMIKkaM8-I/exec";

        try {
            const response = await fetch(sheetSubmitUrl, {
                method: "POST",
                body: data,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            await response.text();
            setMessage("Zpráva úspěšně odeslána!");
        } catch (error) {
            setMessage("Chyba při odesílání zprávy!");
        }
    }

    return (
      <section id="contact">
          <h2>Kontaktujte nás</h2>
          <form id="contactForm" onSubmit={handleSubmit}>
              <input type="text" id="name" name="name" placeholder="Jméno" required />
              <input type="email" id="email" name="email" placeholder="E-mail" required />
              <textarea id="message" name="message" placeholder="Zpráva" required></textarea>
              <button type="submit">Odeslat</button>
              <p id="formResponse">{message}</p>
          </form>
      </section>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <App />
      <ProductList />
      <ContactForm />
  </React.StrictMode>
);