import React from 'react';
import { ariaSymbolName, getUniqueSymbols } from '../../utils/helper';

export default function AllSymbolsOptions() {
  const allSymbols = getUniqueSymbols();
  const symbolsOption = allSymbols.map((symbol) => (
    <option value={symbol} key={symbol} tabIndex={0} aria-label={ariaSymbolName(symbol)}>
      {symbol}
    </option>
  ));

  return symbolsOption;
}
