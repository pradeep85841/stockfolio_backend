import { createRequire } from "module";
const require = createRequire(import.meta.url);

import pool from "../psqlDbOperations/psqlDBConnect.mjs";
import * as stockData from "../stockData/getStockData.js";
import * as list from "../stockData/catalogList.js";
import * as modules from "../stockfolioMechanism/stockfolioModules.js";
import * as stockfolioDb from "../psqlDbOperations/psqlQueries.mjs";

//var fetch = require('node-fetch');

let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

var Catalogue = list.itCatalogue;
createBlock("itcatalogue", Catalogue);

export default async function createBlock(tableName, catalogueList) {
  const tableExists = await stockfolioDb.tableExists(tableName);

  if (tableExists != true) {
    pool.query(
      `CREATE TABLE ${tableName}(id SERIAL PRIMARY KEY, stock varchar(150), pchange float,
cagr float, status varchar(30), industry varchar(255), timestamp date, peratio float, roe float, esp float, volatality float, currentprice float, dividentrate float, marketcap varchar(20))`,
      (err) => {
        if (err) throw err;
      }
    );
  }
  for (var symbols in catalogueList) {
    var currentYear = new Date().getFullYear();
    var startYear = currentYear - 3;
    var startDate = `${startYear}-12-06`;

    const stockDetails = await stockData.stockDetails(catalogueList[symbols]);
    const pastData = await stockData.pastData(
      catalogueList[symbols],
      startDate
    );
    var currentprice = await stockData.currentPrice(catalogueList[symbols]);
    var financialRatio = await stockData.financialRatio(catalogueList[symbols]);
    var volatality = await modules.getVolatality(catalogueList[symbols]);

    const indication = async (state) => {
      if (currentprice < stockDetails.priceInfo.open) {
        state = "down";
      } else {
        state = "up";
      }
      return state;
    };

    const dividentyield = async (rate) => {
      if (financialRatio.dividendRate != null) {
        rate = financialRatio.dividendRate;
        return rate;
      } else {
        rate = 0;
        return rate;
      }
    };
    var cagr = await modules.getcagr(catalogueList[symbols]);
    const state = await indication();
    const dividentRate = await dividentyield();

    var time =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    const catalogueData = `INSERT INTO ${tableName}("stock", "pchange","cagr" , "status", "industry", "timestamp", "peratio", "roe", "esp", "volatality", "currentprice", "dividentrate", "marketcap") 
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;

    var values = [
      stockDetails.info.symbol,
      Number(stockDetails.priceInfo.pChange).toFixed(2),
      cagr,
      state,
      stockDetails.industryInfo.sector,
      time,
      Number(financialRatio.forwardPE).toFixed(2),
      Number(financialRatio.returnOnEquity).toFixed(2) * 100,
      financialRatio.forwardEps,
      volatality,
      currentprice,
      dividentRate,
      financialRatio.marketCap,
    ];

    pool.query(catalogueData, values);
  }
  console.log("block creation successfull");
}
