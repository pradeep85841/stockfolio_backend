
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import db from './mongoConnect.js';

const client = db;

  
 export  function getBlockEstimation (req, res){

  var query = { blockName: `itcatalogue` };

   client.collection("blockEstimations").find(query).toArray((err, result)=> {
    if (err) throw err;
    res.json({result});
    //return result;
  });
 
 }

 getBlockEstimation();