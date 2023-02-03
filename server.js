import { createRequire } from "module";
const require = createRequire(import.meta.url);
import pool from "./psqlDbOperations/psqlDBConnect.mjs";

const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const {createProxyMiddleware} = require('http-proxy-middleware');

const port = process.env.PORT || 5000;

//app.use(cors({ origin: "https://wondrous-khapse-b31dfc.netlify.app/", method: ["GET", "POST"] }));

/*app.use(
  '/',
  createProxyMiddleware ({
    target: 'https://backend-c551.onrender.com',
    changeOrigin: true,
    secure: true,
  })
);*/

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


import db from "./mongoDbOperations/mongoConnect.js";
const client = db;

import {
  getITCatalogue,
  getDividentCatalogue,
} from "./psqlDbOperations/psqlQueries.mjs";
import * as modules from "./stockfolioMechanism/stockfolioModules.js";
import itBlockData from "./chartData/ItchartData.js";
import dividentBlockData from "./chartData/DividentchartData.js";
import signUp from "./users/userSignUp.js";
import login from "./users/userLogin.js";
import investedUsers from "./users/userInvest.js";
import usersWatchlist from "./users/userWatchlist.js";
import rebalanceResults from "./agentOpertaions/getRebalanceResults.js";
import blockUpdation from "./agentOpertaions/updateBlocks.js";
import middleware from "./middleware.js";
import updateUser from "./users/updateUser.js";

import getInvestments from "./users/userInvest.js";

app.post("/getInvestments", getInvestments);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/itcatalogue", getITCatalogue);
app.get("/dividentcatalogue", getDividentCatalogue);
app.get("/ItChartData", itBlockData);
app.get("/dividentChartData", dividentBlockData);

app.post("/userSignup", signUp);
app.post("/login", login);
app.post("/investNow", investedUsers);
app.post("/blockUpdate", blockUpdation);
app.post("/addWatchlist", usersWatchlist);
app.post("/updateUser", updateUser);

app.get("/auth", middleware, (req, res) => {
  res.send("Authentication success!");
});

app.post("/getWatchlist", async(req,res)=>{
const { name } = req.body;

  pool.query(
    `SELECT "watchlist" FROM "userswatchlist" WHERE "name" = '${name}' `,
    (err, result) => {
      if (err) console.error(err);
      if (result.rows.length !== 0) {
        const response=[];
                    for(let i=0;  i< result.rows.length; i++){
                            response[i] = JSON.parse(JSON.stringify(result.rows[i].watchlist));
                        }
        res.status(200).json( response );
      } else {
        res.status(422).json({ error: "something went wrong!" });
      }
    }
  );

});

app.post("/rebalanceResults", rebalanceResults);

app.post("/estimate", async (req, res) => {
  const { stock, buyPrice, date, quantity } = req.body;

  try {
    var cagr = await modules.getcagr(stock);
    var userData = await modules.getUserEstimation(stock, date);
    var futureEstimation = await modules.getFutureEstimation(stock, quantity);
    var volatality = await modules.getVolatality(stock);

   var response = {
    cagr: cagr,
    analysis: userData,
    volatality: volatality,
    prediction: futureEstimation,
  };

  res.status(200).send(response);
} catch (err) {
    if (err) {
  res.status(422).send(response);
       throw err;
}
  }
});

app.post("/blockEstimate",(req, res) => {
  const { blockName } = req.body;

  var query = { blockName: `${blockName}` };

  client
    .collection("blockEstimations")
    .find(query)
    .toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    });
});

app.get("/posts", (request, response) => {
  client
    .collection("posts")
    .find({})
    .toArray((error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
