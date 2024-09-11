import express from "express";
import cors from "cors";
import { getJumlahJanjiPoli, dataRuangan, grafikPasien } from "./controller.js";
const app = express();

const PORT = 7320;
app.use(express.json());
app.use(cors());

app.post("/data", getJumlahJanjiPoli);
app.get("/ruangan", dataRuangan);
app.post("/grafik-pasien", grafikPasien);
app.get("/", (req, res) => {
  res.send("GET API POSTGREE");
});

// app.use("/", router);
app.listen(PORT, () => {
  console.log("API RUNNING 7320");
});
