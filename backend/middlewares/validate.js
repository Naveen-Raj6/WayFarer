const validate=(schema)=>{
    return (req,res,next)=>{
        let {error}=schema.validate(req.body)
        if(error){

            console.log(error);
            
            let err=new Error(error.details[0].message)
            err.statusCode=400
            next(err)
            return;
        }
        next()
    }
}

export default validate;