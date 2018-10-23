const mongoose = require("mongoose");
const { Schema } = require("mongoose");

mongoose.Promise = global.Promise;
const mongo_url = process.env.MONGO_URL;

console.log(mongo_url)

mongoose.connect(
  mongo_url,
  { useNewUrlParser: true }
);

const OwnerSchema = new Schema({
  id: Schema.Types.String,
  teamNames: [Schema.Types.String],
  ownerName: Schema.Types.String
});

const Owner = mongoose.model("owners", OwnerSchema);

module.exports = {
  Owner: Owner
};
