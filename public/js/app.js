const current = document.getElementById("weather");
const spin = document.getElementById("spin");
const btnSumit = document.getElementById("submit");
const mapObj = document.getElementById("map");
const msg = {
  display: `Sorry we could not fetch the weather information at this time. <br> Check your internet connection and try again`,
  state: true,
};
const error = function (msg = `<p>Invalid Search Input</p>`) {
  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML("afterbegin", msg);
};
const displayWeather = function (data, address) {
  const date = new Date(data.time).toDateString();
  const time = new Date(data.time).toLocaleTimeString();
  if (!data.weatherDescription) return error(data.err);
  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML(
    "afterbegin",
    `<br></br>
    <p>The weather forcast for ${address} is ${data.weatherDescription}. The current temperature is ${data.currentTemperature} ${data.units}. It feels like ${data.feelsTemperature} ${data.units} outside. <br> <br>The minimium temperature is ${data.minTemp} ${data.units} and the maximium temperature is ${data.maxTemp} ${data.units}, current humidity is ${data.humidity}<br> <br>The air quality is ${data.airPollution}<br> <br>This weather forcast was retrived on ${date} at ${time} your local time</p>`
  );
};

// const displayError = function (data) {
//   current.innerHTML = "";
//   spin.classList.add("hidden");
//   current.classList.remove("hidden");
//   current.insertAdjacentHTML("afterbegin", `<p>${data}</p>`);
// };

getPosition()
  .then((locate) => {
    const { latitude, longitude } = locate.coords;
    mapboxgl.accessToken =
      "pk.eyJ1IjoidmludGl6IiwiYSI6ImNsN3E5Z2lzejAzYTQzcHNhOG14czR6aXQifQ.XuWMJW9fOdC59dGbIeR9Fg";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/outdoors-v11",
      center: [longitude, latitude],
      zoom: 15,
    });
    let lat;
    let lng;
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        zoom: 15,
        placeholder: "Enter Your Location",
        mapboxgl: mapboxgl,
        marker: { draggable: true },
      })
    );

    map.on("click", (event) => {
      current.innerHTML = "";
      btnSumit.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
      btnSumit.classList.remove("hidden");
      lon = event.lngLat.lng;
      lat = event.lngLat.lat;
      let address = [lon, lat];
      if (!address.length === 2) return error();
      btnSumit.disabled = false;
      btnSumit.addEventListener("click", function (x) {
        x.preventDefault();

        mapObj.classList.add("hidden");
        spin?.classList.remove("hidden");
        fetch(`/weather?address=${address}&units=metric`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Something went wrong");
            }
            return response.json();
          })
          .then((data) => {
            if (data.err) {
              console.log("data", data);
              // return displayError(data);
            }
            displayWeather(data, data.region);
            msg.state = false;
            current.scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline: "nearest",
            });
          })
          .catch((err) => {
            if (err?.name !== "SyntaxError") {
              return error(err.message);
            }
            // console.log("err", error);
          })
          .finally(() => {
            spin?.classList.add("hidden");
            address = "";
            btnSumit.classList.add("hidden");
            mapObj.classList.remove("hidden");
            if (msg.state) error(msg.display);
          });
      });
    });
  })
  .catch((error) => {
    {
      error(error.message);
    }
  });

function getPosition() {
  return new Promise(function (resolve, error) {
    navigator.geolocation.getCurrentPosition(resolve, error);
  });
}
