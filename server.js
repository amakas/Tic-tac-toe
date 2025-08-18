import express from "express";
import cors from "cors";
import path from "path";
const app = express();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use("/sounds", express.static(path.join(__dirname, "../sounds")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
