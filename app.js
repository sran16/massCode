import fs from "fs";

import express from "express";
import session from "express-session";
import https from "https";
import cors from "cors";
import "dotenv/config";
import v1Router from "./routes/v1.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: ["http://localhost:5500"], credentials: true }));

app.use("/v1", v1Router);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ msg: "Ton JWT est invalide !" });
  }

  next(err);
});

const port = 3010;

app.use((err, req, res, next) => {
  res.status(err.status).json({ message: err.message });
});

// run the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
