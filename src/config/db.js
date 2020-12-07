const mongoose = require('mongoose');
require('dotenv').config();



const conectDB = async() =>{
    try {
        await mongoose.connect(process.env.DB_MONGO,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        });
        console.log('DB conecting');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}


module.exports = conectDB;