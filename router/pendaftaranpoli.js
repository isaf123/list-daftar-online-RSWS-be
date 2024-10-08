import express from "express";
import {
  totalPendaftaran,
  jumlahPoliAktif,
  totalOfflineOnlien,
  tabelJumlahPasien,
  tabelListPasien,
  pasienPulang,
  batalPeriksa,
} from "../controller/pendaftaranpoli.js";
const router = express.Router();

router.get("/total-pasien", totalPendaftaran);
router.get("/jumlahpoli", jumlahPoliAktif);
router.get("/perbandingantotal", totalOfflineOnlien);
router.post("/tabeldaftar", tabelJumlahPasien);
router.get("/tabelpasien", tabelListPasien);
router.get("/pasienpulang", pasienPulang);
router.get("/batal", batalPeriksa);

export default router;
