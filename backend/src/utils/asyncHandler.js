

export{asyncHandler}

const asyncHandler = (requestHandter) => async (req,res,next) => {

try {

    await  requestHandter(req,res,next)
    
} catch (error) {n 
     res.status(error.code || 5000).json({
        success:false,
        message:error.message
     }) 

}

}

// 35:40