const request = require("postman-request");
const forcast = function (address, callback, unit = "f") {
  const [long, lat] = address;
  const url = `http://api.weatherstack.com/current?access_key=4c796ab66a099b13989e8b5df07aa497&query=${lat},${long} 
  }&units=${unit}`;
  console.log(url);
  request({ url, json: true }, function (_err, res) {
    const data = res?.body;
    if (!data)
      return callback({ err: "Can't connect to the weather sever" }, undefined);

    if (data.error) return callback(data.error, undefined);
    // return;
    if (data)
      callback(undefined, {
        current: data.current,
        unit: data.request.unit,
        localTime: data.location.localtime,
      });
  });
};
// forcast([-3.703583, 40.416705], (err, res) => {
//   if (err) return console.log(err);
//   if (res) {
//     console.log(res.current, res.unit, res.localTime);
//   }
// });
module.exports = forcast;
