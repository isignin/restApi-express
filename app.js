const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW + '@localhost:27017/myapp', {
    useMongoClient: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

// Api routes defined here
app.use('/users', userRoutes);

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
