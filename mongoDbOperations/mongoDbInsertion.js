import { createRequire } from "module";
const require = createRequire(import.meta.url);

import db from "./mongoConnect.js";
import * as stockData from "../getStockData.js";
import * as list from "../stockData/catalogList.js";
import blockCalculation from "../blockOperations/blockEstimation.js";

const fs = require("fs");

const stockList = await list.itCatalogue;
const dbo = db;

export async function stockDataToMongoDb(stockList) {
  for (var symbols in stockList) {
    const stockDetails = await stockData.stockDetails(stockList[symbols]);

    //var obj = JSON.parse(JSON.stringify(json));
    dbo
      .collection("individualStockData")
      .insertOne(stockDetails, function (err, res) {
        if (err) throw err;
      });
  }
  console.log(`successfully inserted individual stock data into mongodb`);
}

export function insertCharges() {
  const url =
    "mongodb+srv://developer:root@stockfolio.rnte1rd.mongodb.net/?retryWrites=true&w=majority";

  var myobj = fs.readFileSync("defaultTax&Charges.json").toString();
  myobj = JSON.parse(myobj);

  var obj = fs.readFileSync("brokerCharges.json").toString();
  obj = JSON.parse(obj);

  const dbo = db;

  dbo.collection("defaultCharges").insertOne(myobj, function (err, res) {
    if (err) throw err;
  });

  dbo.collection("stockBrokerCharges").insertOne(obj, function (err, res) {
    if (err) throw err;
  });
}

export default async function insertBlockEstimations(table) {
  const blockEstimation = await blockCalculation(table);

  dbo
    .collection("blockEstimations")
    .insertOne(blockEstimation, function (err, res) {
      if (err) throw err;
      console.log(`blockEstimations successfully inserted into mongodb`);
    });
}

insertBlockEstimations("dividentcatalogue");
