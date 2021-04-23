const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bankAPIRoutes = require('./routes/bankAPI.routes');
require('./db/mongoose.db');

const app = express();
const port = process.env.PORT || 8002;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/bank', bankAPIRoutes);

app.listen(port, () => console.log(`The server starts at port: ${port}`));
