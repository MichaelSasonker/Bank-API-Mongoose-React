const mongoose = require('mongoose');
// const User = require('../models/user.model');

const password = process.env.MONGO_PASSWORD;

const uri =
	`mongodb+srv://admin:${password}@bank-api.e79zr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(process.env.MONGODB_URI || uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
}).then(() => {
		console.log("Database connect");
});

// const u1 = new User({
//     name: 'michael',
//     email: 'michael@hello.com',
//     passportID: '203056833'
// }).save().then(() => {
//     console.log(u1);
// }).catch((err) => {
//     console.log(err)
// })