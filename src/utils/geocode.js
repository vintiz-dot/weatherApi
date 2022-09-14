const request = require("postman-request");
function geocode(address, callback) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?limit=1&access_token=pk.eyJ1IjoidmludGl6IiwiYSI6ImNsN3E5Z2lzejAzYTQzcHNhOG14czR6aXQifQ.XuWMJW9fOdC59dGbIeR9Fg`;

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
