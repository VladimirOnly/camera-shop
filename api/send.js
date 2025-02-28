require("dotenv").config(); // <-- Подключаем .env

const nodemailer = require("nodemailer");

async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Všechna pole jsou povinná." });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        secure: false,
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.sendMail({
            from: `"iseeyou24.cz" <${process.env.EMAIL_USER}>`,
            to: "tvůj@email.com",
            subject: "Nová zpráva z webu",
            text: `Jméno: ${name}\nE-mail: ${email}\nZpráva:\n${message}`
        });

        return res.status(200).json({ success: "Zpráva byla úspěšně odeslána!" });
    } catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ error: "Chyba při odesílání e-mailu." });
    }
}

module.exports = handler;
