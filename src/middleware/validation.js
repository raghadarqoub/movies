
export const validation=(Schema)=>{
    return (req,res,next)=>{
        const errorsMassage=[];
        let filterData={...req.body,...req.params,...req.query};
        const {error}=Schema.validate(filterData,{abortEarly:false});
        if(error){ 
            error.details.forEach(err=>{
                const key=err.context.key;
                errorsMassage.push({[key]:err.message});

                });
            return res.status(400).json({message:'validation error',errors:errorsMassage});
        }
        next();
    }
} 