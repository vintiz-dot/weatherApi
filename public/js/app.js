const current = document.getElementById("weather");
const spin = document.getElementById("spin");

document.getElementById("submit").addEventListener("click", function (x) {
  x.preventDefault();
  current.innerHTML = "";
  spin?.classList.remove("hidden");
  const address = document.querySelector("#input").value;
  document.querySelector("#input").value = "";
  //   if (!address) return error();
  fetch(`/weather?address=${address}&units=metrics`).then((res) => {
    res.json().then((data) => {
      if (data.err) return displayError(data);
      displayWeather(data, data.region || address.toUpperCase());
    });
  });
});

const error = function () {
  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML("afterbegin", `<p>Invalid Search Input</p>`);
};
const displayWeather = function (data, address) {
  const date = new Date(data.time).toDateString();
  const time = new Date(data.time).toLocaleTimeString();

  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML(
    "afterbegin",
    `<br></br>
    <p>The weather forcast for ${address} is ${data.weatherDescription}. The current temperature is ${data.currentTemperature} ${data.units}. It feels like ${data.feelsTemperature} ${data.units} outside. <br> <br>The minimium temperature is ${data.minTemp} ${data.units} and the maximium temperature is ${data.maxTemp} ${data.units}, current humidity is ${data.humidity}<br> <br>The air quality is ${data.airPollution}<br> <br>This weather forcast was retrived on ${date} at ${time} your local time</p>`
  );
};

const displayError = function (data) {
  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML("afterbegin", `<p>${data.err}</p>`);
};

mapboxgl.accessToken =
  "pk.eyJ1IjoidmludGl6IiwiYSI6ImNsN3E5Z2lzejAzYTQzcHNhOG14czR6aXQifQ.XuWMJW9fOdC59dGbIeR9Fg";
const map = new mapboxgl.Map({
  container: "map", // Specify the container ID
  style: "mapbox://styles/mapbox/outdoors-v11", // Specify which map style to use
  center: [-122.43877, 37.75152], // Specify the starting position [lng, lat]
  zoom: 11.5, // Specify the starting zoom
});
let lng;
let lat;

map.on("click", (event) => {
  // When the map is clicked, set the lng and lat constants
  // equal to the lng and lat properties in the returned lngLat object.
  lng = event.lngLat.lng;
  lat = event.lngLat.lat;
  console.log(`${lng}, ${lat}`);
});
