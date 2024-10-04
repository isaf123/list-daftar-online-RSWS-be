import dotenv from "dotenv";
import md5 from "md5";
import { dbPg } from "../config.js";
import jwt from "jsonwebtoken";
dotenv.config();

export async function loginUser(req, res, next) {
  try {
    const { username, password } = req.body;
    const hash = md5(password);
    const query = `SELECT nama_pemakai,psw FROM loginpemakai_k WHERE nama_pemakai='${username}' and psw='${hash}'`;
    const result = await dbPg(query);

    if (!result.length)
      return res.status(401).send("password atau username salah");
    const { nama_pemakai, psw } = result[0];
    const token = jwt.sign(
      { nama_pemakai, psw },
      process.env.TOKEN_KEY || "secret"
    );

    return res.json(token);
  } catch (error) {
    next(error);
  }
}

export async function keepLogin(req, res, next) {
  try {
    const { token } = req.query;

    const decode = jwt.decode(token, { complete: true });
    const { nama_pemakai, psw } = decode.payload;
    const query = `SELECT nama_pemakai,psw FROM loginpemakai_k WHERE nama_pemakai='${nama_pemakai}' and psw='${psw}'`;
    const result = await dbPg(query);
    if (!result.length) return res.status(401).send("unauthorized");
    return res.status(200).send("authorized");
  } catch (error) {
    next(error);
  }
}
