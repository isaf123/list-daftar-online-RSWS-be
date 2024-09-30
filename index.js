import express from "express";
import cors from "cors";
import routers from "./router/index.js";
const app = express();

const PORT = 7320;
app.use(express.json());
app.use(cors());

app.use("/", routers.janjiPoliRouter);
app.use("/daftarpoli", routers.daftarPoliRouter);
app.use("/auth", routers.authRouter);
app.get("/", (req, res) => {
  res.send("GET API POSTGREE");
});

// app.use("/", router);
app.listen(PORT, () => {
  console.log("API RUNNING 7320");
});
