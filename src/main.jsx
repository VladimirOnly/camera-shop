import React, { useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

function ContactForm() {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = new URLSearchParams(formData).toString();
    const sheetSubmitUrl =
      "https://script.google.com/macros/s/AKfycbw2V7LyTcFIilESiHqxoGShHabT8R0mKKYfHVnbzMeFj1gk_r9vcvfob7kYV1CuDqq2/exec";

    try {
      const response = await fetch(sheetSubmitUrl, {
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      await response.text();
      setMessage("✅ Zpráva úspěšně odeslána!");
      event.target.reset(); // Очищаем форму
    } catch (error) {
      setMessage("❌ Chyba při odesílání zprávy!");
    }
  }

  return (
    <section id="contact">
      <h2>Kontaktujte nás</h2>
      <form id="contactForm" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Jméno" required />
        <input type="email" name="email" placeholder="E-mail" required />

        {/* ✅ Здесь исправленный textarea */}
        <textarea
          name="message"
          placeholder="Zpráva"
          required
          ref={textareaRef}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          style={{ minHeight: "120px", resize: "none", overflow: "hidden" }}
        />

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
    <ContactForm />
  </React.StrictMode>
);
