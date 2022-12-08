// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const redis = require('redis');

// const REDIS_PORT = process.env.PORT || 6379

// const client = redis.createClient(REDIS_PORT);

// // client.on("error", function(error) {
// //     console.error("Error encountered:", error);
// // })
// // client.on("connect", function(error) {
// //     console.log("Redis connection established");
// // });

// // client.set("ChannelName", "CodeSpace", redis.print);
// // // client.get("ChannelName", redis.print);
// function setResponse(id, data) {
//     return `<h2>{id}</h2>`;
// }

//  const currentPrice = async(stock)=>{
//     try{
//         const { id } = req.params;
//     var res = await fetch(`http://127.0.0.1:8000/livedata?symbol=${stock}`)
//     // return res.json();
//     const data = await res.json();

//     client.setex(id, 3600, data);
//     res.send(setResponse(id, data));
//     }
//     catch{
//         err => console.error(err);
//         res.status(500);
//     }
// } 
