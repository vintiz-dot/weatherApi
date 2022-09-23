require("dotenv").config();
const request = require("postman-request");
const forcast = function (address, callback, units = "metric") {
  const [lon, lat] = address.split(",");
  const paramsOBJ = {
    lat: +lat,
    lon: +lon,
    appid: process.env.forcastkey,
    units,
  };

  const searchParam = new URLSearchParams(paramsOBJ);

  const url = `${process.env.weatherLink}${searchParam}`;
  const airPollutionUrl = `${process.env.airPollution}${searchParam}`;

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
  if (res.body.list) {
    data.airPollution = res.body.list[0].main.aqi;
    return callback(undefined, { data });
  }
  return callback(undefined, { data });
};

module.exports = forcast;
