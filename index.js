const express = require("express");
require("dotenv").config();
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Marine Porret",
  key: process.env.MAILGUN_PRIVATE_API_KEY,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.post("/form", async (req, res) => {
  try {
    const { firstname, lastname, email, message } = req.body;
    const messageData = {
      from: `${firstname} ${lastname} <${email}>`,
      to: "marine.porret@gmail.com",
      subject: "TripAdvisor Form",
      text: message,
    };

    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log(response);

    res.status(200).json({ message: "mail envoyé" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server online on ${PORT}`);
});
