require("dotenv").config();
const request = require("postman-request");
function geocode(address, callback) {
  const urlParamsObj = {
    limit: 1,
    access_token: process.env.geocodekey,
  };
  const urlParam = new URLSearchParams(urlParamsObj);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?${urlParam}`;

  request({ url, json: true }, function (err, res) {
    const data = res?.body;
    if (err) {
      callback(
        {
          err: `Unable to make connection with the location server<br><br>Check your internet connection and try again `,
        },
        undefined
      );
      return;
    }
    if (!data?.features[0]?.center) {
      callback(
        { err: `Location not found, please refine your search` },
        undefined
      );
      return;
    }
    if (data.features[0].center) {
      return callback(undefined, data.features[0]);
    }
  });
}

module.exports = geocode;
