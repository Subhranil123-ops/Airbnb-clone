const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    title:{
type:String,
required:true
    },
    description:{
type:String
    },
    image:{
    filename:{
        type:String
    },
    url:{
        type:String,
        }},
    price:{
        type:Number
    },
    location:{
        type:String
    },
    country:{
        type:String
    }
});
const Air=mongoose.model("Air",schema);
module.exports=Air;