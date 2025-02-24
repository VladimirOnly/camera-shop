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
