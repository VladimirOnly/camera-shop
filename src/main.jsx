import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // <-- Проверь, что импорт идёт из .jsx

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);



document.getElementById("contactForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    const responseMessage = document.getElementById("formResponse");

    try {
        const response = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            responseMessage.textContent = "Děkujeme! Vaše zpráva byla odeslána.";
            responseMessage.style.color = "green";
            this.reset();
        } else {
            throw new Error(result.error || "Chyba při odesílání zprávy.");
        }
    } catch (error) {
        responseMessage.textContent = error.message;
        responseMessage.style.color = "red";
    }
});

const sheetUrl = 'https://docs.google.com/spreadsheets/d/1Y423RJnyWCGu2UFceA5TWej1FufDx8lA/gviz/tq?tqx=out:json';

async function loadProducts() {
    const response = await fetch(sheetUrl);
    const text = await response.text();
    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;
    let productsHtml = '';
    rows.forEach(row => {
        const [name, description, price, image] = row.c.map(cell => cell ? cell.v : '');
        productsHtml += `
      <div class="product">
        <img src="${image}" alt="${name}">
        <h2>${name}</h2>
        <p class="short-desc">${description.substring(0, 100)}...</p>
        <p class="full-desc" style="display:none;">${description}</p>
        <button class="toggle-desc">Rozbalit</button>
        <p><strong>Cena: ${price} Kč</strong></p>
        <button class="contact-btn">Kontaktovat</button>
      </div>
    `;
    });
    document.getElementById('product-list').innerHTML = productsHtml;
    document.querySelectorAll('.toggle-desc').forEach(button => {
        button.addEventListener('click', function () {
            const parent = this.parentElement;
            const fullDesc = parent.querySelector('.full-desc');
            const shortDesc = parent.querySelector('.short-desc');
            if (fullDesc.style.display === 'none') {
                fullDesc.style.display = 'block';
                shortDesc.style.display = 'none';
                this.textContent = 'Skrýt';
            } else {
                fullDesc.style.display = 'none';
                shortDesc.style.display = 'block';
                this.textContent = 'Rozbalit';
            }
        });
    });
}

loadProducts();

document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = new URLSearchParams(formData).toString();
    const sheetSubmitUrl = 'https://script.google.com/macros/s/1UruaN0PZBpOvwLUmJXqfC_MseBnblj26rpMIKkaM8-I/exec';
    try {
        const response = await fetch(sheetSubmitUrl, {
            method: 'POST',
            body: data,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const result = await response.text();
        document.getElementById('formResponse').innerText = 'Zpráva úspěšně odeslána!';
    } catch (error) {
        document.getElementById('formResponse').innerText = 'Chyba při odesílání zprávy!';
    }
});
