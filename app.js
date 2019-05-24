"use strict";

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//connect to database
mongoose.connect(`mongodb://${config.mongo_user}:${config.mongo_pwd}@localhost:27017/${config.mongo_db}`,{ useNewUrlParser: true });
// Fix deprecationWarning for ensureIndex.
mongoose.set('useCreateIndex', true);


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api'); 

// Handle CORS error by allowing
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept,Authorization");
   if  (req.method === "OPTIONS") {
       res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
       return res.status(200).json({});
   }
   next();
});

// Routes defined here
app.use('/api', apiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// at this point, route is not valid and hence an error
app.use((req,res,next)=>{
   const error = new Error('Not Found!');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            id: error.status
        }
    });
});

module.exports = app;
