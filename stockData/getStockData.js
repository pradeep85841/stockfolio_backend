import { createRequire } from "module";
const require = createRequire(import.meta.url);
// const fetch = require('node-fetch');
import fetch from "node-fetch";
const Data = process.env.STOCK_DATA

export const currentPrice = async (stock) => {
  try {
    var res = await fetch(
      `https://34.230.21.175:5000/financeratio?symbol=${stock}`
    );
    // return res.json();
    if (res.ok) {
      return res.json();
    } else {
      return null;
    }
  } catch {
    (err) => console.error(err);
  }
};

export const financialRatio = async (stock) => {
  try {
    var res = await fetch(
      `https://34.230.21.175:5000/financeratio?symbol=${stock}`
    );
    return res.json();
  } catch {
    (err) => console.error(err);
  }
};

export const pastData = async (stock, date, endDate) => {
  try {
    var res = await fetch(
      `https://34.230.21.175:5000/pastdata?symbol=${stock}&start=${date}&end=${endDate}`
    );
    if (res.ok) {
      return res.json();
    } else {
      return null;
    }
  } catch {
    (err) => console.error(err);
  }
};
export const stockDetails = async (stock) => {
  try {
    var res = await fetch(
      `https://34.230.21.175:5000/financeratio?symbol=${stock}`
    );
    return res.json();
  } catch {
    (err) => console.error(err);
  }
};

export default pastData;
