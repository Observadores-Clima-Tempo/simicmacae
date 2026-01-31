export const API_KEY =  import.meta.env.VITE_API_KEY;
export const BASE_URL = "https://api.weather.com/v2/pws";
export const commonParams = `&numericPrecision=decimal&format=json&units=m&apiKey=${API_KEY}`;