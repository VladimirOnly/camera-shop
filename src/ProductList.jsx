import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null); // Для увеличенного изображения

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

  function handleImageClick(imageUrl) {
    setExpandedImage(imageUrl); // Устанавливаем увеличенное изображение
  }

  function closeExpandedImage() {
    setExpandedImage(null); // Закрываем увеличенное изображение
  }

  return (
    <div className="products" id="product-list"> {/* ✅ ДОБАВИЛ `className="products"` */}
      {products.map((product, index) => (
        <div className="product" key={index}>
          <img
            src={product.image}
            alt={product.name}
            onClick={() => handleImageClick(product.image)}
            className="product-image"
          />
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

      {/* Модальное окно для увеличенного изображения */}
      {expandedImage && (
        <div className="image-modal" onClick={closeExpandedImage}>
          <img src={expandedImage} alt="Expanded" className="expanded-image" />
        </div>
      )}
    </div>
  );
}