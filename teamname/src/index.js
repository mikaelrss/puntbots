require("now-env");
const { send, json } = require("micro");
const { Owner } = require("./mongoconnector");

const super_secret = process.env.PUNT_SECRET;

const validRequest = req => {
  return req.headers.puntsecret === super_secret;
};

const findTeamName = async (req, res) => {
  if (!validRequest(req)) return send(res, 401, "Unauthorized");
  const body = await json(req);
  const owner = await Owner.findOne({ id: body.id }).exec();

  return send(res, 200, { name: owner.teamNames.slice(-1)[0] });
};

module.exports = {
  default: findTeamName
};
