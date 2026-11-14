const chaveApi = import.meta.env.VITE_API_KEY;

export const BASE_URL = "https://api.weather.com/v2/pws";
export const REQUEST_TIMEOUT = 10_000;

export function getCommonParams() {
  if (!chaveApi) {
    throw new Error(
      "VITE_API_KEY não configurada. Defina a chave da API no arquivo .env.",
    );
  }

  return `&numericPrecision=decimal&format=json&units=m&apiKey=${chaveApi}`;
}
