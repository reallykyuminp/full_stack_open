import axios from "axios";

const allCountriesUrl = "https://studies.cs.helsinki.fi/restcountries/api/all";
const specificCountryUrl =
  "https://studies.cs.helsinki.fi/restcountries/api/name";

const apiKey = import.meta.env.VITE_SOME_KEY;

const getAll = () => {
  const request = axios.get(allCountriesUrl);
  return request.then((response) => response.data);
};

const getSpecific = (name) => {
  const request = axios.get(`${specificCountryUrl}/${name}`);
  return request.then((response) => response.data);
};

const getWeather = (lat, lon) => {
  const units = "metric";
  const request = axios.get(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`
  );
  return request.then((response) => response.data);
};

export default { getAll, getSpecific, getWeather };
