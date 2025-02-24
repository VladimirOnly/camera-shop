const nodemailer = require("nodemailer");

module.exports = async function (req, res) {
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
            user: "tvůj-email@gmail.com",
            pass: "tvoje-heslo", // Используй "App Password" в Google
        },
    });

    try {
        await transporter.sendMail({
            from: `"iseeyou24.cz" <tvůj-email@gmail.com>`,
            to: "tvůj@email.com",
            subject: "Nová zpráva z webu",
            text: `Jméno: ${name}\nE-mail: ${email}\nZpráva:\n${message}`,
        });

        return res.status(200).json({ success: "Zpráva byla úspěšně odeslána!" });
    } catch (error) {
        return res.status(500).json({ error: "Chyba při odesílání e-mailu." });
    }
};
