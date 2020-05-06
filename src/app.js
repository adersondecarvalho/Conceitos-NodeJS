const express = require("express");
const db = require("./db");

const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const weatherData = [];
const weatherStations = [
  {
    id: 1, 
    name:'Santa Maria',
    timezone: 'America/Fortaleza',
    latitude: -29.6842,
    longitude: -53.8069,
    altitude: 113,
  },
  {
    id: 2,
    name: 'Budapest',
    timezone: 'Europe/Budapest',
    latitude: 47.498,
    longitude: 19.0399,
    altitude: 527,
  },
  {
    id: 3,
    name: 'Santiago',
    timezone: 'America/Santiago',
    latitude: -33.4592,
    longitude: -70.6453,
    altitude: 570,
  }
];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `📡 [${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  
  next();

  console.timeEnd(logLabel);
}


app.use(logRequests);

/* Lista todas as estações meteorológicas disponíveis. */
app.get("/weather-stations", (request, response) => {
  
  db.query('SELECT * FROM weather_stations')
  return response.json(weatherStations);
});

/* Lista as informações de uma estação meteorológica, através de seu identificador definido por :id.
Deve retornar um array JSON e status 200. Se a estação não for encontrada, deve retornar status 404. */
app.get("/weather-stations/:id", (request, response) => {
  
  const { id } = request.params;
  
  const stationIndex = weatherStations.findIndex(station => station.id == id);

  if (stationIndex < 0) {
    return response.status(404).json({ error: 'Station not found!'});
  }

  return response.status(200).json(weatherStations[stationIndex]);
});

/* criação de uma nova estação meterológica */
app.post("/weather-stations", (request, response) => {
  const { name, timezone, latitude, longitude, altitude } = request.body;

  const station = {
    id: uuid(),
    name,
    timezone,
    latitude,
    longitude,
    altitude
  };

  weatherStations.push(station);

  return response.json(station);
});

app.post("/weather-data/:id", (request, response) => {
  const { id } =  request.params;
  const { air_temperature, air_humidity, wind_speed, rainfall, moment } = request.body;

  const stationIndex = weatherStations.findIndex(station => station.id == id);

  if(stationIndex < 0 ) return response.status(400).json({ error: 'Station not found!' });

  const datat = {
    id,
    air_temperature, 
    air_humidity, 
    wind_speed, 
    rainfall, 
    moment
  };

  weatherData.push(datat);

  return response.json(datat);
});

app.get("/weather-data/:id", (request, response) => {
  
  const { id } = request.params;
  
  const stationIndex = weatherStations.findIndex(station => station.id == id);

  if (stationIndex < 0) {
    return response.status(404).json({ error: 'Station not found!'});
  }

  const arrayWeatherData = weatherData.filter(weather => weather.id == id);

  return response.status(200).json(arrayWeatherData);
});



module.exports = app;
