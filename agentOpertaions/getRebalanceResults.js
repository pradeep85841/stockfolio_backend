
import rebalancing from '../stockfolioMechanism/rebalancing.js'

export default async function rebalanceResults(req,res){
    console.log("in get rebalance results.js")
const {sector} = req.body;

try{
    let rebalanced = await rebalancing(sector);
    res.status(200).send(rebalanced);
}
catch{
    (err) => console.error(err);
    res.status(200).send("something went wrong");
}

} 