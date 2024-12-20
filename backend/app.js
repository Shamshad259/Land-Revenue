require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

require('./config/database');

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/land', require('./routes/land'));

app.listen(process.env.PORT|| 5000, () => {
    console.log(`Server started on port ${process.env.PORT || 5000}`);
});