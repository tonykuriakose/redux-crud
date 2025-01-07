const express =require('express')
const dotenv=require('dotenv')
const cors=require('cors')
const cookieParser=require('cookie-parser')
require('./config/db')

const app=express()
dotenv.config()

const userRouter=require('./routers/userRouter')
const adminRouter =require('./routers/adminRouter')

const PORT=process.env.PORT || 5000

app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())


//cors
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))



app.use('/profileimages',express.static('public'))
app.use('/',userRouter)
app.use('/admin',adminRouter)

app.listen(PORT,(error)=>{
    if (error) {
        console.error('Error starting the server:', error);
    } else {
        console.log(`Server running at http://localhost:${PORT}`);
    }
})


