const express = require("express");
const mongoose = require("mongoose");
const { connectDb, urlModel } = require("./db");

const app = express();
const urlRegex = new RegExp(
  "^((https?|ftp|smtp)://)?(www.)?[a-z0-9]+.[a-z]+(/[a-zA-Z0-9#]+/?)*$"
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok");
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;

  if (!urlRegex.test(url))
    return res.status(400).send({ error: "invalid url" });


    try {
    const instance = new urlModel({ full: url });
    const { full: original_url, short: short_url } = await instance.save();

    res.send({ original_url, short_url });
  } catch (error) {
    res.status(500);
  }
});

app.get("/api/shorturl/:short", async (req, res) => {
  const { short } = req.params;

  try {
    const record = await urlModel.findOne({ short });

    if (record?.full === undefined)
      return res.send({ error: "url not found" }).status(404);

    res.redirect(record.full);
  } catch (error) {
    res.status(500);
    console.error(error);
  }
});

connectDb().then(() => {
  app.listen(4000, () => {
    console.log("server up");
  });
});
