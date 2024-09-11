import pgPromise from "pg-promise";
import dotenv from "dotenv";
import { arrDate, totalDate, threeMonthBack } from "./utils/date.js";
import { queryRuangan, ruanganAnd } from "./utils/ruangan.js";
dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DB_URL);

export async function getJumlahJanjiPoli(req, res) {
  try {
    const { tgljanji, page = 1, sortTarget = "total" } = req.query;
    const { ruangan } = req.body;
    const skip = (page - 1) * 15;
    const nextDate = arrDate(tgljanji);
    const totalPasien = totalDate(tgljanji);

    const query = `
      SELECT
      r.ruangan_nama,
      ${nextDate.query},
      ${totalPasien.query}
      FROM buatjanjipoli_t b
      JOIN ruangan_m r ON b.ruangan_id = r.ruangan_id
      ${ruangan ? queryRuangan(ruangan) : ""}
      GROUP BY r.ruangan_nama
      HAVING COUNT(CASE WHEN b.tgljadwal BETWEEN '${
        totalPasien.startDate
      } 00:00:01' AND '${
      totalPasien.endDate
    } 23:59:01' THEN b.ruangan_id END) > 0
      ORDER BY ${sortTarget} DESC
      LIMIT 15
      OFFSET ${skip}
    `;

    const totalDataquery = `
      SELECT COUNT(DISTINCT ruangan_id) 
	    FROM buatjanjipoli_t
	    WHERE tgljadwal BETWEEN '${totalPasien.startDate} 00:00:01' AND '${totalPasien.endDate} 23:59:01'
	    HAVING COUNT(CASE WHEN tgljadwal BETWEEN '${totalPasien.startDate} 00:00:01' AND '${totalPasien.endDate}' THEN ruangan_id END) > 0;`;
    const data = await db.any(query).catch((error) => {
      return console.log("db error");
    });
    const totalData = await db.any(totalDataquery).catch((error) => {
      return console.log("db error");
    });

    const totalPage = totalData.length ? Math.ceil(totalData[0].count / 15) : 1;

    return res.status(200).send({
      result: data,
      range: nextDate.rangeDate,
      totalPage,
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export const dataRuangan = async (req, res) => {
  try {
    const { tgljanji } = req.query;

    const nextDate = arrDate(tgljanji);
    const totalPasien = totalDate(tgljanji);

    const query = `
        SELECT
        r.ruangan_nama
        FROM buatjanjipoli_t b
        JOIN ruangan_m r ON b.ruangan_id = r.ruangan_id
        GROUP BY r.ruangan_nama
        HAVING COUNT(CASE WHEN b.tgljadwal BETWEEN '${totalPasien.startDate} 00:00:01' AND '${totalPasien.endDate} 23:59:01' THEN b.ruangan_id END) > 0
        ORDER BY r.ruangan_nama ASC
      `;

    const data = await db.any(query).catch((error) => {
      return console.log("db error");
    });

    return res.send(data);
  } catch (error) {
    return res.send(error);
  }
};

export const grafikPasien = async (req, res) => {
  try {
    const { mulai, selesai } = req.query;
    const { ruangan } = req.body;
    const date = threeMonthBack(mulai, selesai);

    const query = `
      SELECT DATE(tgljadwal),COUNT(*) AS pasien
      FROM buatjanjipoli_t
      WHERE DATE(tgljadwal) BETWEEN '${date.start} 00:00:01' AND '${date.end} 23:59:01'
      GROUP BY DATE(tgljadwal)
      ORDER BY DATE(tgljadwal)
    `;

    const queryPie = `
      SELECT r.ruangan_nama, COUNT(*) AS perpoli
      FROM buatjanjipoli_t b
      JOIN ruangan_m r ON b.ruangan_id = r.ruangan_id
      WHERE DATE(b.tgljadwal) BETWEEN '${date.start}' AND '${date.end}' ${
      ruangan ? ruanganAnd(ruangan) : ""
    }
      GROUP BY r.ruangan_nama
      ORDER BY perpoli DESC
    `;

    const queryListPoli = `
      SELECT r.ruangan_nama
      FROM buatjanjipoli_t b
      JOIN ruangan_m r ON b.ruangan_id = r.ruangan_id
      WHERE DATE(b.tgljadwal) BETWEEN '${date.start}' AND '${date.end}'
      GROUP BY r.ruangan_nama
      ORDER BY r.ruangan_nama ASC
    `;

    const result = await db.any(query).catch((error) => {
      return console.log("db error");
    });
    const jumlahPoli = await db.any(queryPie).catch((error) => {
      return console.log("db error");
    });
    const listSearchPoli = await db.any(queryListPoli).catch((error) => {
      return console.log("db error");
    });

    const data = result.map((val) => {
      return { date: val.date, pasien: Number(val.pasien) };
    });
    const dataPoli = jumlahPoli.map((val) => {
      return { ruangan: val.ruangan_nama, perpoli: Number(val.perpoli) };
    });

    let sum = 0;
    data.forEach((val) => {
      sum += val.pasien;
    });

    return res.send({ data, sum, dataPoli, listSearchPoli });
  } catch (error) {
    console.log(error);
    return res.send(error);
  }
};
