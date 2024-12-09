const FINHUB_API_KEY = import.meta.env.VITE_FINHUB_API_KEY;

export const getPercentageChange = async (symbol: string) => {
  const API_ENDPOINT = "https://finnhub.io/api/v1";
  const response = await fetch(
    `${API_ENDPOINT}/quote?symbol=${symbol}&token=${FINHUB_API_KEY}`
  );
  const data = await response.json();

  return data.dp ? data : null;
};
