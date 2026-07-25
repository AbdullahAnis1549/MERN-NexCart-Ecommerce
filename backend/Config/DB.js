import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({quiet:true})

const DB = process.env.DATABASE || "mongodb://127.0.0.1:27017/ecommerce"

export const connectDB =async()=>{
    // Serverless environments (Vercel) can reuse a warm instance —
    // agar already connected hai to dobara connect() call na karo
    if (mongoose.connection.readyState === 1) {
        return;
    }
    try{
      await mongoose.connect(DB)
      console.log("connected")
    }
    catch(err){
console.log("not connected")
console.log(err)
throw err
    }
}