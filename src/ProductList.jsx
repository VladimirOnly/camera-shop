import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Корзина
  const [expandedImage, setExpandedImage] = useState(null); // Увеличенное изображение

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
          price: parseFloat(row.c[2]?.v || 0), // Преобразуем цену в число
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
    setExpandedImage(imageUrl);
  }

  function closeExpandedImage() {
    setExpandedImage(null);
  }

  function addToCart(product) {
    setCart([...cart, product]); // Добавляем товар в корзину
  }

  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0); // Общая сумма

  return (
    <div>
      <h2>Produkty</h2>
      <div className="products">
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
            <p className="full-desc" style={{ display: product.expanded ? "block" : "none" }}>
              {product.description}
            </p>
            <button className="toggle-desc" onClick={() => toggleDescription(index)}>
              {product.expanded ? "Skrýt" : "Rozbalit"}
            </button>
            <p>
              <strong>Cena: {product.price} Kč</strong>
            </p>
            <button className="add-to-cart" onClick={() => addToCart(product)}>
              Přidat do košíku
            </button>
          </div>
        ))}
      </div>

      {/* Отображение корзины */}
      <div className="cart">
        <h2>Košík</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>{item.name} - {item.price} Kč</li>
          ))}
        </ul>
        <p><strong>Celková cena: {totalPrice} Kč</strong></p>
      </div>

      {/* Модальное окно для увеличенного изображения */}
      {expandedImage && (
        <div className="image-modal" onClick={closeExpandedImage}>
          <img src={expandedImage} alt="Expanded" className="expanded-image" />
        </div>
      )}
    </div>
  );
}
