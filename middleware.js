import jwt from 'jsonwebtoken';

function middleware(req,res){
    try{
       let token = req.header('x-token');
       if(!token){
        return res.status(400).send('required token');
       }
       jwt.verify(token, "jwtSecret",(err, decoded)=>{
        if(err){
            res.json({auth: false, message: "Authentication failed"});
        }else{
            req.userId = decoded.id;
        }
       })
    }
    catch(err){

    }

}

export default middleware;