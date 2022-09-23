const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://nasa-node-api:napF61CAMX1Tseie@nasa-node-api.3uxbium.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB is ready!");
});
mongoose.connection.on("error", (error) => {
  console.error(error);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}
module.exports = {
  mongoConnect,
  mongoDisconnect,
};
