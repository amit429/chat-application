const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
//const db = process.env.DATABASE;
const db = "mongodb+srv://Amit:amitpile@cluster0.orcgx70.mongodb.net/Chat_Application?retryWrites=true&w=majority"

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successful");
}).catch((err) => console.log(err));