const express = require('express');
const bodyParser = require('body-parser');
require('./db/config.js')
const dotenv = require('dotenv'); 
const cors = require('cors'); 
const { join, dirname } = require('path');
const { fileURLToPath } = require('url'); 
const userRoutes = require('./routes/userRoutes');
const genereRoutes = require('./routes/genereRoutes')
const movieRoutes = require('./routes/movieRoutes')
const theaterRoutes = require('./routes/theaterRoutes')
const showRoutes = require('./routes/showRoutes')




dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(join(__dirname, 'public')));

// middlewares
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.listen(8000, () => console.log('listening to server on port 8000'));


app.use('/user', userRoutes)
app.use('/genere', genereRoutes)
app.use('/movie', movieRoutes)
app.use('/theater', theaterRoutes)
app.use('/show', showRoutes)





