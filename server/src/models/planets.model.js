const path = require("path");
const fs = require("fs");
const parse = require("csv-parse");

// const habitablePlanets = [];
const planetsMongo = require("./planets.mongo");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse.parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
          // habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} habitable planets`);
        // console.log(`${habitablePlanets.length} habitable planets`);
        resolve();
      });
  });
}
async function getAllPlanets() {
  return await planetsMongo.find({});
  // return await habitablePlanets;
}
async function savePlanet(planet) {
  try {
    await planetsMongo.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log(`Could not save a planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
