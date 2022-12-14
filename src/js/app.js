require("dotenv").config();
const mapboxgl = require("mapbox-gl");
const path = require("path");
const express = require("express");
const hbs = require("hbs");
const app = express();
const port = process.env.PORT || 3000;
const geocode = require("../../src/utils/geocode");
const forcast = require("../../src/utils/forecast");
const { env } = require("process");

const publicFolder = path.join(__dirname, "../../public");
const viewPath = path.join(__dirname, "../../templates/views");
const partialsPath = path.join(__dirname, "../../templates/partials");

app.use(express.static(publicFolder));
app.set("view engine", "hbs");
app.set("views", viewPath);

hbs.registerPartials(partialsPath);

app.get("/", (_req, res) => {
  res.render("index", {
    title: "Weather",
    method: "payment",
  });
});

app.get("/about", (_req, res) => {
  res.render("about", {
    title: "About Page",
    aboutMe: `This is a native web app designed to make your life easy`,
  });
});

app.get("/help", (_req, res) => {
  res.render("help", { msg: `Help has been rendered`, title: "Help Page" });
});

app.get("/weather", (req, res) => {
  // if (!req.query.address) {
  //   return res.send({ data: `<h1>You must include an address</h1>` });
  // }

  forcast(
    req.query.address,
    function (err, resp = {}) {
      if (err || !resp.data.weather) return res.send(err);

      const weather_descriptions = resp.data.weather[0].description;
      const unit = req.query.units;
      const time = new Date();
      const humidity = resp.data.main.humidity;
      const {
        temp: temperature,
        feels_like: feelslike,
        temp_min: minTemp,
        temp_max: maxTemp,
      } = resp.data.main;
      const airIndex = {
        1: "Good",
        2: "Fair",
        3: "Moderate",
        4: "Poor",
        5: "Very Poor",
      };
      res.send({
        humidity,
        minTemp,
        maxTemp,
        weatherDescription: `${weather_descriptions}`,
        currentTemperature: `${temperature}`,
        feelsTemperature: `${feelslike}`,
        units: `${
          unit === "metric" ? "??C" : unit === "imperial" ? "??F" : "??K"
        }`,
        region: `${resp.data.name}`,
        time,
        airPollution:
          Object.values(airIndex)[resp.data.airPollution - 1] ||
          "Unavalable at this point",
      });
    },
    req.query.units
  );
});

app.get("/weather/*", (_req, res) => {
  res.send(`<p>Please read the documentation</p>`);
});

app.get("/*", (_req, res) => {
  res.render("about", {
    title: "404 Page",
    errorMessage: `This is a native web app designed to make your life easy. The page you are looking for doesn't exist`,
  });
});

app.listen(port, () => {
  console.log("server started sucessfully on port ", `${port}`);
});
