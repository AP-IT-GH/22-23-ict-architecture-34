const express = require('express');
const apiRoute = require('./api.route');

const app = express();

app.use('/api', apiRoute);

app.use(express.static('public'));

<<<<<<< HEAD
=======


>>>>>>> c6e7b5bd23956af42ce152dd0bca866125d7dda2
app.listen(3000, () => {
    console.log('Upload app listening on port 3000!');
});
