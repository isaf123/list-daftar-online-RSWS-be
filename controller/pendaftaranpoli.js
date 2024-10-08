import { dbPg } from "../config.js";
import { stripDate } from "../utils/time.js";
import { ruanganAnd } from "../utils/ruangan.js";

export const totalPendaftaran = async (req, res, next) => {
  try {
    const { date } = req.query;
    const getDate = stripDate(date);

    const query = `SELECT COUNT(*) FROM pendaftaran_t WHERE date(tgl_pendaftaran)= '${getDate}'`;
    const result = await dbPg(query);
    const totalPendaftar = Number(result[0].count);
    return res.json(totalPendaftar);
  } catch (error) {
    next(error);
  }
};

export const jumlahPoliAktif = async (req, res, next) => {
  try {
    const { date } = req.query;
    const getDate = stripDate(date);
    const query = `
    SELECT COUNT(DISTINCT ruangan_id) 
    FROM pendaftaran_t 
    WHERE date(tgl_pendaftaran) = '${getDate}'`;

    const result = await dbPg(query);
    const totalPoli = Number(result[0].count);
    return res.json(totalPoli);
  } catch (error) {
    next(error);
  }
};

export const totalOfflineOnlien = async (req, res, next) => {
  try {
    const { date } = req.query;
    const getDate = stripDate(date);
    const query = `
      SELECT 
      COUNT(CASE WHEN date(tgl_pendaftaran)='${getDate}' AND buatjanjipoli_id is NULL THEN 1 ELSE NULL END) AS offline,
      COUNT(CASE WHEN date(tgl_pendaftaran)='${getDate}' AND buatjanjipoli_id is NOT NULL THEN 1 ELSE NULL END) AS online
      FROM pendaftaran_t`;
    const result = await dbPg(query);
    const offline = Number(result[0].offline);
    const online = Number(result[0].online);
    res.json({ offline, online, total: offline + online });
  } catch (error) {
    next(error);
  }
};

export const tabelJumlahPasien = async (req, res, next) => {
  try {
    const { date, page = 1 } = req.query;
    const getDate = stripDate(date);
    const skip = (page - 1) * 10;
    const query = `
    SELECT 
      r.ruangan_nama AS Poli,
      COUNT(CASE WHEN b.buatjanjipoli_id IS NOT NULL THEN b.ruangan_id END) AS ONLINE,
      COUNT(CASE WHEN b.buatjanjipoli_id IS NULL THEN b.ruangan_id END) AS OFFLINE,
      COUNT(*) AS TOTAL
      FROM pendaftaran_t b
      JOIN ruangan_m r ON b.ruangan_id=r.ruangan_id
      WHERE date(b.tgl_pendaftaran) = '${getDate}'

      GROUP BY r.ruangan_nama
      ORDER BY total DESC
      LIMIT 10
      OFFSET ${skip} 
    `;
    const queryCount = `
    SELECT
      COUNT(DISTINCT ruangan_id)
      FROM pendaftaran_t
      WHERE date(tgl_pendaftaran) = '${getDate}'
    `;

    const queryListPoli = `SELECT 
      r.ruangan_nama
      FROM pendaftaran_t b
      JOIN ruangan_m r ON b.ruangan_id=r.ruangan_id
      WHERE date(b.tgl_pendaftaran) = '${getDate}'
      GROUP BY r.ruangan_nama
    `;

    const result = await dbPg(query);
    const total = await dbPg(queryCount);
    const listPoli = await dbPg(queryListPoli);
    const totalPage = Math.ceil(total[0].count / 10);

    res.json({ totalData: total[0].count, totalPage, result, listPoli });
  } catch (error) {
    next(error);
  }
};

export const tabelListPasien = async (req, res, next) => {
  try {
    const { date, page = 1, search } = req.query;
    const getDate = stripDate(date);
    const skip = (page - 1) * 10;
    const query = `
    SELECT 
      n.nama_pasien, 
      b.create_time,
      r.ruangan_nama,
      CASE WHEN b.buatjanjipoli_id IS NOT NULL THEN 'online' ELSE 'offline' END AS daftar,
      b.statusperiksa
      FROM pendaftaran_t b
      JOIN ruangan_m r ON b.ruangan_id=r.ruangan_id
      JOIN pasien_m n ON b.pasien_id=n.pasien_id
      WHERE date(b.tgl_pendaftaran) = '${getDate}'
      ${search ? `AND n.nama_pasien ILIKE '%${search}%'` : ""}
      ORDER BY create_time DESC
      LIMIT 10
      OFFSET ${skip}
    `;
    const queryCount = `SELECT COUNT(*) FROM pendaftaran_t WHERE date(tgl_pendaftaran)= '${getDate}'`;

    const result = await dbPg(query);
    const total = await dbPg(queryCount);
    const totalPage = Math.ceil(total[0].count / 10);

    res.json({ result, totalPage });
  } catch (error) {
    next(error);
  }
};

export const pasienPulang = async (req, res, next) => {
  try {
    const { date } = req.query;
    const getDate = stripDate(date);
    const query = `
    SELECT 
    COUNT(*) 
    FROM pendaftaran_t 
    WHERE date(tgl_pendaftaran)='${getDate}' AND statusperiksa='SUDAH PULANG'
    `;
    const result = await dbPg(query);
    res.json(result[0].count);
  } catch (error) {
    next(error);
  }
};

export const batalPeriksa = async (req, res, next) => {
  try {
    const { date } = req.query;
    const getDate = stripDate(date);
    const query = `
    SELECT
      COUNT(*)
      FROM pendaftaran_t
      WHERE date(tgl_pendaftaran)='${getDate}' AND statusperiksa='BATAL PERIKSA'
    `;
    const result = await dbPg(query);
    res.json(result[0].count);
  } catch (error) {
    next(error);
  }
};
