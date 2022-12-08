import { createRequire } from "module";
const require = createRequire(import.meta.url);

import * as list from '../stockData/catalogList.js';
import * as stockData from '../stockData/getStockData.js';
import {lowROEStocks, highPeStocks, lowESPStocks} from '../psqlDbOperations/psqlQueries.mjs';


export default async function rebalancing(catalogue){

let sector = await list.itSectorList;
let lowROE = await lowROEStocks();  
let peRatio = await highPeStocks();
let lowESP = await lowESPStocks();

let arr = lowROE.concat(lowESP)
arr = arr.concat(peRatio)

let catalogueStocks = new Set();
let peList = [];
let earningList = [];

let i = 0;
let j = 0;
while(i < sector.length){

       let  catalogueRatio = await  stockData.financialRatio(arr[j]);
       let  sectorRatio = await ListstockData.financialRatio(sector[i]);

       if(catalogueRatio.forwardPE > sectorRatio.forwardPE && sectorRatio.dividendRate !== null && catalogueRatio.marketCap < sectorRatio.marketCap){
       peList[i] = sectorRatio.symbol;
        i++;
        j=0;
        }else if(((Number(catalogueRatio.returnOnEquity).toFixed(2))*100) < ((Number(sectorRatio.returnOnEquity).toFixed(2))*100) && catalogueRatio.forwardEps < sectorRatio.forwardEps){
        earningList[i] = sectorRatio.symbol;
         i++;
         j=0;
       }else if(j == arr.length-1){
        j=0;
        i++;
       }else{
        j++;
       }
    }
    //console.log(peList);
    //console.log(earningList);
    const result = {
      "suggested":peList,
      "performers":earningList,
      "lowPerformers":arr
    }
    return result;

}

