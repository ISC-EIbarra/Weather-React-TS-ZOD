import { useMemo, useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { SearchType } from '../types';

/* Zod */
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

const initialState = {
  name: '',
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;
  const fetchWeather = async (search: SearchType) => {
    setLoading(true);
    setWeather(initialState);
    try {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiKey}`;
      const { data } = await axios(geoUrl);

      // City Check
      if (!data[0]) {
        setNotFound(true);
        return;
      }

      const lat = data[0].lat;
      const lon = data[0].lon;

      const getWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      /* Zod */
      const { data: weatherResult } = await axios(getWeather);
      const result = Weather.safeParse(weatherResult);

      if (result.success) {
        setWeather(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    fetchWeather,
    hasWeatherData,
    loading,
    notFound,
  };
}
