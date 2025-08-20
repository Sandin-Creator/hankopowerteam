import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import instagramRouter from "./server/instagram.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

// API route
app.use("/api/instagram", instagramRouter);

// Static site
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Hanko Powerteam running on http://localhost:${port}`)
);
