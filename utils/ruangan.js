export const queryRuangan = (arr) => {
  const arrRuangan = arr.map((val) => `r.ruangan_nama='${val}'`);

  const query = `WHERE ${arrRuangan.join(" OR ")}`;
  return query;
};

export const ruanganAnd = (arr) => {
  const arrRuangan = arr.map((val) => `r.ruangan_nama='${val}'`);
  const query = `AND (${arrRuangan.join(" OR ")})`;

  return query;
};
