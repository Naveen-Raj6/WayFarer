import jwt from 'jsonwebtoken';

const generateToken=async (id)=>{
    return await jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRY
    })
}

export default generateToken; 