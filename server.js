////////////////////
// DEPENDENCIES
////////////////////
//get .env vars
require("dotenv").config();
//pull PORT
const {PORT = 4000, MONGODB_URL} = process.env;
//import express
const express = require('express');
//create app object
const app = express();
//import mongoose
const mongoose = require('mongoose');
//import middleware
const cors = require('cors');
const morgan = require('morgan');

//////////////////
//DB CONNECTION
///////////////////
//establish connect
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser:true,
})

//Connection Events
mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log("You are disconnected from mongoose"))
    .on('error', (error) => console.log(error));

///////////////////
//MODELS
///////////////////
const PeopleSchema = new mongoose.Schema ({
    name: String,
    image: String,
    title: String,
});

const People = mongoose.model('People', PeopleSchema)

////////////////
//MIDDLEWARE
////////////////
app.use(cors()); //prevent cors errors, open acces to all origins
app.use(morgan('dev')); //logging
app.use(express.json()); //parse json bodies

///////////////////
//ROUTES
///////////////////
//create test routes
app.get('/', (req, res) => {
    res.send('hello world');
});

//people index
app.get('/people', async (req, res) => {
    try {
        //send all people
        res.json(await People.find({}));
    }
    catch (error) {
        //send error
        res.status(400).json(error)
    }
});
//create
app.post('/people', async (req, res) => {
    try {
        //send all people
        res.json(await People.create(req.body));
    }
    catch (error) {
        //send error
        res.status(400).json(error)
    }
});

//people delete
app.delete('/people/:id', async (req, res) => {
    try {
        //send all people
        res.json(await People.findByIdAndRemove(req.params.id));
    }
    catch (error) {
        //send error
        res.status(400).json(error)
    }
});

//people update
app.put('/people/:id', async (req, res) => {
    try {
        //send all people
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}));
    }
    catch (error) {
        //send error
        res.status(400).json(error)
    }
});
///////////////
//LISTENER
///////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));