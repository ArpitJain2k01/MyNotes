const connectToDb= require('./Database/Database')
const express= require('express')

connectToDb()

const app= express()
const port=5000;

app.use(express.json())
app.use('/api/auth',require('./Routes/Auth'))
app.use('/api/notes',require('./Routes/Notes'))


app.listen(port, ()=>{
    console.log("connected at http://localhost:5000")
})