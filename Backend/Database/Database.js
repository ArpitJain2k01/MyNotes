const mongoose= require('mongoose')

const mongoDbURI="mongodb://localhost:27017/MyNotes"

const connectToDb= async ()=>{
    await mongoose.connect(mongoDbURI)
}
module.exports= connectToDb;