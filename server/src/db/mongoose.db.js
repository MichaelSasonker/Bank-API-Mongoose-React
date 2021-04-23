const mongoose = require('mongoose');
const User = require('../models/user.model');


// const password = process.env.MONGO_PASSWORD;
// console.log(password);

mongoose.connect('mongodb://127.0.0.1:27017/Bank-API', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to the DB server successfully!'))
.catch((err) => console.log(err));

// const u1 = new User({
//     name: 'michael',
//     email: 'michael@hello.com',
//     passportID: '203056833'
// }).save().then(() => {
//     console.log(u1);
// }).catch((err) => {
//     console.log(err)
// })