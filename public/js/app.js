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
