const current = document.getElementById("weather");
const spin = document.getElementById("spin");

document.getElementById("submit").addEventListener("click", function (x) {
  x.preventDefault();
  spin?.classList.remove("hidden");
  const address = document.querySelector("#input").value;
  document.querySelector("#input").value = "";

  fetch(`/weather?address=${address}&unit=f`).then((res) => {
    res.json().then((data) => {
      if (data.err) return displayError(data);
      displayWeather(data);
    });
  });
});

const displayWeather = function (data) {
  const date = new Date(data.time).toDateString();
  const time = new Date(data.time).toLocaleTimeString();
  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML(
    "afterbegin",
    `<p>The weather forcast for ${data.region} is ${data.weatherDescription}. The current temperature is ${data.currentTemperature} ${data.unit}. It feels like ${data.feelsTemperature} ${data.unit} outside. <br> This weather forcast was retrived on ${date} at ${time}</p><br><br>`
  );
};

const displayError = function (data) {
  current.innerHTML = "";
  spin.classList.add("hidden");
  current.insertAdjacentHTML("afterbegin", `<p>${data.err}</p>`);
};
