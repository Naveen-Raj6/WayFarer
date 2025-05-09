import jwt from 'jsonwebtoken'
import userInstance from '../services/user.services.js';
import asyncHandler from 'express-async-handler';

const auth=asyncHandler(async (req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1]
    }
    

    if(!token){
       let err=new Error("Token is not provided!!")
       err.statusCode=401
        throw err;
    }
    let decodedToken=jwt.verify(token,process.env.JWT_SECRET)

    let user=await userInstance.findUserById(decodedToken.id)
    if(!user){
        let err=new Error("User is not found!!")
        err.statusCode=401
        throw err;
    }
    req.userId=user._id;
    next()
})

export default auth;