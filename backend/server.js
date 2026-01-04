import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Serve public folder (CSS, JS, Images, Fonts)
app.use(express.static(path.join(__dirname, "public")));

// =============================
// Serve index.html from root
// =============================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});
app.get("/basic-tailoring-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../basic.html"));
});
app.get("/advance-tailoring-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../standard.html"));
});
app.get("/advance-fashion-design-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../premium.html"));
});
app.get("/profressional-diplomo-fashion-design-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../master.html"));
});
app.get("/aari-embroidery-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../basic_aari.html"));
});
app.get("/basic-blouse-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../basic_blouse.html"));
});
app.get("/advance-blouse-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../advance_blouse.html"));
});
app.get("/kameez-salwar-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../kameez_salwar.html"));
});
app.get("/advance-kameez-salwar-course", (req, res) => {
    res.sendFile(path.join(__dirname, "../advance_kameez.html"));
});
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../about.html"));
});


// =============================
// MongoDB Connection
// ============================
mongoose
  .connect("mongodb+srv://root:12345@sridev.avbkl1u.mongodb.net/?appName=sridev")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Mongo Error:", err));

// =============================
// Schema & Model
// =============================
const userSchema = new mongoose.Schema({
    name: String,
    number: String,
    age: String,
    mode: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


const User = mongoose.model("User", userSchema);

// =============================
// Handle Form Submit
// =============================
app.post("/submit", async (req, res) => {
    const { name, number, age, mode } = req.body;
    try {
        // Save to MongoDB
        const user = new User({ name, number, age, mode });
        await user.save();
        // Save to record.txt
        const entry =
            `Name: ${name}, Number: ${number}, Age: ${age}, Mode: ${mode}, Date: ${new Date().toLocaleString()}\n`;

        fs.appendFile(path.join(__dirname, "record.txt"), entry, (err) => {
            if (err) console.log("File write error:", err);
        });
        // Send success page
        res.sendFile(path.join(__dirname, "..", "success.html"));
    } catch (error) {
        console.log("Error:", error);
        res.status(500).send("Error saving data");
    }
});

// app.get("/submit", (req, res) => {
//     res.sendFile(path.join(__dirname, "../success.html"));
// });

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../error.html"));
});

// =============================
// Start Server
// =============================

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
