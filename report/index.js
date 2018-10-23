require("now-env");
const fetch = require("node-fetch");

const express = require("express");
const app = express();

const scrape_url = process.env.SCRAPER_URL;
const slack_url = process.env.SLACK_URL;
const super_secret = process.env.PUNT_SECRET;
const team_name_url = process.env.TEAM_NAME_URL;

const getCurrentWeek = async () => {
  const response = await fetch(`${scrape_url}/currentgame`);
  return await response.json();
};

const getTeamName = async teamId => {
  const response = await fetch(team_name_url, {
    headers: {
      puntsecret: process.env.PUNT_SECRET,
      "Content-Type": "application/json"
    },
    method: "POST",
    body: `{"id": ${teamId}}`
  });
  const result = await response.json();
  return result.name;
};

const getSlackText = (teamName, teamRank) => {
  console.log(teamRank)
  return `${teamName} - Rank: ${teamRank} ${
    teamRank === 12 || teamRank === 11 ? "-> :fabiano:" : ""
    }`;
};

const formatSlackMessage = async () => {
  const data = await getCurrentWeek();
  let textResult = [];
  for (const game of data) {
    const homeTeam = await getTeamName(game.homeTeamId);
    const awayTeam = await getTeamName(game.awayTeamId);
    textResult.push(getSlackText(homeTeam, game.homeTeamRank));
    textResult.push(getSlackText(awayTeam, game.awayTeamRank));
  }
  console.log(textResult);

  return textResult;
};

const postToNPISlack = async () => {
  const data = await formatSlackMessage();

  let payload = {
    method: "POST",
    body: `{"text": "${data.join(`\n`)}"}`,
    headers: { "Content-Type": "application/json" }
  };
  const res = await fetch(`${slack_url}`, payload);
  console.log("RES", res.status);
};

app.get("/", async (req, res) => {
  if (req.headers.puntsecret !== super_secret) {
    res.status(401).send("Unauthorized");
    return;
  }
  res.status(200).send(await postToNPISlack());
});

app.listen(3001, () => console.log("Example app listening on port 3000!"));
