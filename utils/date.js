export const arrDate = (date) => {
  const arrDate = [];
  const rangeDate = [];

  for (let i = 1; i < 8; i++) {
    const getDate = date ? new Date(date) : new Date();
    getDate.setDate(getDate.getDate() + i);
    const nextDate = getDate.toISOString().split("T")[0];
    arrDate.push(nextDate);
  }

  for (let i = 1; i < 8; i++) {
    const getDate = date ? new Date(date) : new Date();
    getDate.setDate(getDate.getDate() + i);
    const setRangeDate = new Date(getDate).toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    rangeDate.push(setRangeDate);
  }

  const newDate = arrDate.map((val, i) => {
    return `COUNT(CASE WHEN b.tgljadwal BETWEEN '${val} 00:00:01' AND '${val} 23:59:01' THEN b.ruangan_id  END) AS "data${
      i + 1
    }"`;
  });
  rangeDate.push("total");
  return { query: newDate.join(","), rangeDate };
};

export const totalDate = (date) => {
  const getDate = date ? new Date(date) : new Date();

  const nowDate = date ? new Date(date) : new Date();
  getDate.setDate(getDate.getDate() + 7);
  nowDate.setDate(nowDate.getDate() + 1);
  const endDate = getDate.toISOString().split("T")[0];
  const startDate = nowDate.toISOString().split("T")[0];

  return {
    query: `COUNT(CASE WHEN b.tgljadwal BETWEEN '${startDate} 00:00:01' AND '${endDate} 23:59:01' THEN b.ruangan_id  END) AS "total"`,
    startDate,
    endDate,
  };
};

export const threeMonthBack = (mulai, selesai) => {
  const endDate = selesai && mulai ? new Date(selesai) : new Date();
  const startDate = selesai && mulai ? new Date(mulai) : new Date();
  if (!mulai) {
    startDate.setMonth(startDate.getMonth() - 3);
  }

  const start = startDate.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];

  return { start, end };
};
