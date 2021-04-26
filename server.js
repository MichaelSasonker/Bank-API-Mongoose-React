const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bankAPIRoutes = require('./server/routes/bankAPI.routes');
require('./server/db/mongoose.db');

const app = express();
const port = process.env.PORT || 8002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/bank', bankAPIRoutes);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.listen(port, () => console.log(`The server starts at port: ${port}`));
