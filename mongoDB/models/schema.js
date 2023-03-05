import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    desc : {
        type: String,
        required :true
    },
    price : {
        type: Number,
        required :true
    },
    picUrl : {
        type: String,
        required :true
    },
})

export default mongoose.models.products || mongoose.model("products",schema)