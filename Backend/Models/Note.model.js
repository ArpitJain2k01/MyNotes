const mongoose = require('mongoose')

const noteSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        
    },
    tag:{
        type:String,
        default:"General"
    },
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   }
},{timestamps:true});

const Notes= mongoose.model("Notes",noteSchema)
module.exports= Notes