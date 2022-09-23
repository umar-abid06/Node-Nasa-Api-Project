const launchesMongo = require("./launches.mongo");
const planetsMongo = require("./planets.mongo");

// const launches = new Map();

// let latestFlightNumber = 100;
const DEFAULT_LAUNCH_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2023"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

async function getAllLaunches() {
  // return Array.from(launches.values());

  return await launchesMongo.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planetsMongo.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found!");
  }
  await launchesMongo.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       success: true,
//       upcoming: true,
//       customers: ["UMAR", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

const scheduleNewLaunch = async (launch) => {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["Umar", "Nasa"],
    flightNumber: newFlightNumber,
  });
  saveLaunch(newLaunch);
};

async function getLatestFlightNumber() {
  const latestLaunch = await launchesMongo.findOne().sort("-flightNumber");

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}
async function existLaunchWithId(launchId) {
  return await launchesMongo.findOne({
    flightNumber: launchId,
  });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesMongo.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.ok === 1 && aborted.nModified === 1;
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;
}

module.exports = {
  existLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
