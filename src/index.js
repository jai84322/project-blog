const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route.js');
const app =express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://jai84322:Bing%401234%23@demo.3li78.mongodb.net/project1-blog?retryWrites=true&w=majority"
,{useNewUrlParser: true})
.then(()=>console.log('MongoDB is connected'))
.catch(err => console.log(err));

app.use('/',route);
app.listen(process.env.PORT || 3000, function(){
    console.log('express app running on PORT '+(process.env.PORT || 3000))
});
