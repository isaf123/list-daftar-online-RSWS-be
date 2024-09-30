import express from "express";
import {
  getJumlahJanjiPoli,
  dataRuangan,
  grafikPasien,
} from "../controller/janjipoli.js";
const router = express.Router();

router.post("/data", getJumlahJanjiPoli);
router.get("/ruangan", dataRuangan);
router.post("/grafik-pasien", grafikPasien);

export default router;
