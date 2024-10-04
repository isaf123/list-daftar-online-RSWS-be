import pgPromise from "pg-promise";
import dotenv from "dotenv";
dotenv.config();

const pgp = pgPromise();
const db = pgp(process.env.DB_URL);
// const db2 = pgp(process.env.DB_URL2);

export const dbPg = async (query) => {
  try {
    return await db.any(query).catch((error) => console.log(error));
  } catch (error) {
    return error;
  }
};

// export const dbLocal = async (query) => {
//   try {
//     return await db2.any(query).catch((error) => console.log(error));
//   } catch (error) {
//     return error;
//   }
// };
