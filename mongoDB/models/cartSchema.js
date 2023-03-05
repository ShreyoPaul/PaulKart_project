import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const schema = new mongoose.Schema({
    user: {
        type : ObjectId,
        ref:"users",
    },
    products : [
        {
            qty:{
                type : Number,
                default : 1
            },
            product : {
                type : ObjectId,
                ref : "products"
            }
        }
    ]
})

export default mongoose.models.carts || mongoose.model("carts",schema)