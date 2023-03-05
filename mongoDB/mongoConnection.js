import mongoose from "mongoose";


function connectDB(){
    if(mongoose.connections[0].readyState){
        console.log("DataBase atready connected!")
        return 
    }
    mongoose.set("strictQuery",false)
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB connected!")
    }).catch((err)=>{
        console.log('Database connection ERROR :',err)
    })
}

export default connectDB;
