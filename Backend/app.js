const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
require('./db/Connection');

// create the schema for the database from the models folder
const User = require('./models/UserModel');
const Chat = require('./models/ChatModel');
const Message = require('./models/MessageModel');


const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());


app.listen(port, () => {
    console.log(`Backend started at localhost:${port}`);
});