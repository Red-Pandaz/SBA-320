import React from 'react';

const WalletEntry = ({ name, symbol, usdValue, balance, onBalanceChange }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{symbol}</td>
      <td>${usdValue ? usdValue.toFixed(3) : "Loading..."}</td>
      <td>
        <input
          type="number"
          min="0"
          value={balance || 0}
          onChange={(e) => onBalanceChange(e.target.value)}
        />
      </td>
      <td>${((usdValue || 0) * (balance || 0)).toFixed(3)}</td>
    </tr>
  );
};

export default WalletEntry;
