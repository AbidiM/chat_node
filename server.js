const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const writeRead = require('./routes/writeRead');
const updateDelete = require('./routes/updateDelete');

app.use('/cr', writeRead);
app.use('/ud', updateDelete);
app.use('/', function (req, res, next) {
    res.sendStatus(404);
});


app.listen(PORT, () =>
    console.log('Server running on port: ' + PORT
    ));