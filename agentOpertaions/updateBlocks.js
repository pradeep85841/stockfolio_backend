
import pool from '../psqlDbOperations/psqlDBConnect.mjs';
import * as stockData from '../stockData/getStockData.js';
import * as modules from '../stockfolioMechanism/stockfolioModules.js'
import * as stockfolioDb from '../psqlDbOperations/psqlQueries.mjs'

let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

export default async function blockUpdation(req,res){
    const {action, blockName, stock}=req.body

    if (action === "ADD"){

        const tableExists = await stockfolioDb.tableExists(blockName);

if(tableExists != true){
    res.status(200).send("Block doesn't exists");
}else{
      var currentYear =  new Date().getFullYear();
      var startYear = (currentYear-3);
      var startDate = `${startYear}-12-06`;

      const stockDetails = await stockData.stockDetails(stock);
      const pastData = await stockData.pastData(stock, startDate);
      var currentprice = await stockData.currentPrice(stock);
      var financialRatio = await stockData.financialRatio(stock);
      var volatality = await modules.getVolatality(stock);


            const indication = async(state)=>{
                if (currentprice < stockDetails.priceInfo.open){
                   state = "down";
                } else {
                    state = "up";
                }
                return state;
            }

            const dividentyield = async(rate)=>{
                if (financialRatio.dividendRate != null){
                    rate = financialRatio.dividendRate;
                    return rate;
                }else{
                    rate = 0;
                    return rate;
                }
            }
              var cagr = await modules.getcagr(stock);
              const state = await indication();
              const dividentRate = await dividentyield();

              var time = (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
              const catalogueData = (`INSERT INTO ${blockName}("stock", "pchange","cagr" , "status", "industry", "timestamp", "peratio", "roe", "esp", "volatality", "currentprice", "dividentrate", "marketcap") 
              VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`)
    
             var values = [stockDetails.info.symbol, Number(stockDetails.priceInfo.pChange).toFixed(2), cagr, state, stockDetails.industryInfo.sector, time, Number(financialRatio.forwardPE).toFixed(2), (Number(financialRatio.returnOnEquity).toFixed(2))*100, financialRatio.forwardEps, volatality, currentprice, dividentRate, financialRatio.marketCap];
    
             pool.query(catalogueData, values)
             res.status(200).send("stock added successfull and blockUpdated");
             }
            }
             if (action === "DELETE"){

                const tableExists = await stockfolioDb.tableExists(blockName);
        
        if(tableExists != true){
            res.status(200).send("Block doesn't exists");
        }else{
            pool.query(`DELETE FROM ${blockName} WHERE stock='${stock}'`,(err)=>{
                if(err) throw err;
                res.status(200).send("stock deleted and block updated")
            })
        }
    }

}