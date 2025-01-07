const mongoose=require('mongoose')
require('dotenv').config()

const DB_URI= process.env.DB_URI;

const connectDB = mongoose.connect(DB_URI).then(()=>{
    console.log("DB connected");
}).catch((error)=>{
    console.error('Error connecting to the database:', error.message);
    process.exit(1);
})

module.exports=connectDB;