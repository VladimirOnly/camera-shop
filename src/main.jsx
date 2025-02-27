import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";


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
      <ContactForm />
  </React.StrictMode>
);