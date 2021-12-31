//* requireing node modules

const express = require("express");

const https = require("https");

const bodyParser = require("body-parser");
const res = require("express/lib/response");

//* init application

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

//! setting the ejs engine !

app.set("view engine", "ejs");

//* requireing personal modules

//* variables

const PORT = process.env.PORT || 3000;

const cities = [
  "London",
  "Bucharest",
  "Paris",
  "Medias",
  "Marsella",
  "Rome",
  "Madrid",
  "Barcelona",
  "Dortmund",
  "Leverkusen",
  "Denver",
  "Seville",
  "Barcelona",
  "Lisbon",
  "Valencia",
  "California",
  "Los Angeles",
  "San Francisco",
  "San Diego",
  "Santa Monica",
  "Berlin",
  "Lucerna",
  "Basel",
  "Montreux",
  "Geneva",
];

const searches = [];

const description = [];
const temperature = [];
const maxTemp = [];
const icons = [];

const searchDescription = [];
const searchTemperature = [];
const searchMaxTemp = [];
const searchIcons = [];

let locationsLength = 1;
let lengthPerRows = 10;

let counter = 0;

//* getters and setters

app.get("/home", async (req, res) => {
  if (searches.length === 10) {
    searches = [];
    searchDescription = [];
    searchIcons = [];
    searchMaxTemp = [];
    searchTemperature = [];
  }

  if (counter === 0) {
    cities.forEach((city) => {
      const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3e40d745b1e6ca29543af32c5dfc3005&units=metric`;

      https.get(URL, async (response) => {
        response.on("data", async (data) => {
          let weatherData = await JSON.parse(data);
          let weatherDescription = await weatherData.weather[0].description;
          let weatherTemperature = await weatherData.main.temp.toFixed(1);
          let average = await weatherData.main.temp_max.toFixed(1);
          let iconData = await weatherData.weather[0].icon;

          description.push(weatherDescription);
          temperature.push(weatherTemperature);
          maxTemp.push(average);
          icons.push(iconData);
        });
      });
    });

    counter++;
  }

  setTimeout(() => {
    res.render("home", {
      locations: cities,
      weather: description,
      temperature: temperature,
      maxTemp: maxTemp,
      icon: icons,
      link: cities,
      locationsLength: locationsLength,
      lengthPerRows: lengthPerRows,
    });
  }, 500);
});

app.get("/cities/:city", (req, res) => {
  lengthPerRows = 10;

  const cityName = req.params.city;

  cities.forEach((city) => {
    if (city.toLowerCase().replace(" ", "-") === cityName.toLowerCase()) {
      res.render("cities", {
        city: city,
        temp: temperature[cities.indexOf(city)],
      });

      return;
    }
  });

  searches.forEach((search) => {
    if (search.toLowerCase().replace(" ", "-") === cityName.toLowerCase()) {
      res.render("cities", {
        city: search,
        temp: searchTemperature[searches.indexOf(search)],
      });

      return;
    }
  });

  res.render("404");
});

app.get("/:param", (req, res) => {
  res.render("404");
});

app.post("/home", (req, res) => {
  cityName = req.body.city;

  searches.push(cityName);

  searches.forEach((search) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=3e40d745b1e6ca29543af32c5dfc3005&units=metric`;

    https.get(URL, (response) => {
      response.on("data", async (data) => {
        let weatherData = await JSON.parse(data);
        let weatherDescription = await weatherData.weather[0].description;
        let weatherTemperature = await weatherData.main.temp.toFixed(1);
        let average = await weatherData.main.temp_max.toFixed(1);
        let iconData = await weatherData.weather[0].icon;

        searchDescription.push(weatherDescription);
        searchTemperature.push(weatherTemperature);
        searchMaxTemp.push(average);
        searchIcons.push(iconData);
      });
    });
  });

  setTimeout(() => {
    res.redirect(`/cities/${cityName.toLowerCase()}`);
  }, 500);
});

app.post("/more-cards", (req, res) => {
  let btnValue = req.body.btn;

  if (btnValue === "less") {
    lengthPerRows = 10;
  } else {
    lengthPerRows += 10;
  }

  res.redirect("/home");
});

app.listen(PORT, () => {
  console.log(`You are listening on port ${PORT}`);
});

//* functions
