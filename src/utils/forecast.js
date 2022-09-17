require("dotenv").config();
const request = require("postman-request");
const forcast = function (address, callback, units = "metric") {
  // const [lon, lat] = address;
  const [lon, lat] = address;
  const paramsOBJ = {
    lat,
    lon,
    appid: process.env.forcastkey,
    units,
  };

  const searchParam = new URLSearchParams(paramsOBJ);

  const url = `https://api.openweathermap.org/data/2.5/weather?${searchParam}`;
  const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?${searchParam}`;

  // console.log("url", airPollutionUrl);

  request({ url, json: true }, function (_err, res) {
    const data = res?.body;
    if (!data)
      return callback(
        { err: "Can't connect to the weather server" },
        undefined
      );

    if (data.error) return callback(data.error, undefined);
    if (data) {
      request({ url: airPollutionUrl, json: true }, function (err1, res1) {
        return airPollutionIndex(err1, res1, data, callback);
      });
    }
  });
};

const airPollutionIndex = function (err, res, data, callback) {
  if (err) return callback(undefined, { data });
  if (res) {
    data.airPollution = res.body.list[0].main.aqi;
    return callback(undefined, { data });
  }
};

module.exports = forcast;
