const mongoose = require('mongoose');

require('dotenv').config();

const dbConnection = async() => {


    try {

        //await mongoose.connect('mongodb+srv://mean_user:ddB0BnfczvvZvhB5@cluster0.nflfr.mongodb.net/hospitaldb', {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true


        });

        console.log('db online')

    } catch (error) {

        console.log(error)
        throw new Error('Error a la hora de inicar la BD')
    }




}

module.exports = {

    dbConnection
}