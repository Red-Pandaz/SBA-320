import React, { useState, useEffect } from "react";
import WalletEntry from "./components/WalletEntry";

const currencies = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Litecoin", symbol: "LTC" },
  { name: "Ethereum", symbol: "ETH" },
  { name: "Ethereum Classic", symbol: "ETC" },
  { name: "Stellar Lumens", symbol: "XLM" },
  { name: "Dash", symbol: "DASH" },
  { name: "Ripple", symbol: "XRP" },
  { name: "Zcash", symbol: "ZEC" },
];

export default function App() {
  const [balances, setBalances] = useState({});
  const [usdValues, setUsdValues] = useState({});
  const apiKey = "3DC2D11E-6F10-4CB0-9458-4EA916D4B68C";

  useEffect(() => {
    const storedBalances = JSON.parse(localStorage.getItem("balances"));
    if (storedBalances && Object.keys(storedBalances).length > 0) {
      setBalances(storedBalances);
    }
    getUsdValues();
  }, []);

  useEffect(() => {
    localStorage.setItem("balances", JSON.stringify(balances));
  }, [balances]);

  const getUsdValues = async () => {
    const promises = currencies.map(async ({ symbol }) => {
      const url = `https://rest.coinapi.io/v1/exchangerate/${symbol}/USD?apikey=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return { symbol, price: parseFloat(data.rate.toFixed(3)) };
      } catch (error) {
        console.error(`Error fetching USD value for ${symbol}:`, error);
        return { symbol, price: 0 };
      }
    });

    const prices = await Promise.all(promises);
    const usdValuesObject = {};
    prices.forEach(({ symbol, price }) => {
      usdValuesObject[symbol] = price;
    });
    setUsdValues(usdValuesObject);
  };

  const handleBalanceChange = (symbol, value) => {
    const newValue = Math.max(parseFloat(value) || 0, 0);

    setBalances((prev) => {
      const updatedBalances = {
        ...prev,
        [symbol]: newValue,
      };

      return updatedBalances;
    });
  };

  const totalUsdValue = currencies.reduce((total, { symbol }) => {
    const balance = balances[symbol] || 0;
    const price = usdValues[symbol] || 0;
    return total + balance * price;
  }, 0);

  return (
    <>
      <h1>Wallet Tracker</h1>
      <table>
        <thead>
          <tr>
            <th>Coin Name</th>
            <th>Ticker</th>
            <th>USD Value</th>
            <th>User Balance</th>
            <th>Balance in USD</th>
          </tr>
        </thead>
        <tbody>
          {currencies.map(({ name, symbol }) => (
            <WalletEntry
              key={symbol}
              name={name}
              symbol={symbol}
              usdValue={usdValues[symbol]}
              balance={balances[symbol]}
              onBalanceChange={(value) => handleBalanceChange(symbol, value)}
            />
          ))}
        </tbody>
      </table>
      <div id='total'>
        Total USD Value: ${totalUsdValue.toFixed(2)}
      </div>
    </>
  );
}
