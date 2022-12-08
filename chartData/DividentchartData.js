import * as list from '../stockData/catalogList.js';
import * as stockData from '../stockData/getStockData.js';

export default async function dividentBlockData(req,res){
    var dividentCatalogue = await list.dividentCatalogue;
    let blockCurrentPrice=0;
    let i = 0;

    var date = new Date();
    var hour = date.getHours();

  
    for (i in dividentCatalogue){
        var currentprice = await stockData.currentPrice(dividentCatalogue[i]);
        blockCurrentPrice += parseFloat(currentprice);

    }
    let date_ob = new Date();
    let data ={
        "price": blockCurrentPrice,
        "date": date_ob,
    }
    console.log(data)
    res.status(200).json(data)
    

}
