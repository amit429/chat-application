const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const chatRoutes = require('./routes/chatRoutes');

dotenv.config();
const app = express();
require('./db/Connection');


const port = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
app.use(cookieParser());
app.use('/api/user/' , userRoutes);
app.use('/api/chat/' , chatRoutes);


app.listen(port, () => {
    console.log(`Backend started at localhost:${port}`);
});