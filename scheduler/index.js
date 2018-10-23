require("now-env");
const cron = require("node-cron");
const fetch = require("node-fetch");
const express = require("express");

const app = express();

const postReport = async () => {
  const response = await fetch(process.env.REPORT_URL, {
    headers: { puntsecret: process.env.PUNT_SECRET }
  });
  console.log(response.status);
};

// cron.schedule(
//   "0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57 * * * * *",
//   () => postReport()
// );

cron.schedule("0 6 * 9-12 2", () => postReport());

app.listen(3128);
