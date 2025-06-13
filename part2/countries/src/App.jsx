import { useState, useEffect } from "react";

import countriesServices from "./services/countriesServices";

const Filter = ({ search, setSearch }) => {
  return (
    <div>
      <b>Find Countries:</b>{" "}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

const CountryInfo = ({ displayCountry, displayWeather }) => {
  if (!displayCountry || !displayWeather) {
    return null;
  }

  const weatherIconUrl = `https://openweathermap.org/img/wn/${displayWeather.current.weather[0].icon}@2x.png`;
  return (
    <>
      <h2>Name: {displayCountry.name.common}</h2>
      <div>Capital: {displayCountry.capital}</div>
      <div>Area: {displayCountry.area}</div>
      <h3>Languages</h3>
      <ul>
        {Object.entries(displayCountry.languages).map((entry) => {
          const [key, value] = entry;
          return <li key={key}> {value}</li>;
        })}
      </ul>
      <h3></h3>
      <img src={displayCountry.flags.png} alt={displayCountry.flags.alt} />
      <h3>Weather in {displayCountry.capital}</h3>
      <div>Temperature: {displayWeather.current.temp} &#8451;</div>
      <img
        src={weatherIconUrl}
        alt={displayWeather.current.weather[0].description}
      />
      <div>Wind Speed: {displayWeather.current.wind_speed} m/s</div>
    </>
  );
};

const CountryList = ({ filteredCountries, setDisplayCountry }) => {
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  const handleShowButton = (countryName) => {
    countriesServices
      .getSpecific(countryName)
      .then((country) => {
        setDisplayCountry(country);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      {filteredCountries.map((country) => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => handleShowButton(country.name.common)}>
            Show
          </button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [search, setSearch] = useState("");
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [displayCountry, setDisplayCountry] = useState(null);
  const [displayWeather, setDisplayWeather] = useState(null);

  useEffect(() => {
    countriesServices.getAll().then((countries) => setAllCountries(countries));
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredCountries([]);
      return;
    }

    const matchingCountries = allCountries.filter((country) => {
      const possibleNames = country.altSpellings
        .concat(country.name.common, country.name.official)
        .map((name) => name.toLowerCase());

      return possibleNames.some((name) =>
        name.startsWith(search.toLowerCase())
      );
    });
    setFilteredCountries(matchingCountries);
  }, [search]);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setDisplayCountry(filteredCountries[0]);
    } else {
      setDisplayCountry(null);
    }
  }, [filteredCountries]);

  useEffect(() => {
    if (displayCountry === null) {
      setDisplayWeather(null);
      return;
    }
    const [lat, long] = displayCountry.latlng;
    countriesServices
      .getWeather(lat, long)
      .then((weatherInfo) => setDisplayWeather(weatherInfo));
  }, [displayCountry]);

  return (
    <div>
      <h1> Countries </h1>
      <Filter search={search} setSearch={setSearch}></Filter>
      <CountryList
        filteredCountries={filteredCountries}
        setDisplayCountry={setDisplayCountry}
      ></CountryList>
      <CountryInfo
        displayCountry={displayCountry}
        displayWeather={displayWeather}
      ></CountryInfo>
    </div>
  );
};

export default App;
