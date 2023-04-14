import React from 'react';
import { getUniqueSymbols } from '../../utils/helper';

export default function AllSymbolsOptions() {
  const allSymbols = getUniqueSymbols();
  const symbolsOption = allSymbols.map((symbol) => (
    <option value={symbol} key={symbol} tabIndex={0}>
      {symbol}
    </option>
  ));

  return symbolsOption;
}
