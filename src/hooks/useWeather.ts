import axios from 'axios';
// import { z } from 'zod';
import { object, string, number, InferOutput, parse } from 'valibot';
import { SearchType } from '../types';

// Type Guard o Assertion
// function isWeatherResponse(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof (weather as Weather).name === 'string' &&
//     typeof (weather as Weather).main.temp === 'number' &&
//     typeof (weather as Weather).main.temp_max === 'number' &&
//     typeof (weather as Weather).main.temp_min === 'number'
//   );
// }

//Zod
// const Weather = z.object({
//   name: z.string(),
//   main: z.object({
//     temp: z.number(),
//     temp_max: z.number(),
//     temp_min: z.number(),
//   }),
// });

// type Weather = z.infer<typeof Weather>;

// Valibot
const WeatherSchema = object({
  name: string(),
  main: object({
    temp: number(),
    temp_max: number(),
    temp_min: number(),
  }),
});

type Weather = InferOutput<typeof WeatherSchema>;

export default function useWeather() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const fetchWeather = async (search: SearchType) => {
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${apiKey}`;
      const { data } = await axios(geoUrl);

      const lat = data[0].lat;
      const lon = data[0].lon;

      const getWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // Castear el type
      // const { data: weatherResult } = await axios<Weather>(getWeather);
      // console.log(weatherResult);

      // Type Guard
      // const { data: weatherResult } = await axios(getWeather);
      // const result = isWeatherResponse(weatherResult);
      // if (result) {
      //   console.log(weatherResult.name);
      // } else {
      //   console.log('Respuesta mal formada');
      // }

      // const { data: weatherResult } = await axios(getWeather);
      // const result = Weather.safeParse(weatherResult);

      // if (result.success) {
      //   console.log(result.data.name);
      // }

      // Valibot
      const { data: weatherResult } = await axios(getWeather);
      const result = parse(WeatherSchema, weatherResult);
      if (result) {
        console.log(result.name);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    fetchWeather,
  };
}
