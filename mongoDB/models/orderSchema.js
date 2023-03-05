import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types

const schema = new mongoose.Schema({
    user: {
        type: ObjectId,
        ref: "users",
    },
    products: [
        {
            qty: {
                type: Number,
                default: 1
            },
            product: {
                type: ObjectId,
                ref: "products"
            }
        }
    ],
    email: {
        type: String
    },
    total: {
        type: Number
    }
},
    {
        timeseries: true
    })

export default mongoose.models.Orders || mongoose.model("Orders", schema)