import { BINANCE_EXCHANGE_URL } from './config';

export async function fetchAllSymbols() {
  try {
    const response = await fetch(BINANCE_EXCHANGE_URL);
    const data = await response.json();
    const symbols = data.symbols.map((symbol) => symbol.symbol);

    return symbols;
  } catch (error) {
    return [];
  }
}
