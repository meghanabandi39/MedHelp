const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());

// MONGO CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/medhelp")
  .then(() => console.log("✔ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ DB Connection Error:", err));


// USER MODEL
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String
}));


// MEDICINE MODEL (UPDATED)
const Medicine = mongoose.model("Medicine", new mongoose.Schema({
  name: String,
  expiry: String,
  quantity: String,
  description: String,
  category: String,

  // NEW FIELDS
  location: String,
  phone: String,

  donor: { type: String, default: "Anonymous" }
}));


// SIGNUP ROUTE
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ error: "Email already exists" });

  await User.create({ name, email, password });
  res.json({ success: true, message: "Account created successfully!" });
});


// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ error: "User not found" });

  if (password !== user.password)
    return res.json({ error: "Incorrect password" });

  res.json({ success: true, message: "Login successful!" });
});


// ADD MEDICINE ROUTE (NOW SAVES LOCATION + PHONE)
app.post("/api/add-medicines", async (req, res) => {
  try {
    await Medicine.create(req.body);
    res.json({ success: true, message: "Medicine added successfully!" });
  } catch (err) {
    console.log(err);
    res.json({ error: "Failed to add medicine" });
  }
});


// GET ALL MEDICINES ROUTE
app.get("/api/get-medicines", async (req, res) => {
  const meds = await Medicine.find();
  res.json(meds);
});


// DELETE MEDICINE ROUTE
app.delete("/api/delete-medicine/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Medicine deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete medicine" });
  }
});


// START SERVER
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
