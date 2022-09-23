const http = require("http");
const { loadPlanetsData } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");

const app = require("./app");
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsData(); // this is to pre-populate the data
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();
