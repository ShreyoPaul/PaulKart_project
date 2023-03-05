import mongoose from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type : String,
        required : true
    },
    email : {
        type: String,
        required :true
    },
    pass : {
        type: String,
        required :true
    },
    role : {
        type: String,
        required: false,
        default:'User',
        enum: ["User","Seller","Admin"]
    },
},{
    timestamps: true
})

export default mongoose.models.users || mongoose.model("users",schema)