const express = require("express");
const app = express();

const db = require("./db");

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Irakasle Koadernoa API working 🚀");
});

// TEST DB CONNECTION
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
