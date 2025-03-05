import React, { useEffect, useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);
  const [notification, setNotification] = useState("");

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
          price: parseFloat(row.c[2]?.v || 0),
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

  function toggleDescription(index, event) {
    if (event.target.tagName.toLowerCase() === "img") return;
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
    setCart([...cart, product]);
    showNotification(`${product.name} byl přidán do košíku!`);
  }

  function removeFromCart(index) {
    setCart(cart.filter((_, i) => i !== index));
  }

  function showNotification(message) {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  }

  const totalPrice = cart.reduce((sum, product) => sum + product.price, 0);

  return (
    <div>
      {/* 🔥 Уведомление */}
      {notification && <div className="notification">{notification}</div>}

      <h2>Produkty</h2>
      <div className="products">
        {products.map((product, index) => (
          <div
            className={`product ${product.expanded ? "expanded" : ""}`}
            key={index}
            onClick={(e) => toggleDescription(index, e)}
          >
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
            {/*<p*/}
            {/*  className="full-desc"*/}
            {/*  style={{*/}
            {/*    maxHeight: product.expanded ? "500px" : "0px",*/}
            {/*    overflow: "hidden",*/}
            {/*    transition: "max-height 0.3s ease-in-out",*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {product.description}*/}
            {/*</p>*/}
            <p className="full-desc">
              {product.description}
            </p>
            {/*<p*/}
            {/*  className="full-desc"*/}
            {/*  style={{*/}
            {/*    maxHeight: product.expanded ? "200px" : "0px",*/}
            {/*    overflowY: product.expanded ? "auto" : "hidden",*/}
            {/*    transition: "max-height 0.3s ease-in-out",*/}
            {/*  }}*/}
            {/*>*/}
            {/*  {product.description}*/}
            {/*</p>*/}
            <p>
              <strong>Cena: {product.price} Kč</strong>
            </p>
            <button className="add-to-cart" onClick={(e) => { e.stopPropagation(); addToCart(product); }}>
              Přidat do košíku
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Корзина */}
      {cart.length > 0 && (
        <div className="cart">
          <h2>🛒 Košík</h2>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - {item.price} Kč
                <button className="remove-btn" onClick={() => removeFromCart(index)}>
                  ❌ Odebrat
                </button>
              </li>
            ))}
          </ul>
          <p><strong>Celková cena: {totalPrice} Kč</strong></p>
        </div>
      )}

      {expandedImage && (
        <div className="image-modal" onClick={closeExpandedImage}>
          <img src={expandedImage} alt="Expanded" className="expanded-image" />
        </div>
      )}
    </div>
  );
}
